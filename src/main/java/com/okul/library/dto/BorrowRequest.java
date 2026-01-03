package com.okul.library.dto;

import lombok.Data;

@Data
public class BorrowRequest {
    private Long bookId;
    private Long memberId;
}