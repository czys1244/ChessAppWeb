
import './styles/GameSidebarButtons.css'
import {useEffect, useState} from "react";
import {getAuthToken, setAuthHeader} from "../auth/auth.js";


// eslint-disable-next-line react/prop-types
export const GameSidebarButtons = ({gameId, user, userRating})=>{
    const [opponentName, setOpponentName] = useState('Opponent');
    const [opponentRank, setOpponentRank] = useState('---');
    const [firstName, setFirstName] = useState('');

    const checkIfResigned = async () => {
        const res = await fetch("/api/game/getgame", {
            method: "POST",
            body: JSON.stringify({gameId: gameId}),
            headers: {
                "Content-Type": "application/json",
            },

        });
        const data = await res.json();
        let isResigned = data.winner;
        if (isResigned === null){
            if (data.firstPlayerDrawOffer ===1 && data.secondPlayerDrawOffer===1){
                alert('Draw!');
            }
        }
        if (isResigned !== null){
            alert(isResigned + ' won!');
        }
    };
    useEffect(() => {
        const timer = setInterval(checkIfResigned, 2000);
        return () => clearInterval(timer);
    }, []);
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
                }
                else if (json.secondPlayer === user){
                    setOpponentName(json.firstPlayer)
                }
                setFirstName(json.firstPlayer);

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
    function resign(){
        let token = getAuthToken();
        let game = {
            // "player": user,
            "gameId": gameId
        }


        fetch('/api/game/resign', {
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
                console.log(json);
                // eslint-disable-next-line react/prop-types
                alert(`Game over! ${user} resigned!`);
            })
            .catch(err=>{
                console.error(err)
            })
    }
    function draw(){
        let token = getAuthToken();
        let game = {
            // "player": user,
            "gameId": gameId
        }


        fetch('/api/game/draw', {
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
                console.log(json);
                // eslint-disable-next-line react/prop-types
            })
            .catch(err=>{
                console.error(err)
            })
    }
    return (
        <div className="GamesidebarButtons">
            <div className="Gameusername2">
                {/* eslint-disable-next-line react/prop-types */}
                <p>{firstName === user ? opponentName : user}</p>
                <p>Rank: {firstName === user ? opponentRank : userRating}</p>

            </div>
            <button onClick={resign} className="GamesidebarButton">Resign</button>
            <button onClick={draw} className="GamesidebarButton">Offer draw</button>


            <div className="username">
                <p>{firstName === user ? user : opponentName}</p>
                <p>Rank: {firstName === user ? userRating : opponentRank}</p>
            </div>
            <button onClick={()=>setAuthHeader("null")} className="GamesidebarButton">Log out</button>
        </div>

    )
}