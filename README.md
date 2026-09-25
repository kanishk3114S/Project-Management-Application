<div align="center">
  
# 🏕️ ProjectCamp
**Absolute clarity for your product team.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A premium, full-stack project management application engineered to handle hierarchical task architecture, role-based access control, and seamless team collaboration. 

[Explore the Live App](https://project-management-application-six.vercel.app/) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

- 🔐 **Bulletproof Authentication**
  - Secure JWT-based auth with short-lived access tokens and sliding refresh tokens.
  - Cross-domain `HttpOnly` cookie handling with fallback Bearer token support.
  - Complete email verification and password reset pipelines.
- 🏗️ **Hierarchical Architecture**
  - Break down massive scopes into manageable projects, tasks, and subtasks.
  - Optimistic UI updates for a snappy, zero-latency user experience.
- 🛡️ **Role-Based Access Control (RBAC)**
  - Granular permissions. Project creators are automatically assigned `Admin` roles.
  - Only Admins can modify project settings or invite new members.
- 📊 **Real-Time Velocity & Boards**
  - Track task trajectories across custom statuses (To Do, In Progress, Done).
  - Rich member assignment and filtering via complex MongoDB aggregation pipelines.
- 📎 **Robust File Handling**
  - Seamlessly attach files and images to tasks using integrated Multer middleware.

## 🛠️ Architecture & Tech Stack

### Frontend (Client)
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + custom glassmorphism UI
- **State Management:** React Context API (AuthContext, ProjectContext)
- **Routing:** React Router v6
- **Network:** Axios (with custom request interceptors)
- **Icons:** Lucide React

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Email Services:** Nodemailer + Mailtrap
- **File Uploads:** Multer

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI
- Mailtrap account (for email testing)

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/project-management-system.git
   cd project-management-system
   ```

2. **Setup the Backend**
   ```sh
   npm install
   ```
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   CORS_ORIGIN=http://localhost:5173
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_super_secret_key
   ACCESS_TOKEN_EXP=1d
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
   REFRESH_TOKEN_EXPIRY=10d
   MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_SMTP_PORT=2525
   MAILTRAP_SMTP_USER=your_mailtrap_user
   MAILTRAP_SMTP_PASS=your_mailtrap_pass
   FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
   SERVER_URL=http://localhost:8000
   ```

3. **Setup the Frontend**
   ```sh
   cd projectManagementSystem
   npm install
   ```
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

4. **Run the Application**
   Open two terminal tabs.
   - Terminal 1 (Backend): `npm run dev`
   - Terminal 2 (Frontend): `npm run dev`

## 🗄️ Database Schema Design

ProjectCamp utilizes an interconnected NoSQL schema design:
* **Users:** Stores authentication credentials, avatars, and verification tokens.
* **Projects:** The root container for team collaboration.
* **ProjectMembers:** A mapping table facilitating the many-to-many relationship between Users and Projects, while storing specific RBAC roles (`Admin`, `Member`).
* **Tasks:** Linked via `ObjectId` refs to both Projects and Users, supporting statuses and rich text descriptions.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  Made with ❤️ by Kanishk Sharma
</div>
