import Link from 'next/link'

export default async function Header() {
  return (
    <header className={'h-16 px-3 border-2 flex items-center'}>
      <Link href='/'>
        <h1>Notion on Next.js</h1>
      </Link>
    </header>
  )
}
