import Header from '../components/header'
import Head from 'next/head'
import SquigglyLines from '../components/SquigglyLines'
import { useState } from 'react'
import Router from 'next/router'
export default function Home() {
  const [wallet, setWallet] = useState('')
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
  ])
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>AlkyneFi</title>
      </Head>

      <Header />
      <main className=" flex flex-1 w-full flex-col p-12 sm:mt-20 mt-20 background-gradient gap-16">
        <div className="flex flex-row justify-between">
          <div className="grid">
            <p className="text-xl">Wallet Address</p>
            <p className="ml-5 text-xl leading-7 text-gray-500">
              1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2
            </p>
            <p className="text-xl">Balance</p>
            <p className="ml-5 text-xl leading-7 text-gray-500">$1000.00</p>
          </div>
          <Investment amt="$1000.00" />
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
            <Pools
              name={pool.name}
              address={pool.address}
              balance={pool.balance}
              apr={pool.apr}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

function Investment({ amt }) {
  return (
    <div className="bg-white text-black p-5 rounded-lg flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer" 
    onClick={() => {Router.push('/Investment')}}  
  >
      <div className="flex-row flex gap-4 items-center">
        <p className="font-bold text-lg text-gray-900">Total Money Invested</p>
        <p className="font-bold text-2xl text-gray-900">{amt}</p>
      </div>
    </div>
  )
}

function Pools({
  name = 'Pool 1',
  address = '0x1234567890',
  balance = '$1000.00',
  apr = '10%',
}) {
  const [amount, setAmount] = useState('')

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
          setAmount(e.target.value)
        }}
      />
      <button
        className="bg-blue-600 rounded-lg p-2 text-white"
        onClick={() => {
          alert(amount)
        }}
      >
        Invest
      </button>
    </div>
  )
}
