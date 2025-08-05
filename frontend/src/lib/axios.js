import axios from "axios";
const instance=axios.create({
    baseURL:'https://collabboard-8o88.onrender.com/api',withCredentials:true
})
export default instance;