import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'

const BookUpload = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    author: '',
    coverImage: null,
    pdfFile: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 실제 구현에서는 API 호출
      console.log('업로드할 데이터:', formData)
      navigate('/dashboard')
    } catch (error) {
      console.error('업로드 실패:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">책 업로드</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">가격</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">저자</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">표지 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, coverImage: e.target.files?.[0] || null})}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PDF 파일</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({...formData, pdfFile: e.target.files?.[0] || null})}
              className="mt-1 block w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            업로드
          </Button>
        </form>
      </div>
    </div>
  )
}

export default BookUpload 