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
import {Invitecode} from "./components/Invitecode.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/play" element={<Play/>}/>
                    <Route path="/invite" element={<Invitecode/>}/>
                    <Route path="/h" element={<App/>}/>
                </Route>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<LoginButtons/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
