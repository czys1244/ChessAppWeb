import './styles/Chessboard.css'
import {useEffect, useState} from "react";

import {getAuthToken} from "../auth/auth.js";

// eslint-disable-next-line react/prop-types
export const Timer = ({color, gameId, duration, isOn, firstMove}) => {
    const [time, setTime] = useState(duration);
    const [isTimerRunning, setIsTimerRunning] = useState(isOn);
    // const [isFirstMove, setIsFirstMove] = useState(firstMove);

    useEffect(()=>{

        // setTime(duration);

        // if (duration === 1000){
        //     setTime(duration);
        // }
        setIsTimerRunning(isOn);

        const timeoutId= setTimeout(()=>{
            if (isTimerRunning && !firstMove){
                if (time === 0){
                    let token = getAuthToken();
                    let game = {
                        // "player": user,
                        "gameId": gameId
                    }
                    fetch('/api/game/time', {
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
                        })
                        .catch(err=>{
                            console.error(err)
                        })
                    alert(color + " lost");
                }
                setTime(time - 1);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);

    }, [firstMove, isOn, time, isTimerRunning, color, duration]);
    return (
        <div className="timer">
            {time}
        </div>
    )
}