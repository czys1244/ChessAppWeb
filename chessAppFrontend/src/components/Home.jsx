import './styles/Home.css'
import {SidebarButtons} from "./SidebarButtons.jsx";

import './styles/timeOptionsMenu.css'
import {useNavigate} from "react-router-dom";
import {getAuthToken} from "../auth/auth.js";
export const Home = () => {
    const navigate = useNavigate();
    function createGame(){
        let token = getAuthToken();
        fetch('/api/game/ranked', {
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
                // console.log(json);
                // navigate("/play");

            })
            .catch(err=>{
                console.error(err)
            })
        alert("Game created, link copied to clipboard");
    }
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
    function joinRandomGame(){
        let token = getAuthToken();


        fetch('/api/game/connectrandom', {
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
                console.log("RANDOM GAME");
                console.log(json);
                window.localStorage.setItem('game_id', json.id);
                navigate("/play");

            })
            .catch(err=>{
                console.error(err)
            })
    }
    return (
        <div className="flex-container">
            <div className="sidebar">
                <SidebarButtons/>
            </div>
            <div className="center" >
                <div className="timeOptionsMenu">
                    <p>Play with random player</p>

                    <button onClick={createGame} className="timeOptionsButtons">Create game</button>


                        <button onClick={joinWithGameID} className="timeOptionsButtons">Join your game</button>


                    <button onClick={joinRandomGame} className="timeOptionsButtons">Join random game</button>


                </div>
            </div>
        </div>

    )
}