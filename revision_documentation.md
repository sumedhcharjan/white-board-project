# WhiteBoard Collaborative Application: Codebase Documentation & Interview Preparation Guide

This document provides a comprehensive review of the WhiteBoard project repository, detailing the architecture, design choices, data flows, concepts, and algorithms. It is designed to serve as both a detailed project manual and a thorough technical interview preparation guide.

---

## 1. Project Overview

### What the Project Does (Plain Language)
This project is a **real-time collaborative whiteboard** web application. It allows users to create virtual rooms and invite others using a room code. In these rooms, participants can draw on a shared digital canvas, text-chat in a live side-panel, view active participants, and request drawing access. The host of the room can approve or deny drawing privileges and kick users out. Finally, users can snapshot the canvas, title it, and save it directly to their profiles to view or download later.

### Problem Solved & Target Audience
- **The Problem:** Remote teams, educators, and brainstormers often need a zero-friction, instant visual workspace. Generic drawing tools lack built-in multi-user coordination, while corporate platforms require complex sign-ups, lack host moderation controls, or do not save drawings persistently for easy retrieval.
- **The Target Audience:** Small teams, educators, students, and casual collaborators looking for a simple, fast, and moderated digital canvas.

### What Makes This Project Non-Trivial (Compared to Basic Tutorials)
Rather than just piping raw mouse coordinates over a WebSocket, this project implements production-grade architecture patterns:
1. **Dynamic Guest Moderation (Host Approval Flow):** Instead of granting immediate write access to anyone joining, guest drawing is locked by default. The system manages a stateful approval transaction where guest requests (`handleReq`) trigger a custom toast on the host's screen. The host's decision (`grantDrawP`) is written back to the MongoDB database and pushed back to the client, modifying local event handlers dynamically.
2. **Persistent Whiteboard Rehydration:** Whiteboard strokes are stored persistently in MongoDB (`RoomDrawing` collection). When a client joins or reconnects, the database is queried, and the canvas is fully rehydrated from historical stroke segments.
3. **Canvas Aspect-Ratio Preservation via `ResizeObserver`:** Standard canvas tutorials suffer from pixel stretching and coordinates drift on window resize. The application uses a React `ResizeObserver` wrapper that recalculates pixel dimensions without stretching the drawings and triggers a redraw of existing vector coordinates.
4. **Cloudinary Asset Pipeline & Attachment Download Trigger:** Users can snapshot their HTML5 Canvas into a base64 Data URL, upload it to Cloudinary cloud storage, link the CDN URL to their profile, and force a browser file-download using Cloudinary's attachment headers.
5. **Host-Controlled Lifecycle Cascades:** To prevent orphan room sessions, the backend listens for host disconnects/leaves. If a host exits, the server deletes the room from the database and uses WebSockets to force-navigate all connected guests back to their dashboards.

---

## 2. Tech Stack Summary

The following table lists every language, framework, library, database, and library used, along with the precise reason for its selection in the codebase:

| Tech Category | Technology / Library | Selection Justification (Based on Actual Code Usage) |
| :--- | :--- | :--- |
| **Frontend Core** | React 19 (JavaScript) | Manages stateful views, handles component lifecycles, and binds canvas events to real-time socket events. |
| **Bundler** | Vite 6 | Provides hot module replacement (HMR) and bundles frontend assets, including tailwind configurations. |
| **Styling** | Tailwind CSS 4 | Used for responsive design, layout structures, and styling modals/chat views (using custom classes). |
| **Routing** | React Router DOM 7 | Configures routes like `/`, `/dashboard`, `/room/:roomid`, and `/profile` using `createBrowserRouter` in [App.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/App.jsx). |
| **Auth Provider** | `@auth0/auth0-react` | Handles user signup, login, session persistence, and provides secure user identity profiles (`user.sub`). |
| **HTTP Client** | Axios 1.8 | Performs HTTP requests to the backend API (e.g. creating/leaving rooms, fetching profile drawings). |
| **Real-time Engine**| `socket.io-client` 4.8 | Connects to the backend server over persistent WebSockets, orchestrating drawings, chat, and access requests. |
| **UI Alerts** | `react-hot-toast` | Renders dynamic, programmatically controlled alerts (such as the Host's "Grant/Deny" authorization popup). |
| **Backend Framework**| Express 5 (Node.js) | Acts as the HTTP REST API server handling user profiles, room validation, and serving static parameters. |
| **Real-time Server**| `socket.io` 4.8 | Handles WebSocket handshakes, maintains room-based scopes, and broadcasts canvas elements/chat logs. |
| **Database ODM** | Mongoose 8 (MongoDB) | Connects to MongoDB, enforces schemas for rooms, users, and stroke segments, and runs operations like `$push`. |
| **ID Generator** | Nanoid 5 | Generates 6-character room IDs (e.g., `nanoid(6)`) for room registration and joining. |
| **Media Host** | Cloudinary 2 | Uploads base64 PNG data URLs generated by the canvas and stores them on a fast, queryable CDN. |
| **Dev Tool** | Nodemon 3 | Automatically restarts the Node server on codebase modifications during development. |

---

## 3. Project Structure Walkthrough

### Codebase File Tree
```
white-board-project/
├── backend/
│   ├── controllers/
│   │   ├── Room.controller.js       # Handles REST logic for room creation, joining, leaving, and kicking users.
│   │   ├── Users.controller.js      # Handles saving drawings to Cloudinary and database, and deleting/fetching sketches.
│   │   └── drawingcontroller.js     # Manages fetching and clearing drawing elements, and setting mock data.
│   ├── lib/
│   │   ├── cloudinary.js            # Configuration for the Cloudinary API client.
│   │   ├── db.js                    # Connects Mongoose to the MongoDB cluster.
│   │   └── socket.js                # Core Socket.IO server config, socket event handlers (join, chat, draw, permission).
│   ├── models/
│   │   ├── Room.model.js            # MongoDB Schema for Rooms (hosts, guest arrays, and chat history).
│   │   ├── Users.model.js           # MongoDB Schema for Users (contains list of Cloudinary drawing links).
│   │   └── drawingData.js           # MongoDB Schema for Whiteboard Drawings (room drawings and stroke points).
│   ├── routes/
│   │   ├── Profile.routes.js        # Defines routes for getting user sketches and deleting them.
│   │   └── Room.routes.js           # Defines routes for room actions, drawing fetches, and clearing actions.
│   ├── package.json                 # Backend dependencies, environment scripts, and configurations.
│   └── server.js                    # Entry point for the backend server; initializes Express, CORS, and Socket.IO.
├── frontend/
│   ├── public/                      # Static resources and browser assets.
│   ├── src/
│   │   ├── assets/                  # Images and static media.
│   │   ├── components/
│   │   │   ├── Canvas/
│   │   │   │   ├── DrawingOptions.jsx   # Brush color picker, tool selector (pencil, rectangle, etc.), and width slider.
│   │   │   │   └── JoinWhiteboard.jsx   # Core HTML5 Canvas drawing events and socket communication.
│   │   │   ├── DashBoard/
│   │   │   │   ├── DashBody.jsx         # Dashboard body: options to create a room, join a room, or view history.
│   │   │   │   └── HeaderDash.jsx       # Logged-in header with navigation to profile page and sign-out function.
│   │   │   ├── JoinRoom/
│   │   │   │   └── JoinRoomdashboard.jsx# Container mounting Whiteboard, Chat, OnlineControls, and local Socket handlers.
│   │   │   ├── Profile/
│   │   │   │   └── ProfilePage.jsx      # Shows profile data and a table of saved sketches with download/delete buttons.
│   │   │   └── landingPage/
│   │   │       ├── Header.jsx           # Guest landing header with Auth0 Login/Signup buttons.
│   │   │       └── LandingBody.jsx      # Design layout with background grid effects.
│   │   ├── lib/
│   │   │   ├── axios.js                 # Shared Axios instance configured with backend port 8080 and credentials.
│   │   │   └── socket.js                # Shared WebSocket client initialized with websocket-only transport.
│   │   ├── pages/
│   │   │   ├── Chats.jsx                # Sidemenu rendering room chats and emitting new messages.
│   │   │   ├── Dashboard.jsx            # Parent wrapper page for the dashboard components.
│   │   │   ├── LandingPage.jsx          # Parent wrapper page for the guest landing screen.
│   │   │   ├── Participants.jsx         # Overlay showing room members, and host buttons (Kick, Deny drawing).
│   │   │   ├── SaveImageModal.jsx       # Modal prompting the user for a title, encoding canvas to png, and posting to API.
│   │   │   └── UserInfo.jsx             # Profile info header showing avatar image and email metadata.
│   │   ├── style/
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   ├── App.jsx                      # Main React component establishing React Router paths and notifications wrapper.
│   │   ├── main.jsx                     # Entry file wrapping the React App inside the Auth0Provider.
│   │   └── vite.config.js               # Vite configurations loading the Tailwind CSS plugin.
│   ├── package.json                 # Frontend dependencies, build commands, and script targets.
│   └── index.html                   # HTML base template for mounting the React virtual DOM.
```

---

### Folder & File Responsibilities

- **`/backend/controllers`:** Handles the core business logic of REST requests. For example, [Room.controller.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/controllers/Room.controller.js) performs database operations (like adding a participant) and broadcasts real-time notifications to the room using `io.to()`.
- **`/backend/routes`:** Connects URLs to controller functions (e.g. mapping `POST /api/room/create` to `createRoom`).
- **`/backend/models`:** Defines Mongoose models. [drawingData.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/models/drawingData.js) maps how vector coordinates of whiteboard drawings are structured in MongoDB.
- **`/backend/lib`:** Manages third-party library initializations. [socket.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/lib/socket.js) sets up the Socket.IO HTTP wrapper and binds all event listeners.
- **`/frontend/src/components`:** Reusable UI components. [JoinWhiteboard.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/components/Canvas/JoinWhiteboard.jsx) implements canvas mouse events, canvas scale preservation, and broadcasts elements.
- **`/frontend/src/pages`:** Higher-level overlay widgets. [SaveImageModal.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/pages/SaveImageModal.jsx) handles retrieving the HTML5 Canvas DOM element, converting it to base64, and POSTing it to the backend.
- **`/frontend/src/lib`:** Configures API clients. [axios.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/lib/axios.js) pre-configures a base path of `/api` and enforces credentials forwarding.

---

### Step-by-Step Data Flow: Drawing Synchronization

The following sequence details how a stroke drawn by a permitted participant is instantly distributed to other collaborators and logged persistently in the database:

1. **User Interaction:** A user with drawing privileges (`candraw === true`) clicks and drags on the `<canvas>` element.
2. **Event Trigger:** The `onMouseMove` callback fires the `draw(e)` function in [JoinWhiteboard.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/components/Canvas/JoinWhiteboard.jsx#L107).
3. **Local State Update & Socket Emit:**
   - A line segment object `newElement` is constructed with coordinates, stroke width, color, and tool type.
   - The local state `elementsArray` is appended with this segment, triggering an immediate canvas repaint.
   - The client emits `socket.emit('newElement', { roomid, element: newElement })` (Line 122).
4. **Server Interception:** The backend server in [socket.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/lib/socket.js#L87) captures the `newElement` frame.
5. **Database Logging:** The server commits the element directly into MongoDB using the query:
   ```javascript
   await RoomDrawing.updateOne(
       { roomid: `${roomid}` },
       { $push: { drawingData: element } },
       { upsert: true }
   );
   ```
6. **Room Broadcast:** The server redirects the segment to all other users in that room using `socket.broadcast.emit('drawElement', element)` (Line 93). This avoids echoing the stroke back to the original drawer.
7. **Collaborator Repaint:** Collaborators receive the `drawElement` socket event, update their local `elementsArray`, and repaint their canvas viewport.

---

## 4. Concept-by-Concept Deep Dive

### 1. WebSockets / Socket.IO
- **a) Underlying Theory:**
  WebSockets are a TCP-based protocol (RFC 6455) that enables persistent, bidirectional, full-duplex communication between a client and a server. It starts with an HTTP handshake requesting a protocol upgrade (`Upgrade: websocket`). Once established, the HTTP connection is replaced by a lightweight, low-overhead socket connection, eliminating HTTP header overhead (cookies, headers, methods) on every frame. Socket.IO is a wrapper library built on top of WebSockets that provides automatic fallback options (like HTTP long polling), connection health monitoring (heartbeats), and logical grouping mechanisms called "rooms".
- **b) Code Implementation:**
  - **Server Setup:** [socket.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/lib/socket.js#L8-L10) wraps the Express server:
    ```javascript
    const io = new Server(server, { cors: { origin: ['http://localhost:5173'] } });
    ```
  - **Client Connection:** [socket.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/lib/socket.js#L1-L6) binds client configurations:
    ```javascript
    const socket = io('http://localhost:8080', { transports: ['websocket'], withCredentials: true });
    ```
- **c) Why Needed here:**
  Drawing demands real-time synchronization (under 50ms latency). HTTP polling would require clients to make multiple requests per second, which wastes bandwidth, risks race conditions, and overloads the backend database.
- **d) Common Interview Questions:**
  1. *What is the difference between `socket.broadcast.emit` and `io.emit`?*
     - **Model Answer:** `io.emit` sends the socket frame to all connected clients, including the sender. `socket.broadcast.emit` sends the message to all connected clients *except* the client socket that initiated the request.
  2. *How does Socket.IO handle "Rooms" under the hood?*
     - **Model Answer:** Rooms are server-side structures managed in-memory by an "Adapter". A socket joins a room using `socket.join(roomid)`. When sending to a room via `io.to(roomid).emit()`, Socket.IO matches the room ID to its registry of socket IDs and writes the websocket frames only to those specific active connections.
  3. *What happens if a user's browser does not support WebSockets?*
     - **Model Answer:** By default, Socket.IO initiates a connection using HTTP Long Polling and tries to upgrade to WebSockets. However, in this project's client configuration, `transports: ['websocket']` is enforced, meaning it will skip polling and fail if WebSocket support is unavailable.
- **e) Trade-offs & Alternatives:**
  - *Alternative:* **WebRTC (DataChannels)**.
  - *Comparison:* WebRTC is peer-to-peer (P2P), offering lower latency since data flows directly between clients. However, it requires complex signaling servers (STUN/TURN) and makes central logging of drawing data in a database difficult. Socket.IO's client-server architecture is easier to implement and ensures drawing state is recorded reliably in MongoDB.

---

### 2. MongoDB & Mongoose Schemas (NoSQL)
- **a) Underlying Theory:**
  MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like BSON (Binary JSON) documents. Unlike SQL databases that require pre-defined schemas and foreign keys, MongoDB documents can contain nested arrays and sub-documents. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js that provides structure, type casting, schema validation, and helper methods.
- **b) Code Implementation:**
  - The [drawingData.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/models/drawingData.js) model stores nested vector stroke schemas:
    ```javascript
    const PointSchema = new mongoose.Schema({ x: { type: Number, default: 0 }, y: { type: Number, default: 0 } });
    const DrawingElementSchema = new mongoose.Schema({
      type: { type: String, required: true },
      color: { type: String, required: true },
      width: { type: Number, required: true },
      points: { type: [PointSchema], required: true }
    });
    ```
- **c) Why Needed here:**
  Vector strokes naturally match hierarchical tree structures (a stroke consists of metadata and an array of coordinates). Representing this structure in a relational database would require foreign keys, join tables, and high query costs, whereas NoSQL fetches the entire canvas representation in a single query.
- **d) Common Interview Questions:**
  1. *What does the `{ upsert: true }` option do in Mongoose updates?*
     - **Model Answer:** If a matching document is found, it is updated. If no document matches the query, a new document is created with the query criteria and the update values. In this project, it ensures a `RoomDrawing` record is created on the first stroke if the room initialization step was missed.
  2. *What is a subdocument in Mongoose, and how does it differ from a referenced document?*
     - **Model Answer:** A subdocument is nested directly inside a parent document (e.g. `PointSchema` inside `DrawingElementSchema`). It has no independent collection and is retrieved or saved with the parent. Referenced documents store an `ObjectId` pointing to a separate collection, requiring a `$lookup` or `.populate()` operation to retrieve.
  3. *How would you optimize queries on the `RoomDrawing` model as the database grows?*
     - **Model Answer:** I would add an index to the `roomid` field because it is used for frequent lookups (`findOne({ roomid })`). Indexing turns an $O(N)$ collection scan into a fast $O(\log N)$ index lookup.
- **e) Trade-offs & Alternatives:**
  - *Alternative:* **PostgreSQL with JSONB columns**.
  - *Comparison:* PostgreSQL offers structured relational tables alongside fast JSON query capabilities (using `JSONB`). It enforces ACID compliance, which is ideal if user billing or payment tables are added. However, MongoDB's native JSON nature matches Node.js backend development faster without the overhead of relational migrations.

---

### 3. Authentication & Authorization (Auth0)
- **a) Underlying Theory:**
  OAuth 2.0 is an authorization framework allowing applications to request access tokens from an identity server. OpenID Connect (OIDC) is an identity layer built on top of OAuth 2.0 that introduces the ID Token (typically formatted as a JWT - JSON Web Token). It offloads credentials storage, session control, multi-factor authentication, and login UI flows to a secure third-party provider (Auth0).
- **b) Code Implementation:**
  - **Provider Init:** [main.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/main.jsx#L10-L18) wraps the application, specifying client configs:
    ```javascript
    <Auth0Provider
      domain="dev-eiqbf3dufeploub7.us.auth0.com"
      clientId="fIIXOxWwmSkOM3N6vrX7Qvt2G88hCbSo"
      authorizationParams={{ redirect_uri: "http://localhost:5173/dashboard" }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
    ```
- **c) Why Needed here:**
  Integrating custom signups, passwords, password recovery email flows, and social authentications requires extensive security work. Auth0 offloads these security risks, providing a secure, pre-verified identity context (`user.sub`).
- **d) Common Interview Questions:**
  1. *What is a major security vulnerability in the current backend API implementation regarding user verification?*
     - **Model Answer:** **The backend does not validate JWTs.** The backend controllers (like [Users.controller.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/controllers/Users.controller.js#L4)) accept `userid` or `user.sub` directly from the request body or parameters without requiring or verifying a signed `Authorization: Bearer <JWT>` header. An attacker could easily forge API requests for any user ID. To fix this, backend middleware (e.g. `express-oauth2-jwt-bearer`) should verify JWT signatures using Auth0 public keys.
  2. *Why is `useRefreshTokens={true}` and `cacheLocation="localstorage"` configured?*
     - **Model Answer:** `cacheLocation="localstorage"` preserves user authentication state across browser tab reloads. `useRefreshTokens` enables the client to silently request new Access Tokens using a refresh token when the current token expires, preventing the user from being logged out frequently.
  3. *What are the risks of using `localstorage` for caching auth tokens?*
     - **Model Answer:** LocalStorage is accessible by any JavaScript running on the same origin. If the app is vulnerable to Cross-Site Scripting (XSS) via a malicious package, an attacker can extract the token. Storing tokens in memory and using cookie-based auth is a more secure option.
- **e) Trade-offs & Alternatives:**
  - *Alternative:* **Custom Passport.js JWT & Session Cookie auth**.
  - *Comparison:* A custom Passport.js setup keeps all user credentials locally in the MongoDB instance without third-party dependencies. However, it requires implementing password hashing (bcrypt), token expiration, rotation, and cookie security policies (SameSite, Secure, HttpOnly).

---

### 4. Media Storage (Cloudinary)
- **a) Underlying Theory:**
  A whiteboard canvas renders vector segments locally. To convert a canvas to an image file, it must be rasterized (pixelated) into binary stream data, commonly formatted as a Base64-encoded Data URL (`data:image/png;base64,...`). Because storing large text-encoded image strings bloats databases and degrades query performance, base64 strings are uploaded to cloud media servers like Cloudinary, which return optimized, CDN-backed URLs.
- **b) Code Implementation:**
  - **Rasterization:** In [SaveImageModal.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/pages/SaveImageModal.jsx#L13), the canvas is converted to a base64 PNG data URL:
    ```javascript
    const imgdataUrl = canvas.toDataURL('image/png');
    ```
  - **Upload:** The controller in [Users.controller.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/controllers/Users.controller.js#L7-L8) uploads the URL directly:
    ```javascript
    const result = await cloudinary.uploader.upload(imgurl);
    const iurl = result.secure_url;
    ```
- **c) Why Needed here:**
  MongoDB documents have a strict 16MB limit. Saving base64 images directly inside the user model would exhaust database space and slow down operations. Cloudinary offloads this storage and serves images via a CDN.
- **d) Common Interview Questions:**
  1. *What is a Base64 Data URL, and what is its overhead?*
     - **Model Answer:** A Data URL is a scheme to embed inline files inside web pages. Base64 encodes binary data into 64 safe ASCII characters. This encoding adds roughly **33% overhead** to the file size compared to raw binary data.
  2. *How is the Cloudinary download action optimized in this project?*
     - **Model Answer:** On the profile page, rather than just linking to the image, the download link modifies the URL:
       ```javascript
       href={`${drawing.url.replace("/upload/", "/upload/fl_attachment:" + drawing.title + "/")}`}
       ```
       Cloudinary intercepts `fl_attachment` in the path and responds with a `Content-Disposition: attachment; filename=...` header, which triggers a file download in the browser.
- **e) Trade-offs & Alternatives:**
  - *Alternative:* **AWS S3 Buckets**.
  - *Comparison:* AWS S3 is a industry standard object store, and is cheaper for raw storage at scale. However, Cloudinary has built-in image optimization pipelines (automatic format conversion, cropping, and dynamic attachment modifications), which saves development time.

---

### 5. Cross-Origin Resource Sharing (CORS)
- **a) Underlying Theory:**
  CORS is a browser security mechanism defined by the Same-Origin Policy. It prevents frontend code from reading HTTP responses from a different origin (domain, port, or protocol) unless the target server explicitly returns the correct headers (like `Access-Control-Allow-Origin`).
- **b) Code Implementation:**
  - **Express Server Configuration:** In [server.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/server.js#L10-L15):
    ```javascript
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));
    ```
  - **Socket.IO Server Configuration:** In [socket.js](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/backend/lib/socket.js#L9):
    ```javascript
    const io = new Server(server, { cors: { origin: ['http://localhost:5173'] } });
    ```
- **c) Why Needed here:**
  The React frontend runs on `http://localhost:5173` while the Express server runs on `http://localhost:8080`. Without CORS enabled, the browser would block the frontend's API calls and WebSocket upgrades.
- **d) Common Interview Questions:**
  1. *What is a CORS preflight request?*
     - **Model Answer:** It is an HTTP `OPTIONS` request sent automatically by the browser before the actual request. It checks if the server allows the target domain, HTTP method, and headers. Preflight requests are triggered for "non-simple" requests (e.g. requests with JSON body payloads or custom headers).
  2. *What does `credentials: true` accomplish in CORS configurations?*
     - **Model Answer:** It allows cross-origin requests to include credentials (like cookies, authorization headers, or TLS certificates). Both the client (Axios configuration) and the server (CORS middleware) must enable it, and the allowed origin cannot be a wildcard (`*`).
- **e) Trade-offs & Alternatives:**
  - *Alternative:* **Reverse Proxy (Nginx / Vite Proxy)**.
  - *Comparison:* In production, you can configure Nginx or Vite's dev proxy to route all frontend and backend traffic through a single port (e.g., `/api` redirects to backend). This matches the Same-Origin Policy and avoids CORS configuration entirely.

---

### 6. HTML5 Canvas API
- **a) Underlying Theory:**
  The HTML5 `<canvas>` element provides a resolution-dependent bitmap canvas. It exposes a drawing context (typically 2D) with methods for rendering lines, shapes, and text. Canvas is an **immediate-mode** graphics system: once you draw pixels on the canvas, it forgets the shapes drawn and only retains the flat pixel data.
- **b) Code Implementation:**
  - In [JoinWhiteboard.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/components/Canvas/JoinWhiteboard.jsx#L73-L89), the whiteboard retrieves the 2D context, clears the viewport, and iterates over saved segments:
    ```javascript
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        ctx.lineTo(line.points[1].x, line.points[1].y);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.stroke();
    });
    ```
- **c) Why Needed here:**
  It provides high-performance, pixel-level rendering capabilities inside the browser, which is ideal for real-time sketch collaboration.
- **d) Common Interview Questions:**
  1. *What is the difference between HTML5 Canvas and SVG?*
     - **Model Answer:** Canvas is immediate-mode, rendering shapes directly to a single flat bitmap grid. It offers better performance for drawing thousands of individual elements. SVG is retained-mode, rendering shapes as distinct DOM elements. SVGs are scalable without quality loss and support DOM events (like clicks) on individual shapes, but performance degrades with high element counts.
  2. *How is canvas distortion prevented during container resizes in this project?*
     - **Model Answer:** The project uses a `ResizeObserver` on the parent container (Line 37). When a resize occurs, it updates `canvas.width` and `canvas.height` to match the layout dimensions in pixels, preventing stretching. It then triggers `redrawAll` to redraw the stored coordinates on the new canvas resolution.
- **e) Trade-offs & Alternatives:**
  - *Alternative:* **SVG Elements Grouping (`<svg>`)**.
  - *Comparison:* Drawing with SVGs is easier because you can treat each stroke as a React component. However, with hundreds of segments, the browser DOM becomes bloated, which slows down rendering. Canvas keeps memory usage low by outputting directly to pixels.

---

## 5. Key Algorithms & Custom Logic

### 1. Canvas Stroke Segment Serialization
Because immediate-mode Canvas does not remember vector shapes, the application implements a custom serialization algorithm:
- When a user moves their mouse, the canvas does not record a single complex curved path. Instead, it serializes the mouse movement into multiple small straight-line segments.
- Every segment is serialized into a JSON object:
  ```json
  {
    "type": "pencil",
    "color": "#ff0000",
    "width": 4,
    "points": [
      { "x": 100, "y": 150 },
      { "x": 102, "y": 152 }
    ]
  }
  ```
- **Time Complexity:**
  - **Drawing / Serialization:** $O(1)$ constant time. Every time the mouse moves, a single segment object is generated and emitted.
  - **Rendering:** $O(N)$ linear time, where $N$ is the total number of segments. When the canvas updates or resizes, the application repaints the entire canvas by iterating over all segments.
- **Space Complexity:** $O(N)$. The memory used scales linearly with the total number of segments drawn.

### 2. Cloudinary Download URL Manipulation
To download images directly from the profile page, the application uses a custom URL pattern algorithm that modifies Cloudinary paths:
- **The Problem:** Cloudinary image URLs default to displaying in the browser rather than triggering a download.
- **The Solution:** The application inserts `fl_attachment:<filename>` into the URL path.
- **Algorithm implementation:**
  ```javascript
  const downloadUrl = originalUrl.replace("/upload/", "/upload/fl_attachment:" + filename + "/");
  ```
  - **Example:**
    `https://res.cloudinary.com/demo/image/upload/sample.jpg`
    becomes
    `https://res.cloudinary.com/demo/image/upload/fl_attachment:MyDrawing/sample.jpg`

---

## 6. Challenges & Design Decisions

### 1. Drawing Synchronization: High-Frequency Segments vs. Aggregated Strokes
- **The Decision:** The application sends a WebSocket message and runs a database update for **every individual mouse move event** (segments containing only two points: start and end).
- **The Trade-off:**
  - *Pros:* Simple code implementation; collaborators see strokes render instantly with no delay.
  - *Cons:* Extremely high database write overhead and websocket message counts. A single freehand curve can trigger over 100 database writes.
  - *Alternative:* Buffer the coordinates locally and only emit the complete line path when the user releases the mouse button (`onMouseUp`). While this reduces database writes and network traffic by 90%, other users will only see the line after it is completed, which makes collaboration feel laggy.

### 2. Backend Security Gap: Lack of Token Verification
- **The Decision:** The backend REST APIs and socket listeners trust user identities sent directly in the payload (`userid` or `user.sub`) without validating JWT signatures.
- **The Trade-off:**
  - *Pros:* Simpler development and testing; avoids backend configuration of OAuth keys.
  - *Cons:* Severe security vulnerability. Anyone can access or delete saved drawings for any user ID simply by changing the payload parameters.
  - *Mitigation:* In a production environment, the backend should use middleware like `express-oauth2-jwt-bearer` to intercept requests, decode authorization tokens, and verify signatures against Auth0's public keys before processing requests.

### 3. Modalless Drawing Permission Approvals via Toast Integration
- **The Decision:** Using `react-hot-toast`'s custom renderer inside [JoinRoomdashboard.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/components/JoinRoom/JoinRoomdashboard.jsx#L140) to render interactive "Grant/Deny" authorization prompts directly in toast notifications.
- **The Trade-off:**
  - *Pros:* Non-blocking and clean UI. The host can continue drawing or reading chat while managing guest permission requests.
  - *Cons:* Toasts disappear automatically after a set timeout (`duration: 10000`). If a host misses the toast, the request expires, forcing the guest to request access again.

### 4. Room Lifecycle and Host Teardown Strategy
- **The Decision:** If the host leaves or closes the room, the backend deletes the room model from MongoDB and broadcasts a `hostEndedMeeting` socket event. This event triggers the client frontend to display a notification and redirect all guests to the dashboard.
- **The Trade-off:**
  - *Pros:* Prevents orphan rooms, saves database space, and cleans up client connections.
  - *Cons:* If a host accidentally closes their tab or loses internet connection, the entire meeting is terminated for everyone.
  - *Improvement:* Implement a grace period or host handover mechanism. If a host disconnects, wait 30 seconds for a reconnection before transferring host privileges to the next active participant in the list.

### 5. Drawing Tool UI vs Rendering Logic Limitation
- **The Finding:** While [DrawingOptions.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/components/Canvas/DrawingOptions.jsx#L19-L33) includes buttons to select `rectangle`, `circle`, `line`, and `ellipse` tools, the canvas drawing engine in [JoinWhiteboard.jsx](file:///c:/Users/sumed/code/web%20dev/projects/white-board-project/frontend/src/components/Canvas/JoinWhiteboard.jsx#L82-L87) draws all segments as simple straight lines (`ctx.lineTo`) regardless of the active tool.
- **The Rationale:** This shows that shape rendering logic (e.g. `ctx.rect` or `ctx.arc`) is currently missing or incomplete. 
- **The Interview Value:** Highlighting this in an interview demonstrates that you have actually analyzed and understood the code, showing critical thinking and attention to detail.

---

## 7. Quick Revision Sheet

Use this 10-minute cheat sheet to revise core concepts before an interview:

- **WebSockets (Socket.IO):** A TCP-based full-duplex protocol. Upgrades from HTTP (`Upgrade` header). Enables real-time, low-latency communication. In this project, `socket.join(roomid)` handles rooms, while `socket.broadcast.emit` shares drawings without echoing back to the sender.
- **Immediate-Mode Canvas:** Renders directly to a flat pixel bitmap. Very fast for high counts of drawing objects but forgets shapes once rendered. Requires redrawing all stored coordinate paths on container resize to prevent stretching.
- **MongoDB NoSQL Design:** Uses JSON-like BSON schemas. Ideal for nested structures (like arrays of coordinates) without relational joins. Uses `{ upsert: true }` to write drawing records on the fly.
- **Cloudinary Image Pipeline:** Offloads heavy base64 canvas exports (`canvas.toDataURL`) to external cloud storage, keeping database sizes small. Leverages URL path injections (`fl_attachment`) to force browser downloads.
- **CORS:** Browser policy restricting cross-origin requests. Fixed by configuring headers on the Express backend and the Socket.IO server to allow port `5173` with `credentials: true`.
- **JWT / Auth0 Security:** Handles user identity securely on the frontend. A critical security gap exists in the backend API, which accepts client-provided user IDs without validating JWT signatures.
- **ResizeObserver API:** A modern web API that watches element dimensions. Essential for canvas development to resize pixel buffers dynamically and prevent coordinate stretching.
