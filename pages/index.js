import Header from './components/header'
import Head from 'next/head'
import SquigglyLines from './components/SquigglyLines'
import Router from 'next/router'
export default function Home() {

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>AlkyneFi</title>
      </Head>

      <Header />
      <main className=" flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20 background-gradient">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
          Lorem Ipsum is simply{' '}
          <span className="relative whitespace-nowrap text-blue-600">
            <SquigglyLines />
            <span className="relative">using Radix</span>
          </span>{' '}
          for everyone.
        </h1>
        <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400  text-gray-500 leading-7">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h2>
      </main>
    </div>
  )
}
