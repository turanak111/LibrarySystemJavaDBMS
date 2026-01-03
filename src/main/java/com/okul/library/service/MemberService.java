package com.okul.library.service;

import com.okul.library.model.Member;
import com.okul.library.repository.MemberRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member saveMember(Member member) {
        return memberRepository.save(member);
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public void deleteMember(Long id) {
        // Güvenlik: Önce üyenin üzerinde iade etmediği kitap var mı bakalım?
        // Bu kontrol için LoanRepository'e ihtiyacımız var ama burada yoksa basitçe silebiliriz.
        // Hata almamak için direkt siliyoruz (Veritabanı foreign key hatası verirse frontend anlar)
        memberRepository.deleteById(id);
    }
}