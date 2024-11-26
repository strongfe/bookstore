Initiate a new transaction:
Method: POST
URL: /api/transactions/initiate
Authentication: Required
Controller: transactionController.initiateTransaction
Confirm a transaction:
Method: POST
URL: /api/transactions/confirm
Authentication: Required
Controller: transactionController.confirmTransaction
Get all transactions for a user:
Method: GET
URL: /api/transactions/user
Authentication: Required
Controller: transactionController.getUserTransactions 4. Get a specific transaction:
Method: GET
URL: /api/transactions/:id
Authentication: Required
Controller: transactionController.getTransaction
