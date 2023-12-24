import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { LoginButtons } from './components/LoginButtons.jsx'
// import { Home } from './components/Home.jsx'
import {Login} from "./components/Login.jsx";
import {Register} from "./components/Register.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path = "/login" element={<Login/>}/>
              <Route path = "/register" element={<Register/>}/>
              <Route path = "/" element={<LoginButtons/>}/>
              <Route path = "/h" element={<App/>}/>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)
