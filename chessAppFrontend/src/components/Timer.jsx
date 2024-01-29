import './styles/Chessboard.css'
import {useEffect, useRef, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getAuthToken} from "../auth/auth.js";
import axios from "axios";
// eslint-disable-next-line react/prop-types
export const Timer = ({color, duration, isOn, firstMove}) => {
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