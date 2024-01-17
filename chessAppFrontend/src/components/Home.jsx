import './styles/Home.css'
import {SidebarButtons} from "./SidebarButtons.jsx";

import './styles/timeOptionsMenu.css'
import {Link} from "react-router-dom";
export const Home = () => {
    return (
        <div className="flex-container">
            <div className="sidebar">
                <SidebarButtons/>
            </div>
            <div className="center" >
                <div className="timeOptionsMenu">
                    <p>Time format</p>
                    <Link to="/play">
                    <button className="timeOptionsButtons">Blitz: 3+0</button>
                    </Link>
                    <Link to="/play">
                    <button className="timeOptionsButtons">Rapid: 10+5</button>
                    </Link>
                    <Link to="/play">
                    <button className="timeOptionsButtons">Classical: 30+0</button>
                    </Link>
                </div>
            </div>
        </div>

    )
}