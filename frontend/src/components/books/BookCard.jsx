import { useNavigate } from 'react-router-dom'
import { Button } from '../common/Button'

export const BookCard = ({ book }) => {
  const navigate = useNavigate()

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      {book.coverImage && (
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="w-full h-48 object-cover rounded-md mb-4" 
        />
      )}
      <h3 className="text-xl font-bold mb-2">{book.title}</h3>
      <p className="text-gray-600 mb-2">{book.author}</p>
      <p className="text-gray-800 mb-4">{book.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">${book.price}</span>
        <Button 
          onClick={() => navigate(`/books/${book._id}`)}
          size="sm"
        >
          자세히 보기
        </Button>
      </div>
    </div>
  )
} 