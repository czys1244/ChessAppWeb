import {useState} from "react";
import './styles/Login.css'

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(password);
    }
    return (
        <div className="chessbackround">
            <h1 id='home'>ChessApp</h1>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input value={email} onChange={(e)=>{
                    setEmail(e.target.value)
                }} placeholder="username" id="email" name="email"/>
                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e)=>{
                    setPassword(e.target.value)
                }} type="password" placeholder="password" id="password" name="password"/>
                <button>Register</button>
            </form>

        </div>
    )
}
