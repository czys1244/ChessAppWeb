import './styles/Home.css'
import {SidebarButtons} from "./SidebarButtons.jsx";

import './styles/timeOptionsMenu.css'
export const Home = () => {
    return (
        <div className="flex-container">
            <div className="sidebar">
                <SidebarButtons/>
            </div>
            <div className="center" >
                <div className="timeOptionsMenu">
                    <p>Time format</p>
                    <button className="timeOptionsButtons">Blitz: 3+0</button>
                    <button className="timeOptionsButtons">Rapid: 10+5</button>
                    <button className="timeOptionsButtons">Classical: 30+0</button>
                </div>
            </div>
        </div>

    )
}