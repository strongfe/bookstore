# Project Overview

This project is a Book Marketplace platform where users can upload books in PDF format for others to purchase. It is built using the MERN stack (MongoDB, Express, React, Node.js), with additional technologies like Vite, Stripe for payments, and Tailwind CSS for styling. The system handles user authentication, file uploads, secure payments, and a clean user interface.

# Frontend Features

_User Authentication_

- Registration, login, and logout functionality with JWT stored in local storage or cookies.
- Protected routes using React Router DOM, accessible only after authentication.

_Book Upload_

- Drag-and-drop interface for uploading books (using react-dropzone).
- User interface for viewing uploaded books with details (title, description, price).

_Book Purchase_

- Integration with Stripe for users to purchase books.
- Purchase confirmation and display of receipt after successful transaction.

_Book Preview & Details_

- Users can preview book details (description, price) before purchasing.
- Optional image preview or sample pages for users to view before buying.

_User Dashboard_

- A personal dashboard for users to manage their uploaded books and purchase history.
- Option to edit or delete uploaded books.

_Admin Dashboard_

- Admin panel for viewing users, books, and transactions.
- Admin capabilities for managing users and content.

_Responsive UI_

- Modern, responsive design using Tailwind CSS.
- Ant Design components for a polished and interactive UI (e.g., forms, buttons, tables).

_Context API for State Management_

- Centralized state management using React's Context API for user authentication and book data.

_Routing and Navigation_

- Navigation between different pages (Home, Upload Book, Book Details, Purchase, etc.) using React Router DOM.
- Public and private routes to control access based on authentication status.

_Notifications and Alerts_

- Success and error notifications for user actions (e.g., upload successful, payment failed) using libraries like react-toastify.

# Current Folder Structure

.
├── client # Frontend (React + Vite)
│ ├── public # Public assets (e.g., images, favicon)
│ ├── src # Source files
│ │ ├── components # Reusable components (e.g., buttons, forms)
│ │ ├── context # Context API setup (e.g., authentication, state management)
│ │ ├── pages # Page components (e.g., home, book details, upload)
│ │ ├── routes # React Router routes
│ │ ├── services # Axios services (e.g., API calls)
│ │ └── App.js # Main app component

# Resources to use

_Vite_

- https://vitejs.dev/guide/

_Payments_

- https://stripe.com/docs/api

_Frontend UI_

- https://tailwindcss.com/docs
- https://ant.design/docs/react/introduce

_React Libraries_

- https://reactrouter.com/web/guides/quick-start
- https://reactjs.org/docs/context.html
