import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../common/Button'

export const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              북스토어
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">대시보드</Link>
                <Link to="/upload">책 업로드</Link>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={logout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">로그인</Link>
                <Link to="/register">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 