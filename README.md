# bookstore
이 프로젝트는 전자책 마켓플레이스의 백엔드 서버입니다. 사용자 인증, 전자책 관리, 구매 시스템을 포함한 RESTful API를 제공합니다.
EbookStore API Server
프로젝트 설명
이 프로젝트는 전자책 마켓플레이스의 백엔드 서버입니다. 사용자 인증, 전자책 관리, 구매 시스템을 포함한 RESTful API를 제공합니다.
주요 기능
사용자 인증 (회원가입/로그인)
관리자 권한 관리
전자책 CRUD 작업
구매 및 거래 관리
사용자 프로필 관리
기술 스택
Node.js
Express.js
MongoDB
JWT 인증
Bcrypt (비밀번호 암호화)
시작하기
필수 조건
Node.js v20.17.0 이상
MongoDB

# 저장소 클론
git clone [repository-url]

# 프로젝트 폴더로 이동
cd server

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필요한 값들을 설정

# 서버 실행
npm start

PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookmarketplace
JWT_SECRET=your_jwt_secret_key


API 엔드포인트
인증 관련
POST /api/auth/register - 회원가입
POST /api/auth/login - 로그인
GET /api/auth/profile - 프로필 조회
PUT /api/auth/profile - 프로필 수정
PUT /api/auth/change-password - 비밀번호 변경
관리자 기능
GET /api/admin/users - 전체 사용자 조회
DELETE /api/admin/users/:id - 사용자 삭제
GET /api/admin/books - 전체 도서 조회
GET /api/admin/books/:id - 특정 도서 조회
DELETE /api/admin/books/:id - 도서 삭제
GET /api/admin/transactions - 전체 거래내역 조회
GET /api/admin/transactions/:id - 특정 거래내역 조회
PUT /api/admin/users/:id/role - 사용자 권한 수정

server/
├── controllers/     # 요청 처리 로직
├── middleware/      # 미들웨어 함수들
├── models/         # MongoDB 모델
├── routes/         # API 라우트 정의
├── utils/          # 유틸리티 함수들
├── .env            # 환경 변수
├── .gitignore      # Git 제외 파일 목록
├── package.json    # 프로젝트 설정 및 의존성
└── server.js       # 메인 서버 파일
