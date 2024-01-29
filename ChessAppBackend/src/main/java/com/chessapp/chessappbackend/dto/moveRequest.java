package com.chessapp.chessappbackend.dto;

import lombok.Data;

@Data
public class moveRequest {
    private String gameId;
    private String from;
    private String to;
    private String color;
    private String promotion;
}
