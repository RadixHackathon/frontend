import React, { useContext, createContext } from 'react';

import {
  RadixDappToolkit,
  ManifestBuilder,
  Decimal,
  Bucket,
  Expression,
  ResourceAddress,
} from '@radixdlt/radix-dapp-toolkit';

// There are four classes exported in the Gateway-SDK These serve as a thin wrapper around the gateway API
// API docs are available @ https://betanet-gateway.redoc.ly/
import { TransactionApi, StateApi, StatusApi, StreamApi } from '@radixdlt/babylon-gateway-api-sdk';

const StateContext = createContext();
export const StateContextProvider = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState();
  const [balance, setBalance] = useState();
  const [accountName, setAccountName] = useState();

  // Instantiate Gateway SDK
  const transactionApi = new TransactionApi();
  const stateApi = new StateApi();
  const statusApi = new StatusApi();
  const streamApi = new StreamApi();

  // Instantiate Radix Dapp Toolkit
  const dAppId = 'account_tdx_b_1ppglnkmukh36l2dfw3uygvgjf2jsfypl885u9840md7swrvpmj';
  const rdt = RadixDappToolkit(
    { dAppDefinitionAddress: dAppId, dAppName: 'AlkyneFi' },
    (requestData) => {
      requestData({
        accounts: { quantifier: 'atLeast', quantity: 1 },
      }).map(({ data: { accounts } }) => {
        // add accounts to dApp application state
        console.log('account data: ', accounts);
        setAccountName(accounts[0].label);
        setAccountAddress(accounts[0].address);
      });
    },
    { networkId: 11 }
  );
  console.log('dApp Toolkit: ', rdt);

  const xrdAddress = 'resource_tdx_b_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8z96qp';
  const alkyneFi_package = 'package_tdx_b_1qxnw7xu6fvfxy280uceq9shqe3a4t8jn3khxqjd4tm2smk8xa0';

  // TODO: Instantiate fn
  const instantiate = async () => {
    // ************ Create the manifest for the transaction ************
    let manifest = new ManifestBuilder()
      .callMethod(accountAddress, 'create_proof', [ResourceAddress(xrdAddress)])
      .callFunction(alkyneFi_package, '', 'instantiate_tradex', [Decimal('10'), `"${flavor}"`])
      .build()
      .toString();
    console.log('Instantiate Manifest: ', manifest);
    // Send manifest to extension for signing
    const result = await rdt.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });

    if (result.isErr()) throw result.error;

    console.log('Intantiate WalletSDK Result: ', result.value);

    // ************ Fetch the transaction status from the Gateway API ************
    let status = await transactionApi.transactionStatus({
      transactionStatusRequest: {
        intent_hash_hex: result.value.transactionIntentHash,
      },
    });
    console.log('Instantiate TransactionApi transaction/status:', status);

    // ************* fetch component address from gateway api and set componentAddress variable **************
    let commitReceipt = await transactionApi.transactionCommittedDetails({
      transactionCommittedDetailsRequest: {
        transaction_identifier: {
          type: 'intent_hash',
          value_hex: result.value.transactionIntentHash,
        },
      },
    });
    console.log('Instantiate Committed Details Receipt', commitReceipt);

    // ****** set componentAddress and resourceAddress variables with gateway api commitReciept payload ******
    // componentAddress = commitReceipt.details.receipt.state_updates.new_global_entities[0].global_address <- long way -- shorter way below ->
    componentAddress = commitReceipt.details.referenced_global_entities[0];
    document.getElementById('componentAddress').innerText = componentAddress;

    resourceAddress = commitReceipt.details.referenced_global_entities[1];
    document.getElementById('gumAddress').innerText = resourceAddress;
  };

  const create_and_fund_wallet = async (amount) => {
    // ************ Create the manifest for the transaction ************
    let manifest = new ManifestBuilder()
      .withdrawFromAccountByAmount(accountAddress, Number(amount), xrdAddress)
      .takeFromWorktopByAmount(Number(amount), xrdAddress, 'xrd_bucket')
      .callMethod(componentAddress, 'create_and_fund_wallet', [Bucket('xrd_bucket')])
      .callMethod(accountAddress, 'deposit_batch', [Expression('ENTIRE_WORKTOP')])
      .build()
      .toString();

    console.log('create_and_fund_wallet manifest: ', manifest);

    // Send manifest to extension for signing
    const result = await rdt.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });

    if (result.isErr()) throw result.error;

    console.log('Create and Fund wallet getMethods Result: ', result);

    // Fetch the transaction status from the Gateway SDK
    let status = await transactionApi.transactionStatus({
      transactionStatusRequest: {
        intent_hash_hex: result.value.transactionIntentHash,
      },
    });
    console.log('Create and Fund wallet TransactionAPI transaction status: ', status);

    // fetch commit reciept from gateway api
    let commitReceipt = await transactionApi.transactionCommittedDetails({
      transactionCommittedDetailsRequest: {
        transaction_identifier: {
          type: 'intent_hash',
          value_hex: result.value.transactionIntentHash,
        },
      },
    });
    console.log('Create and Fund wallet Committed Details Receipt', commitReceipt);

    // Show the receipt on the DOM
    console.log(JSON.stringify(commitReceipt.details.receipt, null, 2));
  };

  const fund_existing_wallet = async (amount) => {
    // ************ Create the manifest for the transaction ************
    let manifest = new ManifestBuilder()
      .callMethod(accountAddress, 'lock_fee', ['Decimal("20")'])
      .withdrawFromAccountByAmount(accountAddress, Number(amount), xrdAddress)
      .takeFromWorktopByAmount(Number(amount), xrdAddress, 'xrd_bucket')
      .callMethod(componentAddress, 'create_and_fund_wallet', [Bucket('xrd_bucket')])
      .build()
      .toString();

    // Submit transaction
    let commitReceipt = await submitTransaction(manifest);

    console.log(JSON.stringify(commitReceipt.details.receipt, null, 2));
  };

  const trade = async (pool_address, amount, ) => {
    // ************ Create the manifest for the transaction ************
    let manifest = new ManifestBuilder()
      .callMethod(componentAddress, 'trade', [Decimal('1')])
      .build()
      .toString();

    console.log('trade manifest: ', manifest);

    // fetch commit reciept from gateway api
    let commitReceipt = await submitTransaction(manifest);

    // Show the receipt on the DOM
    console.log(JSON.stringify(commitReceipt.details.receipt, null, 2));
  };

  const withdraw_payment = async () => {

  };

  async function submitTransaction(manifest) {
    console.log(manifest);
    const result = await rdt
      .sendTransaction({
        transactionManifest: manifest,
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

  return (
    <StateContext.Provider
      value={{
        address,
        instantiate,
        create_and_fund_wallet,
        fund_existing_wallet,
        trade,
        withdraw_payment,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
