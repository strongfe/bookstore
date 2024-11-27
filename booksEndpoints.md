# 책 API 엔드포인트

## 공개 접근 가능한 엔드포인트

### 1. 모든 책 조회
- **Method**: GET
- **Endpoint**: `/api/books`
- **Access**: Public
- **Description**: 모든 활성화된 책 목록을 조회합니다
- **Response**: 책 목록 배열

### 2. 카테고리별 책 조회
- **Method**: GET
- **Endpoint**: `/api/books/category/:category`
- **Access**: Public
- **Description**: 특정 카테고리에 속한 책들을 조회합니다
- **Response**: 해당 카테고리의 책 목록 배열

### 3. 책 검색
- **Method**: GET
- **Endpoint**: `/api/books/search`
- **Access**: Public
- **Description**: 검색 조건에 맞는 책을 찾습니다
- **Response**: 검색 결과 책 목록 배열

### 4. 특정 책 상세 조회
- **Method**: GET
- **Endpoint**: `/api/books/:id`
- **Access**: Public
- **Description**: ID를 기반으로 특정 책의 상세 정보를 조회합니다
- **Response**: 책 상세 정보

## 인증이 필요한 엔드포인트

### 5. 새 책 등록
- **Method**: POST
- **Endpoint**: `/api/books`
- **Access**: Private (인증 필요)
- **Description**: 새로운 책을 등록합니다
- **Required Fields**:
  - title (제목)
  - author (저자)
  - description (설명)
  - price (가격)
  - category (카테고리)
- **Files**:
  - pdf (최대 1개)
  - coverImage (최대 1개)

### 6. 책 정보 수정
- **Method**: PUT
- **Endpoint**: `/api/books/:id`
- **Access**: Private (인증 필요)
- **Description**: 기존 책 정보를 수정합니다
- **Required Fields**: 새 책 등록과 동일
- **Files**: 새 책 등록과 동일

### 7. 책 삭제
- **Method**: DELETE
- **Endpoint**: `/api/books/:id`
- **Access**: Private (인증 필요)
- **Description**: 특정 책을 삭제합니다

### 8. 내가 등록한 책 조회
- **Method**: GET
- **Endpoint**: `/api/books/user/my-books`
- **Access**: Private (인증 필요)
- **Description**: 현재 로그인한 사용자가 등록한 책 목록을 조회합니다

### 9. 구매한 책 조회
- **Method**: GET
- **Endpoint**: `/api/books/user/purchased`
- **Access**: Private (인증 필요)
- **Description**: 현재 로그인한 사용자가 구매한 책 목록을 조회합니다
