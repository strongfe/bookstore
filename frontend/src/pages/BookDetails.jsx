import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/common/Button'

const BookDetails = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // API 호출 대신 더미 데이터 사용
    setBook({
      _id: id || '1',
      title: '샘플 책',
      description: '이 책은 샘플 데이터입니다. 자세한 설명이 들어갈 자리입니다.',
      price: 25000,
      author: '샘플 작가',
      coverImage: 'https://via.placeholder.com/400x600',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    setLoading(false)
  }, [id])

  const handlePurchase = () => {
    console.log('구매 로직 구현 예정')
  }

  if (loading) return <div>로딩중...</div>
  if (!book) return <div>책을 찾을 수 없습니다.</div>

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">저자: {book.author}</p>
            <p className="text-gray-800 mb-6">{book.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{book.price.toLocaleString()}원</span>
              <Button onClick={handlePurchase}>
                구매하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails 