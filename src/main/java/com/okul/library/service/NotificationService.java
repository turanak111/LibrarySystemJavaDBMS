package com.okul.library.service;

import com.okul.library.model.Loan;
import com.okul.library.repository.LoanRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {

    private final LoanRepository loanRepository;
    private final JavaMailSender javaMailSender; // Mail gönderme aracı

    // Constructor Injection ile JavaMailSender'ı alıyoruz
    public NotificationService(LoanRepository loanRepository, JavaMailSender javaMailSender) {
        this.loanRepository = loanRepository;
        this.javaMailSender = javaMailSender;
    }

    @Scheduled(cron = "0 * * * * *") // Dakikada bir kontrol (Test için)
    public void checkOverdueBooks() {
        System.out.println("--- GECİKMİŞ KİTAP TARAMASI BAŞLADI ---");

        List<Loan> activeLoans = loanRepository.findByReturnedFalse();

        for (Loan loan : activeLoans) {
            LocalDate dueDate = loan.getLoanDate().plusDays(15);

            if (LocalDate.now().isAfter(dueDate)) {
                long daysLate = ChronoUnit.DAYS.between(dueDate, LocalDate.now());
                long fine = daysLate * 5;

                // Maili Hazırla ve Gönder
                sendWarningEmail(loan, daysLate, fine);
            }
        }
        System.out.println("--- TARAMA BİTTİ ---");
    }

    // Mail Gönderme Metodu
    private void sendWarningEmail(Loan loan, long daysLate, long fine) {
        // Üyenin mail adresi var mı kontrol et (Boşsa patlamasın)
        if (loan.getMember().getEmail() == null || loan.getMember().getEmail().isEmpty()) {
            System.out.println("HATA: Üyenin mail adresi yok! ID: " + loan.getMember().getId());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("seninmailadresin@gmail.com"); // Gönderen (application.properties ile aynı olsun)
        message.setTo(loan.getMember().getEmail());    // Alıcı
        message.setSubject("Kütüphane - İade Gecikmesi"); // Konu

        String text = "Sayın " + loan.getMember().getFullName() + ",\n\n" +
                "'" + loan.getBook().getTitle() + "' kitabınızın iade tarihi geçmiştir.\n" +
                "Gecikme Süresi: " + daysLate + " gün.\n" +
                "Güncel Ceza Tutarınız: " + fine + " TL.\n\n" +
                "Lütfen en kısa sürede kütüphaneye uğrayınız.";

        message.setText(text); // İçerik

        try {
            javaMailSender.send(message);
            System.out.println("Mail gönderildi: " + loan.getMember().getEmail());
        } catch (Exception e) {
            System.out.println("Mail gönderirken hata oluştu: " + e.getMessage());
        }
    }
}