거래(Transaction) 관련 엔드포인트들을 정리해드리겠습니다.
거래 엔드포인트 목록 (Transaction Endpoints)
1. 거래 생성
엔드포인트: POST /api/transactions
기능: 새로운 책 구매 거래를 생성하고 Stripe 결제를 시작합니다
필요한 데이터:
- 응답: 결제 정보와 거래 정보를 반환합니다
2. 거래 완료
엔드포인트: PUT /api/transactions/:transactionId/complete
기능: 거래를 완료 상태로 변경하고 구매 목록을 업데이트합니다
응답: 완료된 거래 정보를 반환합니다
3. 사용자 거래 내역 조회
엔드포인트: GET /api/transactions
기능: 로그인한 사용자의 모든 거래 내역을 조회합니다
응답: 거래 목록을 반환합니다
4. 환불 처리
엔드포인트: POST /api/transactions/:transactionId/refund
기능: 특정 거래에 대한 환불을 처리합니다
응답: 환불 처리 결과를 반환합니다
5. Stripe 웹훅
엔드포인트: POST /api/transactions/webhook
기능: Stripe로부터의 이벤트를 처리합니다 (결제 성공/실패 등)
응답: 이벤트 수신 확인을 반환합니다

각 엔드포인트는 인증된 사용자만 접근할 수 있으며(웹훅 제외), JWT 토큰을 통해 사용자 인증이 필요합니다.