import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import HeaderDash from "../components/DashBoard/HeaderDash";
import DashBody from "../components/DashBoard/DashBody";


const Dashboard = () => {
    const { logout ,user, isAuthenticated, isLoading } = useAuth0();
    console.log(user);

//   return (
//     <>
//     <div>Dashboard</div>
//     <button  onClick={() => logout({ logoutParams: { returnTo: "http://localhost:5173" } })}>
//       Log Out
//     </button>
    
//     {isAuthenticated ? (
//       <div>
//         <img src={user.picture} alt={user.name} />
//         <h2>{user.name}</h2>
//         <p>{user.email}</p>
//       </div>
//     ) : <p>you are not authenticated</p>}
//     </>
//   )
// }

return (
    <>
    <HeaderDash/>
    <DashBody/>
    </>
)

}

export default Dashboard