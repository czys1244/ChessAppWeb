import './styles/LoginButtons.css'
import {Link} from "react-router-dom";
import './styles/Home.css'


export const LoginButtons = ()=>{
    return (
        <div className="chessbackround">
            <h1 id='home'>ChessApp</h1>
            <div id="loginButtons">
                <Link to="/login">
                    <button id="LoginButton">Log in</button>
                </Link>
                <Link to="/register">
                    <button id="RegisterButton">Register</button>
                </Link>
            </div>
        </div>

    )

}