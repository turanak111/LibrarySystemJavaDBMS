package com.okul.library.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int stock; // YENİ: Kaç adet var?

    private String title;
    private String author;
    private String isbn;
    private String genre;

    public boolean isAvailable() {
        return stock > 0;
    }

    @Column(name = "is_available")
    private boolean isAvailable;

    // Bir kitabın bir şubesi olur
    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;
}