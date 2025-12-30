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

    // ÖDÜNÇ/İADE İŞLEMLERİ

    @PostMapping("/borrow")
    public String borrowBook(@RequestParam Long bookId, @RequestParam Long memberId) {
        return loanService.borrowBook(bookId, memberId);
    }

    @PostMapping("/return")
    public String returnBook(@RequestParam Long loanId) {
        return loanService.returnBook(loanId);
    }

    @GetMapping("/recommend")
    public List<Book> getRecommendations(@RequestParam Long memberId) {
        return bookService.recommendBooks(memberId);
    }
}