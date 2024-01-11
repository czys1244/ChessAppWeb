import {useState} from "react";
import './styles/Login.css'
import {setAuthHeader} from "../auth/auth.js";

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        // setAuthHeader("null")
        const payload = {
            username: username,
            password: password
        }
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-type': 'application/json'}
        })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.error(err))
    }
    return (
        <div className="chessbackround">
            <h1 id='home'>ChessApp</h1>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input value={username} onChange={(e)=>{
                    setUsername(e.target.value)
                }} placeholder="username" id="email" name="email"/>
                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e)=>{
                    setPassword(e.target.value)
                }} type="password" placeholder="password" id="password" name="password"/>
                <button className="loginbutton" >Register</button>
            </form>

        </div>
    )
}
