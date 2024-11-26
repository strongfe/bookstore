# 관리자 엔드포인트

## 사용자 관리
### 모든 사용자 조회
- Method: GET
- Endpoint: /api/auth/admin/users
- 응답: 사용자 목록 (비밀번호 제외)

### 사용자 삭제
- Method: DELETE
- Endpoint: /api/auth/admin/users/:id
- 응답: 삭제된 사용자 정보

## 책 관리
### 모든 책 조회
- Method: GET
- Endpoint: /api/auth/admin/books
- 응답: 책 목록 (작성자 정보 포함)

### 특정 책 조회
- Method: GET
- Endpoint: /api/auth/admin/books/:id
- 응답: 책 상세 정보

### 책 삭제
- Method: DELETE
- Endpoint: /api/auth/admin/books/:id
- 응답: 삭제된 책 정보

## 거래 관리
### 모든 거래 내역 조회
- Method: GET
- Endpoint: /api/auth/admin/transactions
- 응답: 거래 목록 (구매자, 책 정보 포함)

### 특정 거래 내역 조회
- Method: GET
- Endpoint: /api/auth/admin/transactions/:id
- 응답: 거래 상세 정보

## 공통 사항
- 모든 엔드포인트는 관리자 권한 필요
- 인증: JWT 토큰 + 관리자 권한 확인
- 에러 코드:
  - 401: 인증 실패
  - 403: 권한 없음
  - 404: 리소스 없음
  - 500: 서버 오류
