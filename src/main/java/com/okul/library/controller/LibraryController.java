package com.okul.library.controller;

import com.okul.library.model.Book;
import com.okul.library.model.Member;
import com.okul.library.service.BookService;
import com.okul.library.service.LoanService;
import com.okul.library.service.MemberService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LibraryController {

    private final BookService bookService;
    private final LoanService loanService;
    private final MemberService memberService;

    // Constructor
    public LibraryController(BookService bookService, LoanService loanService, MemberService memberService) {
        this.bookService = bookService;
        this.loanService = loanService;
        this.memberService = memberService;
    }

    // KİTAP İŞLEMLERİ

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping("/books")
    public Book createBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @GetMapping("/books/search")
    public List<Book> searchBooks(@RequestParam String query) {
        return bookService.searchBooks(query);
    }

    // ÜYE İŞLEMLERİ

    @GetMapping("/members")
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    @PostMapping("/members")
    public Member createMember(@RequestBody Member member) {
        return memberService.saveMember(member);
    }

// --- ÖDÜNÇ / İADE İŞLEMLERİ ---

    // GÜNCELLENDİ: Artık JSON Body alıyor
    @PostMapping("/borrow")
    public String borrowBook(@RequestBody com.okul.library.dto.BorrowRequest request) {
        return loanService.borrowBook(request.getBookId(), request.getMemberId());
    }
    @PostMapping("/return")
    public String returnBook(@RequestParam Long loanId) {
        return loanService.returnBook(loanId);
    }

    @GetMapping("/recommend")
    public List<Book> getRecommendations(@RequestParam Long memberId) {
        return bookService.recommendBooks(memberId);
    }

    // --- SİLME İŞLEMLERİ (YENİ) ---

    @DeleteMapping("/books/{id}")
    public String deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return "Kitap silindi.";
    }

    @DeleteMapping("/members/{id}")
    public String deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return "Üye silindi.";
    }

    // --- STOK GÜNCELLEME (YENİ) ---

    @PutMapping("/books/{id}/stock")
    public com.okul.library.model.Book updateStock(@PathVariable Long id, @RequestParam int newStock) {
        return bookService.updateStock(id, newStock);
    }

    // --- CEZA İPTALİ (YENİ) ---

    @PutMapping("/loans/{id}/waive")
    public String waiveFine(@PathVariable Long id) {
        return loanService.waiveFine(id);
    }
}