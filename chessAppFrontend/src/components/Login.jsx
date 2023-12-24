import {useState} from "react";
import './styles/Login.css'

export const Login = ()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(password);
    }
    return (
        <div className="chessbackround">
            <h1 id='home'>ChessApp</h1>

            <div>
                <form onSubmit={handleSubmit} id="login">
                    <label>Username</label>
                    <input value={email} onChange={(e)=>{
                        setEmail(e.target.value)
                    }} placeholder="username" id="email" name="username"/>
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e)=>{
                        setPassword(e.target.value)
                    }} type="password" placeholder="password" id="password" name="password"/>
                    <button id="loginSubmit">Log in</button>
                </form>

            </div>
        </div>
    )
}
