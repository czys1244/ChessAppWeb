import {GameSidebarButtons} from "./GameSidebarButtons.jsx";
import {Chessboard} from "react-chessboard";

import './styles/Chessboard.css'
import {ChatSidebar} from "./ChatSidebar.jsx";

export const Play = ()=>{
    return (
        <div className="flex-container">
            <div className="sidebar">
                <GameSidebarButtons/>
            </div>
            <div className="center2">

                <div className="chess">
                    <div className="timer">10:00</div>
                    <Chessboard></Chessboard>
                    <div className="timer">10:00</div>
                </div>

            </div>
            <div className="sidebar">
                <ChatSidebar/>
            </div>
        </div>

    )
}