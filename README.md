# 🗳️ Voting App

A secure and role-based online voting application built with Node.js, Express, MongoDB, and JWT authentication. Users can register, log in, and vote for candidates. Admins can manage candidate data but are restricted from voting.

---

## 🚀 Features

- 👤 User authentication with JWT
- 🔒 Role-based access (admin / user)
- 🧾 One vote per user logic enforced
- 📊 Candidate management with vote tracking
- 🧠 MongoDB for data storage with Mongoose ODM
- ✅ Voter history stored with timestamps

---

## 📁 Project Structure

├── controllers/ # Route handler logic
├── models/ # Mongoose schemas (User, Candidate)
├── routes/ # Express routers
├── middleware/ # JWT authentication and role checking
├── config/ # DB config, constants
├── app.js # Main application file
├── .env # Environment variables (JWT, DB URI)
└── README.md

