import Link from 'next/link'

export default async function Header() {
  return (
    <header className={'h-16 px-3 flex items-center justify-center'}>
      <Link href='/'>
        <img src='/logo.svg' alt='logo' className={'h-8'} />
      </Link>
    </header>
  )
}
