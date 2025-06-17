# PETXMAFIA Web Application

## Overview

PETXMAFIA is a user-friendly marketplace for buying and selling pets and pet accessories. This React-based web application, built with Vite, provides a seamless experience for users to browse, search, and interact with pet-related listings.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Authentication
- Login and registration functionality
- Support for Google, Facebook, email, and mobile number authentication

### Search and Discovery
- Advanced search for pets, pet categories, and pet services
- Filtering options by location, price, breed, and age
- Detailed view of individual advertisements

### Messaging System
- In-app messaging between users and ad owners
- Real-time notifications for new messages

### Advertisement Management
- Users can create and manage their own advertisements
- Support for pets, accessories, and services listings

### Knowledge Hub
- Access to admin-curated articles
- Article bookmarking feature

## Project Structure

```
petxmafia-web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   └── PrivateRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Search.jsx
│   │   ├── AdDetails.jsx
│   │   ├── AddAdvert.jsx
│   │   ├── Messages.jsx
│   │   ├── Profile.jsx
│   │   ├── KnowledgeHub.jsx
│   │   └── ArticleDetails.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/petxmafia/petxmafia-web.git
   ```

2. Navigate to the project directory:
   ```
   cd petxmafia-web
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Usage

After starting the development server, open your browser and navigate to `http://localhost:3000` (or the port specified in your console output) to access the PETXMAFIA web application.

## Technologies Used

- React
- Vite
- React Router
- Context API for state management
- Axios for API requests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

---

This README provides a comprehensive overview of the PETXMAFIA web application, including its features, project structure, setup instructions, and more. It's designed to give developers and stakeholders a clear understanding of the project and how to get started with it.