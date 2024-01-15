import './styles/SidebarButtons.css'
import {Link} from 'react-router-dom';

export const SidebarButtons = ()=>{
    return (
        <div className="sidebarButtons">
            <Link to="/home">
                <button className="sidebarButton">Play ranked</button>
            </Link>
            <Link to={"/invite"}>
                <button className="sidebarButton">Play with friend</button>
            </Link>
            <Link to={"/home"}>
                <button className="sidebarButton">History</button>
            </Link>
            <div className="username">
                <p>Username</p>
                <p>Rank: 1000</p>
            </div>
            <button className="sidebarButton">Log out</button>
        </div>

    )
}