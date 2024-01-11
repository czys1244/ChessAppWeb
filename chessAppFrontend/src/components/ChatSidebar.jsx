import './styles/GameSidebarButtons.css'
export const ChatSidebar = ()=>{
    return (
        <div className="chat-box">
            <p id="chat">Chat</p>
            <div id="gap"></div>
            <input className="textsend" id="send"></input>
            <button className="GamesidebarButton" id="sendButton">Send</button>
        </div>

    )
}