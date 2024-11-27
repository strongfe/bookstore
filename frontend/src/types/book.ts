export interface Book {
  _id: string
  title: string
  description: string
  price: number
  author: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  email: string
  name: string
  // ...
} 