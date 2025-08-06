// import { io } from 'socket.io-client';
// const socket = io('http://localhost:8080', {
//     transports: ['websocket'],
//     withCredentials: true,
// });
// export default socket;
import { io } from 'socket.io-client';
const socket = io('https://collabboard-8o88.onrender.com', {
    transports: ['websocket'],
    withCredentials: true,
});
export default socket;
