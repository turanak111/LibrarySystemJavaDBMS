package com.okul.library.service;

import com.okul.library.model.Book;
import com.okul.library.model.Loan;
import com.okul.library.model.Member;
import com.okul.library.repository.BookRepository;
import com.okul.library.repository.LoanRepository;
import com.okul.library.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public LoanService(LoanRepository loanRepository, BookRepository bookRepository, MemberRepository memberRepository) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional //Rollback
    public String borrowBook(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Kitap bulunamadı!"));
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Üye bulunamadı!"));

        if (!book.isAvailable()) {
            return "Hata: Bu kitap şu an başkasında!";
        }

        // Kitabı ödünç ver
        Loan loan = new Loan();
        loan.setBook(book);
        loan.setMember(member);
        loan.setLoanDate(LocalDate.now());
        loan.setReturned(false);

        book.setAvailable(false);
        bookRepository.save(book);

        loanRepository.save(loan);
        return "Kitap ödünç verildi.";
    }

    @Transactional
    public String returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("İşlem bulunamadı"));

        if (loan.isReturned()) {
            return "Bu kitap zaten iade edilmiş.";
        }

        loan.setReturned(true);
        loan.setReturnDate(LocalDate.now());

        // Kitabı tekrar müsait yap
        Book book = loan.getBook();
        book.setAvailable(true);
        bookRepository.save(book);
        loanRepository.save(loan);

        // CEZA HESAPLAMA 

        // Kural: 15 gün içinde getirmeli.
        LocalDate dueDate = loan.getLoanDate().plusDays(15);

        if (loan.getReturnDate().isAfter(dueDate)) {
            long daysLate = ChronoUnit.DAYS.between(dueDate, loan.getReturnDate());
            long fine = daysLate * 5; // Günlük 5 TL ceza
            return "İade alındı. GECİKME CEZASI: " + fine + " TL";
        }

        return "İade alındı. Teşekkürler!";
    }
}