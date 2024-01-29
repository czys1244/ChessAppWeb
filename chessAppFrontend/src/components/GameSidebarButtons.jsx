// import {Link} from "react-router-dom";
import './styles/GameSidebarButtons.css'
import {useEffect, useState} from "react";
import {getAuthToken} from "../auth/auth.js";
// import {jwtDecode} from "jwt-decode";

// eslint-disable-next-line react/prop-types
export const GameSidebarButtons = ({gameId, user, userRating})=>{
    const [opponentName, setOpponentName] = useState('Opponent');
    const [opponentRank, setOpponentRank] = useState('---');
    useEffect(()=>{
        let token = getAuthToken();
        // console.log(jwtDecode(getAuthToken()))
        let game = {
            "player": user,
            "gameId": gameId
        }

        fetch('/api/game/getgame', {
            method: 'POST',
            body: JSON.stringify(game),
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
                if (json.firstPlayer === user){
                    setOpponentName(json.secondPlayer)
                    console.log("11111");
                }
                else if (json.secondPlayer === user){
                    setOpponentName(json.firstPlayer)
                    // console.log("22222");
                    // console.log(opponentName);
                }
                console.log(json);
                console.log(opponentName);
                getOpponentRank();
            })
            .catch(err=>{
                console.error(err)
            })
        //     })
    }, [opponentName, opponentRank, gameId, userRating, user]);
    function getOpponentRank(){
        let opponent = {
            "name": opponentName
        }

        fetch('/api/game/rating', {
            method: 'POST',
            body: JSON.stringify(opponent),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response=>{
                if (response.status === 200)
                    return response.json()
            })
            .then(json=>{
                setOpponentRank(json);
            })
            .catch(err=>{
                console.error(err)
            })
    }

    return (
        <div className="GamesidebarButtons">
            <div className="Gameusername2">
                {/* eslint-disable-next-line react/prop-types */}
                <p>{opponentName} + {gameId}</p>
                <p>Rank: {opponentRank}</p>
            </div>
            <button className="GamesidebarButton">Resign</button>
            <button className="GamesidebarButton">Offer draw</button>

            <div className="username">
                <p>{user}</p>
                <p>Rank: {userRating}</p>
            </div>
            <button className="GamesidebarButton">Log out</button>
        </div>

    )
}