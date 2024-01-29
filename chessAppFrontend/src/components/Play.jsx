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
    const [over, setOver] = useState("");
    const [userName, setUserName] = useState('Username');
    const [userRating, setUserRating] = useState('---');
    // const [opponentRating, setOpponentRating] = useState('---');
    const [turn, setTurn] = useState('w');
    const [time1, setTime1] = useState("600");
    const [time2, setTime2] = useState("600");
    const [isTimer1Running, setIsTimer1Running] = useState(true);
    const [isTimer2Running, setIsTimer2Running] = useState(false);
    const [firstMove, setFirstMove] = useState(true);
    const [xd, setXd] = useState(0);

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



        // console.log("TIMER");
        // console.log(isTimer1Running)
        // console.log(isTimer2Running)

        // setChats(chats=>[...chats, text]);
        // console.log(text);
        console.log("RECEIVCED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        // if(!isTimer1Running && !isTimer2Running){
        //     setIsTimer2Running(isTimer2Running=>!isTimer2Running);
        // }
        // else {
        //     setIsTimer1Running(isTimer1Running=>!isTimer1Running);
        //     setIsTimer2Running(isTimer2Running=>!isTimer2Running);
        // }
        //
        // else if(isTimer1Running){
        //     setIsTimer1Running(false);
        //     setIsTimer2Running(true);
        // }
        // else if(isTimer2Running) {
        //     setIsTimer1Running(true);
        //     setIsTimer2Running(false);
        // }

        setIsTimer1Running(isTimer1Running=>!isTimer1Running);
        setIsTimer2Running(isTimer2Running=>!isTimer2Running);
        setFirstMove(false);
        setXd((xd)=>xd+1);

        console.log(firstMove);
        console.log(xd);
        console.log(isTimer1Running);
        console.log(isTimer2Running);


    }

    function sendMove(move){
        // e.preventDefault();
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
        // axios.post('/api/game/send/move', moveSend, {
        //     headers: {
        //         'Authorization': 'Bearer ' + getAuthToken(),
        //         'Content-Type': 'application/json'
        //     }
        // }).then(response=>{
        //     console.log("MOVEVEVEVEVE")
        //     console.log(response)
        //
        // }).catch(err=>{
        //     console.error(err)
        // });


    }


    const makeAMove = useCallback(
        (move)=>{
            try {
                const result = chess.move(move); // update Chess instance
                console.log("RESULT");
                console.log(result);
                setFen(chess.fen()); // update fen state to trigger a re-render
                // console.log(fen);
                console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());



                if (chess.isGameOver()) { // check if move led to "game over"
                    if (chess.isCheckmate()) { // if reason for game over is a checkmate
                        // Set message to checkmate.
                        setOver(
                            `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
                        );
                        // The winner is determined by checking which side made the last move
                    } else if (chess.isDraw()) { // if it is a draw
                        setOver("Draw"); // set message to "Draw"
                    } else {
                        setOver("Game over");
                    }
                }

                return result;
            } catch (e) {
                return null;
            } // null if the move was illegal, the move object if the move was legal
        },
        [chess]
    );

    // function getTime(color){
    //     let request = {
    //         "player": setUserName(jwtDecode(getAuthToken()).sub),
    //         "gameId": window.localStorage.getItem('game_id')
    //     }
    //     axios.post('/api/game/getgame', request).then(response=>{
    //
    //
    //         // setTime1(response.data.firstPlayerTime);
    //         // setTime2(response.data.secondPlayerTime);
    //
    //         //
    //         // console.log("RESPONESE");
    //         // console.log(time1);
    //         // console.log(time2);
    //
    //
    //     }).catch(err=>{
    //         console.error(err)
    //     });
    // }
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

            // setTime1(response.data.firstPlayerTime);
            // setTime2(response.data.secondPlayerTime);

            //
            // console.log("RESPONESE");
            // console.log(time1);
            // console.log(time2);


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
                        {/*<div>{xd}</div>*/}
                        <Timer color={'b'} duration={time2} isOn={isTimer2Running} firstMove={firstMove}/>
                        <Chessboard id="board" position={fen} onPieceDrop={onDrop} boardWidth={850}></Chessboard>
                        <Timer color={'w'} duration={time1} isOn={isTimer1Running} firstMove={firstMove}/>
                    </div>


                </div>
                <div className="sidebar">
                    <ChatSidebar gameId={gameId} user={userName} socket={socket}/>
                </div>
            </div>

    )
}