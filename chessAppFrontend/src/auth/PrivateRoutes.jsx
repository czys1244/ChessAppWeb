import { Navigate, Outlet } from 'react-router-dom'
import {getAuthToken} from "./auth.js";

function tokenExpired(token) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
}


const PrivateRoutes = () => {
    let token = getAuthToken();
    let auth = false
    if (token !== null && token !== "null" ){
        if (!tokenExpired(token)){
            auth = true;
        }

    }

    return (
        auth ? <Outlet/> : <Navigate to='/login'/>
    )
}

export default PrivateRoutes