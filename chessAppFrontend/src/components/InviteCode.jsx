import './styles/Home.css'
import {SidebarButtons} from "./SidebarButtons.jsx";

import './styles/timeOptionsMenu.css'
import {setAuthHeader} from "../auth/auth.js";
export const InviteCode = () => {
    function copyInviteToClipboard() {
        fetch('/game/create', {
            method: 'GET',
        })
            .then(response => {
                if (response.status === 200)
                    return response.json()
            })
            .then(json => {
                console.log(json);
            })
            .catch(err => {
                console.error(err)
            })
        alert("Invite code copied to clipboard");
    }

    return (
        <div className="flex-container">
            <div className="sidebar">
                <SidebarButtons/>
            </div>
            <div className="center" >
                <div className="timeOptionsMenu">
                    <p>Play with invite code</p>
                    <button onClick={copyInviteToClipboard} className="inviteButtons">Send invite code</button>
                    <button className="inviteButtons">Join game</button>
                </div>
            </div>
        </div>

    )
}