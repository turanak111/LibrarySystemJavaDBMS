package com.okul.library.repository;

import com.okul.library.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByMemberId(Long memberId); // Bir üyenin geçmiş işlemleri
    List<Loan> findByReturnedFalse(); // İade edilmemiş kitapları bul
}