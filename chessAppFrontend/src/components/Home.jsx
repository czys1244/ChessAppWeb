// import {useState} from "react";
//
// import {Login} from "./Login";
// import {Register} from "./Register";
// import {LoginButtons} from "./LoginButtons";
// import {BrowserRouter, Route, Routes} from "react-router-dom";
// import App from "../App.jsx";
//
//
// export const Home = () => {
//     // const [currentForm, setCurrentForm] = useState("home");
//     // const handleLogin = (e) => {
//     //     e.preventDefault();
//     //     setCurrentForm("login");
//     // }
//     // const handleRegister = (e) => {
//     //     e.preventDefault();
//     //     setCurrentForm("register");
//     // }
//
//         return(
//             <BrowserRouter>
//                     <Routes>
//                         <Route path = "/login" element={<Login/>}/>
//                         <Route path = "/register" element={<Register/>}/>
//                         <Route path = "/" element={<LoginButtons/>}/>
//                         <Route path = "/h" element={<App/>}/>
//                     </Routes>
//             </BrowserRouter>
//
//         )
//
//
// }