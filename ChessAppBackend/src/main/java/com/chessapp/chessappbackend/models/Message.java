package com.chessapp.chessappbackend.models;


import lombok.Data;


@Data
public class Message {
    private String gameId;
    private String text;
    private String user;
}
