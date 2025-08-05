# <h1 align="center" style="font-weight: bold;">Collaborative Whiteboard 🎨</h1>

<p align="center">
<a href="#tech">Technologies</a> •
<a href="#started">Getting Started</a> •
<a href="#routes">API Endpoints</a> •
<a href="#features">Features</a> •
<a href="#colab">Collaborators</a> •
<a href="#contribute">Contribute</a> 
</p>

<p align="center">A real-time collaborative whiteboard application built with MERN stack, featuring live drawing, image sharing, and seamless collaboration</p>

<p align="center">
<a href="https://github.com/kalpm1110/whiteboard-project">🎨 Visit this Project</a>
</p>

<h2 id="technologies">💻 Technologies</h2>

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,javascript,css,html&theme=dark" alt="Tech Stack Icons" />
</div>

**Frontend:**
- <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/> - UI Library
- <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io"/> - Real-time communication
- <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/> Canvas API - Drawing functionality
- <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/> - Styling
- React Context API - State management

**Backend:**
- <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/> - Runtime environment
- <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js"/> - Web framework
- <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io"/> - Real-time bidirectional communication
- <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/> - Database for user data and board sessions
- <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"/> - MongoDB object modeling

**Authentication & Storage:**
- <img src="https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink" alt="JWT"/> - User authentication
- <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white" alt="Cloudinary"/> - Image upload and storage
- <img src="https://img.shields.io/badge/bcrypt-338033?style=for-the-badge&logo=letsencrypt&logoColor=white" alt="bcrypt"/> - Password hashing

**Additional Tools:**
- <img src="https://img.shields.io/badge/CORS-FF6B6B?style=for-the-badge" alt="CORS"/> - Cross-origin resource sharing
- <img src="https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black" alt="dotenv"/> - Environment variables
- <img src="https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white" alt="Nodemon"/> - Development server

<h2 id="features">✨ Features</h2>

- 🎨 **Real-time Drawing** - Collaborative drawing with multiple users
- 🖼️ **Image Upload** - Upload and share images via Cloudinary
- 🔐 **User Authentication** - Secure login/register with JWT
- 👥 **Multi-user Support** - Multiple users can draw simultaneously
- 🎯 **Drawing Tools** - Pen, eraser, shapes, colors, and brush sizes
- 💾 **Save Boards** - Save and retrieve whiteboard sessions
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Real-time Sync** - Instant synchronization across all connected clients

<h2 id="started">🚀 Getting Started</h2>

Here you can run the collaborative whiteboard project locally

<h3>Prerequisites</h3>

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- [Git](https://git-scm.com/)

<h3>Cloning</h3>

Clone the project repository:

```bash
git clone https://github.com/kalpm1110/whiteboard-project.git
cd whiteboard-project
```

<h3>Config .env variables</h3>

Create a `.env` file in the root directory with the following variables:

```yaml
# Database
MONGODB_URI=mongodb://localhost:27017/whiteboard
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/whiteboard

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

<h3>Installation & Starting</h3>

Install dependencies and start the application:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Start both backend and frontend concurrently
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only (in another terminal)
cd client
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

<h2 id="routes">📍 API Endpoints</h2>

Here are the main API routes for the whiteboard application:

| Route | Description |
|-------|-------------|
| <kbd>POST /api/auth/register</kbd> | Register a new user [details](#post-register-detail) |
| <kbd>POST /api/auth/login</kbd> | Authenticate user [details](#post-login-detail) |
| <kbd>GET /api/auth/verify</kbd> | Verify JWT token [details](#get-verify-detail) |
| <kbd>POST /api/boards</kbd> | Create a new whiteboard [details](#post-boards-detail) |
| <kbd>GET /api/boards/:id</kbd> | Get whiteboard by ID [details](#get-boards-detail) |
| <kbd>PUT /api/boards/:id</kbd> | Update whiteboard data [details](#put-boards-detail) |
| <kbd>POST /api/upload</kbd> | Upload image to Cloudinary [details](#post-upload-detail) |

<h3 id="post-register-detail">POST /api/auth/register</h3>

**REQUEST**
```json
{
  "username": "kalpmehta",
  "email": "krmehta_b23@et.vjti.in",
  "password": "securePassword123"
}
```

**RESPONSE**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "username": "kalpmehta",
    "email": "krmehta_b23@et.vjti.in"
  }
}
```

<h3 id="post-login-detail">POST /api/auth/login</h3>

**REQUEST**
```json
{
  "email": "krmehta_b23@et.vjti.in",
  "password": "securePassword123"
}
```

**RESPONSE**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "username": "kalpmehta",
    "email": "krmehta_b23@et.vjti.in"
  }
}
```

<h3 id="post-upload-detail">POST /api/upload</h3>

**REQUEST** (FormData)
```
Content-Type: multipart/form-data
file: [image file]
```

**RESPONSE**
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg",
  "publicId": "sample"
}
```

## 🔌 Socket.io Events

The application uses Socket.io for real-time functionality:

| Event | Description |
|-------|-------------|
| `join-room` | Join a specific whiteboard room |
| `drawing` | Send drawing data to other users |
| `clear-canvas` | Clear the entire canvas |
| `image-upload` | Share uploaded image with room |
| `cursor-position` | Share cursor position with others |

<h2 id="colab">🤝 Collaborators</h2>

<p>Special thanks to all contributors who made this project possible:</p>

<table>
<tr>
<td align="center">
<a href="https://github.com/kalpm1110">
<img src="https://avatars.githubusercontent.com/u/kalpm1110?v=4" width="100px;" alt="Kalp Mehta Profile Picture"/><br>
<sub>
<b>Kalp Mehta</b>
</sub>
</a>
</td>
<td align="center">
<a href="https://github.com/sumedhcharjan">
<img src="https://avatars.githubusercontent.com/u/sumedhcharjan?v=4" width="100px;" alt="Sumedh Charjan Profile Picture"/><br>
<sub>
<b>Sumedh Charjan</b>
</sub>
</a>
</td>
</tr>
</table>

<h2 id="contribute">📫 Contribute</h2>

We welcome contributions! Here's how you can help improve the collaborative whiteboard:

1. **Fork and Clone**
   ```bash
   git clone https://github.com/kalpm1110/whiteboard-project.git
   cd whiteboard-project
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make Your Changes**
   - Add new drawing tools
   - Improve real-time synchronization
   - Enhance UI/UX
   - Fix bugs or optimize performance

4. **Follow Commit Patterns**
   ```bash
   git commit -m "feat: add new brush tool"
   git commit -m "fix: resolve canvas clearing issue"
   git commit -m "docs: update API documentation"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/amazing-new-feature
   ```
   Then open a Pull Request with a clear description of your changes!

<h3>Development Guidelines</h3>

- Follow React best practices for frontend components
- Use meaningful variable and function names
- Add comments for complex drawing algorithms
- Test real-time functionality with multiple browser tabs
- Ensure mobile responsiveness for touch drawing

<h3>Helpful Resources</h3>

- [📝 How to create a Pull Request](https://www.atlassian.com/git/tutorials/making-a-pull-request)
- [💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
- [🎨 Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [⚡ Socket.io Documentation](https://socket.io/docs/v4/)

---

<div align="center">

**Built with ❤️ using MERN Stack**

*Happy Drawing! 🎨*

</div>
