import './styles/GameSidebarButtons.css'
import {useEffect, useState} from "react";
import {over as socketOver, over} from "stompjs";
import SockJS from "sockjs-client/dist/sockjs"
import axios from 'axios';

// var socket = null;
// import {connectToSocket} from "../websockets/connectToSocket.js";
export const ChatSidebar = (props)=>{
    const [chats, setChats] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    // eslint-disable-next-line react/prop-types
    const gameId = props.gameId;
    useEffect(()=>{
        connectToSocket(gameId)
    }, [gameId]);

    function connectToSocket(id){


        let socket = new SockJS('http://localhost:8080/send');
        let stompClient = socketOver(socket);


        stompClient.connect({}, function (frame){
            console.log("connected to the frame: " + frame);
            stompClient.subscribe("/topic/message/" + id, onMessageReceived)
        })
    }

    const onMessageReceived = (payloadData)=>{
        let text = JSON.parse(payloadData.body);
        setChats(chats=>[...chats, text]);
        console.log(text);
    }

    function sendMessage(e){
        e.preventDefault();
        let chatMessage = {
            gameId: gameId,
            text: inputMessage,
            // eslint-disable-next-line react/prop-types
            user: props.user
        };


        axios.post('/api/game/send/chat', chatMessage).then(response=>{
            console.log(response)
        }).catch(err=>{
            console.error(err)
        });


    }


    return (
        <div className="chat-box">
            <p id="chat">Chat</p>
            <div className="chatList">
                {chats.map((chats, index)=>{
                    // eslint-disable-next-line react/prop-types
                    return chats.user === props.user ?
                        <p className="message" key={index}>{"[" + chats.user + "] " + chats.text}</p> :
                        <p className="opponentMessage" key={index}>{"[" + chats.user + "] " + chats.text}</p>
                })}
            </div>
            <form onSubmit={sendMessage}>
                <input className="textsend" id="send" onChange={(e)=>{
                    setInputMessage(e.target.value)
                }}></input>
                <button className="GamesidebarButton" id="sendButton">Send</button>
            </form>
        </div>

    )
}