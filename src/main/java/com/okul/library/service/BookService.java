package com.okul.library.service;

import com.okul.library.model.Book;
import com.okul.library.model.Loan;
import com.okul.library.repository.BookRepository;
import com.okul.library.repository.LoanRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;

    // Constructor Injection (En sağlıklı yöntem)
    public BookService(BookRepository bookRepository, LoanRepository loanRepository) {
        this.bookRepository = bookRepository;
        this.loanRepository = loanRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> searchBooks(String keyword) {
        // Hem isme hem yazara göre arama yapalım
        List<Book> byTitle = bookRepository.findByTitleContainingIgnoreCase(keyword);
        List<Book> byAuthor = bookRepository.findByAuthorContainingIgnoreCase(keyword);
        byTitle.addAll(byAuthor); // İki listeyi birleştir
        return byTitle;
    }

    // --- ÖNERİ ALGORİTMASI ---
    public List<Book> recommendBooks(Long memberId) {
        // 1. Üyenin geçmiş ödünç işlemlerini bul
        List<Loan> memberLoans = loanRepository.findByMemberId(memberId);

        if (memberLoans.isEmpty()) {
            // Hiç kitap okumamışsa rastgele 3 kitap öner
            return bookRepository.findAll().stream().limit(3).toList();
        }

        // 2. En son okuduğu kitabı bul
        Loan lastLoan = memberLoans.get(memberLoans.size() - 1);
        String favGenre = lastLoan.getBook().getGenre();

        // 3. Veritabanındaki kitaplardan bu türde olanları bul (Basit filtreleme)
        List<Book> allBooks = bookRepository.findAll();
        return allBooks.stream()
                .filter(book -> book.getGenre().equalsIgnoreCase(favGenre)) // Aynı tür
                .filter(book -> !book.getId().equals(lastLoan.getBook().getId())) // Okuduğu kitap olmasın
                .limit(5) // En fazla 5 tane öner
                .toList();
    }
}