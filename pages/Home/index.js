import Header from '../components/header';
import Head from 'next/head';
import SquigglyLines from '../components/SquigglyLines';
import Router from 'next/router';
import React, { useState, useEffect } from 'react';

import {
  RadixDappToolkit,
  ManifestBuilder,
  Decimal,
  Bucket,
  Expression,
  ResourceAddress,
  ComponentAddress,
} from '@radixdlt/radix-dapp-toolkit';

import { TransactionApi} from '@radixdlt/babylon-gateway-api-sdk';

// const StateContext = createContext();
export default function Home() {
  // const [accountAddress, setAccountAddress] = useState();
  const accountAddress = 'account_tdx_b_1pqmg9ewm4cmczvykk483k76y50l0d8f7urmec36kj8jq529jsn';
  // const [componentAddress, setComponentAddress] = useState();
  let componentAddress = 'component_tdx_b_1qxnw7xu6fvfxy280uceq9shqe3a4t8jn3khxqjd4tm2smk8xa0';
  const [balance, setBalance] = useState();
  const [accountName, setAccountName] = useState();

  // Instantiate Gateway SDK
  const transactionApi = new TransactionApi();

  // Instantiate Radix Dapp Toolkit
  const xrdAddress = 'resource_tdx_b_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8z96qp';
  const alkyneFi_package = 'package_tdx_b_1qy0u0yuw9rph95w80356gtug8rhmsvuam9m07svsd08sjxm583';
  const dAppId = 'account_tdx_b_1ppglnkmukh36l2dfw3uygvgjf2jsfypl885u9840md7swrvpmj';

  let rdt = RadixDappToolkit
  useEffect(() => {
    rdt = RadixDappToolkit(
      { dAppDefinitionAddress: dAppId, dAppName: 'AlkyneFi' },
      { networkId: 11 })
    console.log(rdt.requestData.accounts);
  }, []);

  console.log('dApp Toolkit: ', rdt);

  const instantiate = async () => {
    // ************ Create the manifest for the transaction ************
    console.log(accountAddress);
    let manifest = new ManifestBuilder()
      .withdrawFromAccountByAmount(accountAddress, 1000, xrdAddress)
      .takeFromWorktopByAmount(1000, xrdAddress, 'xrd_bucket')
      .callMethod(accountAddress, 'create_proof', [ResourceAddress(xrdAddress)])
      .callFunction(alkyneFi_package, '', 'instantiate_tradex', [
        Bucket('xrd_bucket'),
        '',
        Decimal('1'),
        xrdAddress,
        // Map<ResourceAddress(xrdAddress), Map<ResourceAddress(xrdAddress), ComponentAddress("")>>,
        Map < ResourceAddress,
        Map >
          (ResourceAddress(xrdAddress),
          Map < ResourceAddress,
          ComponentAddress > (ResourceAddress(xrdAddress), ComponentAddress(''))),
      ])
      .build()
      .toString();
    console.log('Instantiate Manifest: ', manifest);

    // Submit transaction
    let commitReceipt = await submitTransaction(manifest);

    console.log(commitReceipt);
    // componentAddress = commitReceipt.details.referenced_global_entities[0];
    // resourceAddress = commitReceipt.details.referenced_global_entities[1];
  };

  const create_and_fund_wallet = async (amount) => {
    // ************ Create the manifest for the transaction ************
    let manifest = new ManifestBuilder()
      .callMethod(accountAddress, 'lock_fee', ['Decimal("10")'])
      .callMethod(accountAddress, 'create_proof', [ResourceAddress(xrdAddress)])
      .withdrawFromAccountByAmount(accountAddress, Number(amount), xrdAddress)
      .takeFromWorktopByAmount(Number(amount), xrdAddress, 'xrd_bucket')
      .callMethod(componentAddress, 'create_and_fund_wallet', [Bucket('xrd_bucket')])
      .callMethod(accountAddress, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
      .build()
      .toString();

    // Submit transaction
    let commitReceipt = await submitTransaction(manifest);

    // Show the receipt on the DOM
    console.log(JSON.stringify(commitReceipt.details.receipt, null, 2));
  };

  const create_and_fund_wallet_rtm = async (amount ) => {
    let manifest = `CALL_METHOD
    ComponentAddress("component_sim1qgehpqdhhr62xh76wh6gppnyn88a0uau68epljprvj3sxknsqr")
    "lock_fee"
    Decimal("100");
    CALL_METHOD
    ComponentAddress("${accountAddress}")
    "create_proof"
    ResourceAddress("${xrdAddress}");
CALL_METHOD
    ComponentAddress("${accountAddress}")
    "withdraw_by_amount"
    Decimal("2")
    ResourceAddress("${xrdAddress}");
TAKE_FROM_WORKTOP
    ResourceAddress("${xrdAddress}")
    Bucket("bucket1");    
CALL_METHOD
    ComponentAddress("${componentAddress}")
    "create_and_fund_wallet"
    Bucket("bucket1")
    ;
CALL_METHOD
    ComponentAddress("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP");`

    // Submit transaction
    let commitReceipt = await submitTransaction(manifest);

    // Show the receipt on the DOM
    console.log(JSON.stringify(commitReceipt.details.receipt, null, 2));
  }

  const fund_existing_wallet = async (amount, owner_badge) => {
    // ************ Create the manifest for the transaction ************
    let manifest = new ManifestBuilder()
      .callMethod(accountAddress, 'lock_fee', ['Decimal("10")'])
      .callMethod(accountAddress, 'create_proof', [ResourceAddress(xrdAddress)])
      .withdrawFromAccountByAmount(accountAddress, Number(amount), xrdAddress)
      .callMethod(accountAddress, 'create_proof', [ResourceAddress(owner_badge)])
      .popFromAuthZone('owner_badge')
      .takeFromWorktopByAmount(Number(amount), xrdAddress, 'xrd_bucket')
      .callMethod(componentAddress, 'create_and_fund_wallet', [Bucket('xrd_bucket'), Proof('owner_badge')])
      .build()
      .toString();

    // Submit transaction
    let commitReceipt = await submitTransaction(manifest);

    console.log(JSON.stringify(commitReceipt.details.receipt, null, 2));
  };

  const trade = async (pool_address, amount, resource_address, owner_badge) => {
    // ************ Create the manifest for the transaction ************
    let manifest = new ManifestBuilder()
      .callMethod(accountAddress, 'lock_fee', ['Decimal("10")'])
      .callMethod(accountAddress, 'create_proof', [ResourceAddress(xrdAddress)])
      .callMethod(accountAddress, 'create_proof', [ResourceAddress(owner_badge)])
      .popFromAuthZone('owner_badge')
      .callMethod(componentAddress, 'trade', [
        ComponentAddress(pool_address),
        Decimal(amount),
        ResourceAddress(resource_address),
        Proof('owner_badge'),
      ])
      .build()
      .toString();

    console.log('trade manifest: ', manifest);

    // fetch commit reciept from gateway api
    let commitReceipt = await submitTransaction(manifest);

    // Show the receipt on the DOM
    console.log(JSON.stringify(commitReceipt.details.receipt, null, 2));
  };

  const withdraw_payment = async () => {};

  async function submitTransaction(manifest) {
    console.log(manifest);

    const result = await rdt
      .sendTransaction({
        transactionManifest: String(manifest),
        version: 1,
      })
      .map((response) => response.transactionHash);

    if (result.isErr()) {
      throw result.error;
    }

    let status = await transactionApi.transactionStatus({
      transactionStatusRequest: {
        intent_hash_hex: result.value.transactionIntentHash,
      },
    });
    console.log('Transaction status: ', status);

    // fetch commit reciept from gateway api
    let commitReceipt = await transactionApi.transactionCommittedDetails({
      transactionCommittedDetailsRequest: {
        transaction_identifier: {
          type: 'intent_hash',
          value_hex: result.value.transactionIntentHash,
        },
      },
    });
    console.log('Commit receipt: ', commitReceipt);

    return commitReceipt;
  }

  const [wallet, setWallet] = useState('');
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const [pools, setPools] = useState([
    {
      name: 'Pool 1',
      address: '0x1234567890',
      balance: '$1000.00',
      apr: '10%',
    },
    {
      name: 'Pool 2',
      address: '0x1234567890',
      balance: '$1000.00',
      apr: '10%',
    },
    {
      name: 'Pool 3',
      address: '0x1234567890',
      balance: '$1000.00',
      apr: '10%',
    },
    {
      name: 'Pool 4',
      address: '0x1234567890',
      balance: '$1000.00',
      apr: '10%',
    },
    {
      name: 'Pool 5',
      address: '0x1234567890',
      balance: '$1000.00',
      apr: '10%',
    },
  ]);

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>AlkyneFi</title>
      </Head>

      <Header />
      <radix-connect-button />
      <button onClick={() => create_and_fund_wallet_rtm(1)}>Fund Existing Wallet</button>
      <main className=" flex flex-1 w-full flex-col p-12 sm:mt-20 mt-20 background-gradient gap-16">
        {modal && <ModalAmount setModal={setModal} modalType={modalType} />}
        <div className="flex flex-row justify-between">
          <div className="grid">
            <p className="text-xl">Wallet Address</p>
            <p className="ml-5 text-xl leading-7 text-gray-500">
              {true ? '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' : 'Not Connected'}
            </p>
            <p className="text-xl">Balance</p>
            <p className="ml-5 text-xl leading-7 text-gray-500">$1000.00</p>
          </div>
          <Investment amt="$1000.00" setModal={setModal} setModalType={setModalType} />
        </div>
        <div>
          <h1 className="font-display text-5xl font-bold tracking-normal text-gray-300 ">
            Invest Here{' '}
            <span className="relative whitespace-nowrap text-blue-600">
              <SquigglyLines />
              <span className="relative">using AlkyneFi</span>
            </span>{' '}
          </h1>
        </div>
        <div
          className="
        grid grid-cols-4 gap-4
        "
        >
          {pools.map((pool) => (
            <Pools name={pool.name} address={pool.address} balance={pool.balance} apr={pool.apr} />
          ))}
        </div>
      </main>
    </div>
  );
}

function Investment({ amt, setModal, setModalType }) {
  return (
    <div className=" bg-white text-black p-5 rounded-lg flex flex-col gap-4 items-center justify-center opacity-80 hover:opacity-100 cursor-pointer">
      <div className="flex-row flex gap-4 items-center">
        <p className="font-bold text-lg text-gray-900">AlkyneFi Wallet Balance</p>
        <p className="font-bold text-2xl text-gray-900">{amt}</p>
      </div>
      <div className="flex flex-row w-full justify-evenly">
        <button
          className="bg-blue-600 rounded-lg p-2 text-white"
          onClick={() => {
            setModal(true);
            setModalType('Invest');
          }}
        >
          Invest
        </button>
        <button
          className="bg-blue-600 rounded-lg p-2 text-white"
          onClick={() => {
            setModal(true);
            setModalType('Withdraw');
          }}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}

function Pools({ name = 'Pool 1', address = '0x1234567890', balance = '$1000.00', apr = '10%' }) {
  const [amount, setAmount] = useState('');

  return (
    <div className="flex flex-col gap-4 bg-gray-600 hover:bg-gray-900 p-5 w-fit rounded-lg opacity-60 hover:opacity-100">
      <div className="flex flex-row justify-between gap-2">
        <div className="flex flex-col gap-2">
          <p className="text-xl">{name}</p>
          <p className="text-xl">{address}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xl">{balance}</p>
          <p className="text-xl">{apr}</p>
        </div>
      </div>
      <input
        type="text"
        className="rounded-lg text-black p-1"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
      />
      <button
        className="bg-blue-600 rounded-lg p-2 text-white"
        onClick={() => {
          alert(amount);
        }}
      >
        Invest
      </button>
    </div>
  );
}

function ModalAmount({ setModal, modalType }) {
  const [value, setValue] = useState();
  return (
    <div
      onClick={(e) => {
        setModal(false);
      }}
      className="z-10 bg-gray-900 bg-opacity-80 fixed top-0 left-0 w-full text-black h-full flex justify-center items-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col bg-white w-1/2 h-1/2 rounded-lg items-center justify-center"
      >
        <div className="flex flex-row justify-between items-center p-12 w-full">
          <p className="text-2xl font-bold">{modalType} Amount</p>
          <p
            className="text-2xl cursor-pointer"
            onClick={() => {
              setModal(false);
            }}
          >
            x
          </p>
        </div>
        <div className="flex flex-col h-full gap-5">
          <p className="text-2xl font-bold">Amount</p>
          <input
            type="text"
            className="rounded-lg text-black p-1 border-2"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button
            className="bg-blue-600 rounded-lg p-2 text-white"
            onClick={() => {
              alert(value);
            }}
          >
            {modalType}
          </button>
        </div>
      </div>
    </div>
  );
}
