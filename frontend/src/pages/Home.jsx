import { useEffect, useState } from 'react'
import { useBook } from '../context/BookContext'
import { BookCard } from '../components/books/BookCard'

const Home = () => {
  const { books, setBooks } = useBook()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 더미 데이터로 초기화
    const dummyBooks = [
      {
        _id: '1',
        title: '자바스크립트 기초',
        description: '자바스크립트를 처음부터 배워봅시다.',
        price: 25000,
        author: '김개발',
        coverImage: 'https://via.placeholder.com/300x400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'React 마스터하기',
        description: 'React의 모든 것을 알아봅니다.',
        price: 35000,
        author: '이리액트',
        coverImage: 'https://via.placeholder.com/300x400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    setBooks(dummyBooks)
    setLoading(false)
  }, [setBooks])

  if (loading) return <div>로딩중...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">추천 도서</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  )
}

export default Home 