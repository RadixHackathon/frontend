import Image from 'next/image'
import Link from 'next/link'

export default function Header({ photo }) {
  return (
    <header className="flex flex-row xs:flex-row justify-between items-center w-full mt-3 border-b pb-7 sm:px-4 px-2 border-gray-500 gap-2">
      <Link href="/Home" className="flex space-x-2">
        <Image
          alt="header text"
          src="/bed.svg"
          className="sm:w-10 sm:h-10 w-9 h-9"
          width={24}
          height={24}
        />
        <h1 className="sm:text-3xl text-xl font-bold ml-2 tracking-tight">
          AlkyneFi
        </h1>
      </Link>

      <a
        className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-500 bg-blue-600 font-medium transition"
        href="https://google.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p>Connect Wallet</p>
      </a>
    </header>
  )
}

