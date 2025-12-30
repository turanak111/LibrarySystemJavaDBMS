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

    // Yeni üye kaydetme
    public Member saveMember(Member member) {
        return memberRepository.save(member);
    }

    // Tüm üyeleri listeleme
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }
}