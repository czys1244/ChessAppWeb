import {useState} from "react";
import './styles/Login.css'
import {json} from "react-router-dom";

export const Login = ()=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => {
                console.error(err)
            })
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
                    <button id="loginSubmit" className="loginbutton" >Log in</button>
                </form>

            </div>
        </div>
    )
}
