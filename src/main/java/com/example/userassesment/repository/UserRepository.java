package com.example.userassesment.repository;

import com.example.userassesment.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface UserRepository extends JpaRepository<Users, Long> {
    List<Users> findByNameIgnoreCase(String name);

    Optional<Users> findByEmail(String email);
}

