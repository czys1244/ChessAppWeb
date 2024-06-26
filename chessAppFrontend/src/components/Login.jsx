import {useState} from "react";
import './styles/Login.css'
import {setAuthHeader} from "../auth/auth.js";
import { useNavigate } from "react-router-dom";
// import {json} from "react-router-dom";

export const Login = ()=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault();

        const payload = {
            username: username,
            password: password
        }
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (response.status === 200)
                    return response.json()
            })
            .then(json => {
                setAuthHeader(json.token)
                console.log(json)
            })
            .catch(err => {
                console.error(err)
            })

    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    return (
        <div className="chessbackround">
            <h1 id='home'>ChessApp</h1>

            <div>

                <form onSubmit={handleSubmit} id="login">
                    <label>Username</label>
                    <input value={username} onChange={(e)=>{
                        setUsername(e.target.value)
                    }} placeholder="username" id="email" name="username"/>
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e)=>{
                        setPassword(e.target.value)
                    }} type="password" placeholder="password" id="password" name="password"/>

                    <button id="loginSubmit" className="loginbutton" onClick={() => {
                        sleep(1000).then(() => {
                            navigate("/home");
                        });
                    }
                    }
                       >Log in</button>

                </form>

            </div>
        </div>
    )
}
