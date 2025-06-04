import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import HeaderDash from "../components/DashBoard/HeaderDash";
import DashBody from "../components/DashBoard/DashBody";


const Dashboard = () => {
    const { logout ,user, isAuthenticated, isLoading } = useAuth0();
    console.log(user);

return (
    <>
    <HeaderDash/>
    <DashBody/>
    </>
)

}

export default Dashboard