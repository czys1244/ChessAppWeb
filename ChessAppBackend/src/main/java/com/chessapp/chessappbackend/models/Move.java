package com.chessapp.chessappbackend.models;

import lombok.Data;

@Data
public class Move {
    private String gameId;
    private Integer squareIndex;
    private Color color;
}
