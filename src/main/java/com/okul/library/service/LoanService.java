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

    @Transactional
    public String borrowBook(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Kitap bulunamadı!"));
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Üye bulunamadı!"));

        // STOK KONTROLÜ (YENİ)
        if (book.getStock() <= 0) {
            return "Hata: Stokta hiç kitap kalmadı!";
        }

        Loan loan = new Loan();
        loan.setBook(book);
        loan.setMember(member);
        loan.setLoanDate(LocalDate.now());
        loan.setReturned(false);

        // STOK DÜŞÜRME (YENİ)
        book.setStock(book.getStock() - 1);
        bookRepository.save(book);

        loanRepository.save(loan);
        return "Kitap başarıyla ödünç verildi. Kalan Stok: " + book.getStock();
    }

    @Transactional
    public String returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("İşlem bulunamadı!"));

        if (loan.isReturned()) {
            return "Bu kitap zaten iade edilmiş.";
        }

        loan.setReturned(true);
        loan.setReturnDate(LocalDate.now());

        // STOK ARTIRMA (YENİ)
        Book book = loan.getBook();
        book.setStock(book.getStock() + 1);
        bookRepository.save(book);

        loanRepository.save(loan);

        // CEZA HESAPLAMA
        if (loan.isFineWaived()) { // Eğer ceza affedildiyse
            return "İade alındı. Gecikme cezası YÖNETİCİ TARAFINDAN İPTAL EDİLMİŞTİR.";
        }

        LocalDate dueDate = loan.getLoanDate().plusDays(15);
        if (loan.getReturnDate().isAfter(dueDate)) {
            long daysLate = ChronoUnit.DAYS.between(dueDate, loan.getReturnDate());
            long fine = daysLate * 5;
            return "İade alındı. GECİKME CEZASI: " + fine + " TL";
        }

        return "İade alındı. Teşekkürler!";
    }

    // CEZA İPTAL METODU (YENİ)
    public String waiveFine(Long loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Kayıt yok"));
        loan.setFineWaived(true);
        loanRepository.save(loan);
        return "Ceza başarıyla iptal edildi/affedildi.";
    }
}