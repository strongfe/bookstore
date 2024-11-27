import { createContext, useState, useContext } from 'react'

const BookContext = createContext(null)

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)

  return (
    <BookContext.Provider value={{ books, setBooks, selectedBook, setSelectedBook }}>
      {children}
    </BookContext.Provider>
  )
}

export const useBook = () => {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error('useBook must be used within a BookProvider')
  }
  return context
} 