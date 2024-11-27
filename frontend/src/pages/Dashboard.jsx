import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { BookCard } from '../components/books/BookCard'

const Dashboard = () => {
  const { user } = useAuth()
  const [myBooks, setMyBooks] = useState([])
  const [purchasedBooks, setPurchasedBooks] = useState([])

  useEffect(() => {
    // 더미 데이터로 초기화
    setMyBooks([
      {
        _id: '1',
        title: '업로드한 책 1',
        description: '내가 업로드한 책입니다.',
        price: 15000,
        author: user?.name || '작성자',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ])

    setPurchasedBooks([
      {
        _id: '2',
        title: '구매한 책 1',
        description: '내가 구매한 책입니다.',
        price: 20000,
        author: '다른 작성자',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ])
  }, [user])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">내가 업로드한 책</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myBooks.map(book => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">구매한 책</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {purchasedBooks.map(book => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard 