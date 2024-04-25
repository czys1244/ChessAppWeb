import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {LoginButtons} from './components/LoginButtons.jsx'
// import { Home } from './components/Home.jsx'
import {Login} from "./components/Login.jsx";
import {Register} from "./components/Register.jsx";
import PrivateRoutes from "./auth/PrivateRoutes.jsx";

import {Home} from "./components/Home.jsx";
import {Play} from "./components/Play.jsx";
import {InviteCode} from "./components/InviteCode.jsx";
import {History} from "./components/History.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/play" element={<Play/>}/>
                    <Route path="/invite" element={<InviteCode/>}/>
                    <Route path="/history" element={<History/>}/>
                </Route>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<LoginButtons/>}/>
            </Routes>
        </BrowserRouter>
    // </React.StrictMode>,
)
