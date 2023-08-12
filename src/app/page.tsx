import Link from 'next/link'
import { getDatabase } from '@/lib/notion'

export default async function Home() {
  const posts = await getDatabase()

  return (
    <div className={'flex justify-center'}>
      <ol>
        {posts.map((post) => {
          if (
            'last_edited_time' in post &&
            'properties' in post &&
            'Name' in post.properties &&
            'title' in post.properties.Name &&
            'id' in post
          ) {
            const date = new Date(post.last_edited_time).toLocaleString()
            const titleText = post.properties.Name.title
              .map((textItem) => textItem.plain_text)
              .join('')
            let coverUrl = ''
            if (post.cover?.type === 'external') {
              coverUrl = post.cover.external.url
            }

            return (
              <li key={post.id}>
                <div className='max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4'>
                  <Link href={`/${post.id}`}>
                    <div className='aspect-w-16 aspect-h-9 overflow-hidden rounded-t-lg'>
                      <img className='object-cover w-full h-full' src={coverUrl} alt='' />
                    </div>
                  </Link>
                  <div className='p-5'>
                    <Link href={`/${post.id}`}>
                      <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                        {titleText}
                      </h5>
                    </Link>
                    <Link
                      href={`/${post.id}`}
                      className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                    >
                      詳細を見る
                      <svg
                        className='w-3.5 h-3.5 ml-2'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 14 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M1 5h12m0 0L9 1m4 4L9 9'
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </li>
            )
          }
          return 'データが不足しています。'
        })}
      </ol>
    </div>
  )
}
