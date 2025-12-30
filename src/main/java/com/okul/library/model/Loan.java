package com.okul.library.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Hangi kitap?
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    // Hangi üye?
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "loan_date")
    private LocalDate loanDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    private boolean returned; // Kitap iade edildi mi?
}