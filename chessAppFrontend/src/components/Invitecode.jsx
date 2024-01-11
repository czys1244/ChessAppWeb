import './styles/Home.css'
import {SidebarButtons} from "./SidebarButtons.jsx";

import './styles/timeOptionsMenu.css'
export const Invitecode = () => {
    return (
        <div className="flex-container">
            <div className="sidebar">
                <SidebarButtons/>
            </div>
            <div className="center" >
                <div className="timeOptionsMenu">
                    <p>Play with invite code</p>
                    <button className="inviteButtons">Send invite code</button>
                    <button className="inviteButtons">Join game</button>
                </div>
            </div>
        </div>

    )
}