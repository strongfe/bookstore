import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'

export const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('비밀번호는 최소 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다.');
      return false;
    }
    setPasswordError('');
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePassword(formData.password)) {
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다')
      return
    }
    
    setIsLoading(true)
    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      toast.success('회원가입이 완료되었습니다!')
      navigate('/login')
    } catch (error) {
      console.error('회원가입 실패:', error)
      toast.error(error.response?.data?.message || '회원가입에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                validatePassword(e.target.value);
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
              title="비밀번호는 최소 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다."
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !!passwordError}
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Register 