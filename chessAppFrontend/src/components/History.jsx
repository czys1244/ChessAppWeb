import './styles/History.css'
import {SidebarButtons} from "./SidebarButtons.jsx";

import './styles/timeOptionsMenu.css'

import {getAuthToken} from "../auth/auth.js";
import {useEffect, useState} from "react";
export const History = () => {
    const [games, setGames] = useState([]);
    useEffect(()=>{
        let token = getAuthToken();
        fetch('/api/game/history', {
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
                // navigator.clipboard.writeText(json.id);
                console.log(json);
                setGames(json);
                // navigate("/play");

            })
            .catch(err=>{
                console.error(err)
            })

    },[])



    return (
        <div className="flex-container">
            <div className="sidebar">
                <SidebarButtons/>
            </div>
            <div className="center" >
                <div className="timeOptionsMenu">
                    <p className="history">History:</p>

                    <div>
                        <ul>
                            {games.map((game, index)=>{
                                return <li className="history" key={index}>{"White: " + game.firstPlayer} | {"Black: " + game.secondPlayer} | {"Winner: " + game.winner}</li>
                            })}
                        </ul>
                    </div>



                </div>
            </div>
        </div>

    )
}