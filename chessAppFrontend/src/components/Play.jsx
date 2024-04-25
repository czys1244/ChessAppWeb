import {GameSidebarButtons} from "./GameSidebarButtons.jsx";
import {Chessboard} from "react-chessboard";
import {Chess} from "chess.js";
import './styles/Chessboard.css'
import {ChatSidebar} from "./ChatSidebar.jsx";
import {useCallback, useEffect, useMemo, useState} from "react";
import {getAuthToken} from "../auth/auth.js";
import {jwtDecode} from "jwt-decode";
import {over as socketOver} from "stompjs";
import SockJS from "sockjs-client/dist/sockjs"
import axios from "axios";
// import EventEmitter from "reactjs-eventemitter";
import {Timer} from "./Timer.jsx";
let socket = null;
export const Play = ()=>{
    const chess = useMemo(()=>new Chess(), []); // <- 1
    // const [move, setMove] = useState(null);
    // const [socket, setSocket] = useState(null);
    const [fen, setFen] = useState(chess.fen()); // <- 2
    const [gameId, setGameId] = useState("-");
    const [userName, setUserName] = useState('Username');
    const [userRating, setUserRating] = useState('---');
    // const [opponentRating, setOpponentRating] = useState('---');
    const [turn, setTurn] = useState('w');
    const [isTimer1Running, setIsTimer1Running] = useState(true);
    const [isTimer2Running, setIsTimer2Running] = useState(false);
    const [firstMove, setFirstMove] = useState(true);
    const time = 600;

    useEffect(()=>{
        let token = getAuthToken();
        // console.log(jwtDecode(getAuthToken()))
        setUserName(jwtDecode(getAuthToken()).sub);
        fetch('/api/game/rating', {
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
                setUserRating(json);
            })
            .catch(err=>{
                console.error(err)
            })
    }, [userRating, userName]);
    useEffect(()=>{
        let id = window.localStorage.getItem('game_id');
        if (id !== null) {
            // connectToSocket(id);
            setGameId(id);
        }
        console.log(id);
        getGame(id);
    }, [getGame]);
    useEffect(()=>{
        while(window.localStorage.getItem('game_id')==null){
            console.log("WAITING");
        }
        connectToSocket(window.localStorage.getItem('game_id'));
    }, []);

    function connectToSocket(id){
        socket = new SockJS('http://localhost:8080/send');
        let stompClient = socketOver(socket);
        stompClient.connect({}, function (frame){
            console.log("connected to the frame: " + frame);
            stompClient.subscribe("/queue/game-progress/" + id, onMoveReceived)
        })

    }

    const onMoveReceived = (payloadData)=>{
        let text = JSON.parse(payloadData.body);
        makeAMove(text);

        setIsTimer1Running(isTimer1Running=>!isTimer1Running);
        setIsTimer2Running(isTimer2Running=>!isTimer2Running);
        setFirstMove(false);
    }

    function sendMove(move){
        let moveSend = {
            gameId: window.localStorage.getItem('game_id'),
            from: move.from,
            to: move.to,
            color: move.color,
            promotion: "q"
        };

        fetch('/api/game/send/move', {
            method: 'POST',
            body: JSON.stringify(moveSend),
            headers: {
                'Authorization': 'Bearer ' + getAuthToken(),
                'Content-Type': 'application/json'
            }
        })
            .then(response=>{
                if (response.status === 200)
                    return response.json()
            })
            .then(json=>{
                console.log("MOVE")
                console.log(json)
            })
            .catch(err=>{
                console.error(err)
            })

    }


    const makeAMove = useCallback(
        (move)=>{
            try {
                const result = chess.move(move); // update Chess instance
                console.log("RESULT");
                console.log(result);
                setFen(chess.fen()); // update fen state to trigger a re-render
                // console.log(fen);
                if (chess.isGameOver()) {
                    if (chess.isCheckmate()) {
                        alert(`Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`);
                    } else if (chess.isDraw()) { // if it is a draw
                        alert(`Draw!`);
                    } else {
                        alert(`Game over!`);
                    }
                }

                return result;
            } catch (e) {
                return null;
            } // null if the move was illegal, the move object if the move was legal
        },
        [chess]
    );

    function getGame(){
        let request = {
            "player": setUserName(jwtDecode(getAuthToken()).sub),
            "gameId": window.localStorage.getItem('game_id')
        }
        setUserName(jwtDecode(getAuthToken()).sub);
        axios.post('/api/game/getgame', request).then(response=>{
            // console.log("GGGG")
            // console.log(response.data)
            let player = jwtDecode(getAuthToken()).sub;
            if (response.data.firstPlayer === player) {
                setTurn('w');
            } else {
                setTurn('b');
            }
            chess.load(response.data.fen);
            setFen(chess.fen());
        }).catch(err=>{
            console.error(err)
        });
    }

    function onDrop(sourceSquare, targetSquare){
        console.log("TURN");
        console.log(turn);
        // console.log(chess.turn())
        if (chess.turn() !== turn) return false;
        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
            promotion: "q",
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;
        sendMove(move);


        return true;
    }

    // useEffect(()=>{
    //     setFen(getGame(gameId));
    // }, []);
    return (
        gameId === "-" ? <div>Wrong id</div> :
            <div className="flex-container">
                <div className="sidebar">
                    <GameSidebarButtons gameId={gameId} user={userName} userRating={userRating}/>
                </div>
                <div className="center2">

                    <div className="chess">
                        <Timer color={'black'} user={userName} gameId={gameId} duration={time} isOn={isTimer2Running} firstMove={firstMove}/>
                        <Chessboard id="board" position={fen} onPieceDrop={onDrop} boardWidth={850}></Chessboard>
                        <Timer color={'white'} user={userName} gameId={gameId} duration={time} isOn={isTimer1Running} firstMove={firstMove}/>
                    </div>


                </div>
                <div className="sidebar">
                    <ChatSidebar gameId={gameId} user={userName} socket={socket}/>
                </div>
            </div>

    )
}