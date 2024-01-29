import './styles/Home.css'
import {SidebarButtons} from "./SidebarButtons.jsx";
import { useNavigate } from "react-router-dom";
import './styles/timeOptionsMenu.css'
import {getAuthToken} from "../auth/auth.js";

export const InviteCode = ()=>{
    const navigate = useNavigate();
    function joinWithGameID(){
        let token = getAuthToken();
        let gameID = prompt("Enter invite code");
        if (gameID === null)
            return;
        fetch('/api/game/connect', {
            method: 'POST',
            body: JSON.stringify({player: "playerB",
                gameId: gameID}),
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response=>{
                if (response.status === 200)
                    return response.json()
            })
            .then(json=>{
                window.localStorage.setItem('game_id', gameID);
                navigate("/play");
                console.log(json);
            })
            .catch(err=>{
                console.error(err)
            })
    }
    function copyInviteToClipboard(){
        let token = getAuthToken();
        fetch('/api/game/create', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response=>{
                if (response.status === 200)
                    return response.json()
            })
            .then(json=>{
                navigator.clipboard.writeText(json.id);
                console.log(json);
                // navigate("/play");

            })
            .catch(err=>{
                console.error(err)
            })
        alert("Invite code copied to clipboard");
    }

    return (
        <div className="flex-container">
            <div className="sidebar">
                <SidebarButtons/>
            </div>
            <div className="center">
                <div className="timeOptionsMenu">
                    <p>Play with invite code</p>
                    <button onClick={copyInviteToClipboard} className="inviteButtons">Send invite code</button>
                    <button onClick={joinWithGameID} className="inviteButtons">Join game</button>
                </div>
            </div>
        </div>

    )
}