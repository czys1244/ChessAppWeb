// import {Link} from "react-router-dom";
import './styles/GameSidebarButtons.css'

export const GameSidebarButtons = ()=>{
    return (
        <div className="GamesidebarButtons">
            <div className="Gameusername2">
                <p>Username2</p>
                <p>Rank: 1000</p>
            </div>
            <button className="GamesidebarButton">Resign</button>
            <button className="GamesidebarButton">Offer draw</button>

            <div className="username">
                <p>Username</p>
                <p>Rank: 1000</p>
            </div>
            <button className="GamesidebarButton">Log out</button>
        </div>

    )
}