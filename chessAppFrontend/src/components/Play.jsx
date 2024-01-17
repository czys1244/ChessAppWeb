import {GameSidebarButtons} from "./GameSidebarButtons.jsx";
import {Chessboard} from "react-chessboard";
import { Chess } from "chess.js";
import './styles/Chessboard.css'
import {ChatSidebar} from "./ChatSidebar.jsx";
import {useCallback, useMemo, useState} from "react";

export const Play = ()=>{
    const chess = useMemo(() => new Chess(), []); // <- 1
    const [fen, setFen] = useState(chess.fen()); // <- 2
    const [over, setOver] = useState("");

    const makeAMove = useCallback(
        (move) => {
            try {
                const result = chess.move(move); // update Chess instance
                setFen(chess.fen()); // update fen state to trigger a re-render

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
    function onDrop(sourceSquare, targetSquare) {
        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
            // promotion: "q",
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;

        return true;
    }
    return (
        <div className="flex-container">
            <div className="sidebar">
                <GameSidebarButtons/>
            </div>
            <div className="center2">

                <div className="chess">
                    <div className="timer">10:00</div>
                    <Chessboard position={fen} onPieceDrop={onDrop}></Chessboard>
                    <div className="timer">10:00</div>
                </div>


            </div>
            <div className="sidebar">
                <ChatSidebar/>
            </div>
        </div>

    )
}