package com.okul.library.repository;

import com.okul.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCase(String keyword); // İsme göre ara
    List<Book> findByAuthorContainingIgnoreCase(String keyword); // Yazara göre ara
}