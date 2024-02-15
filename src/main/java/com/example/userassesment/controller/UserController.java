package com.example.userassesment.controller;

import com.example.userassesment.model.Users;
import com.example.userassesment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/{id}")
    public Optional<Users> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/byName/{name}")
    public List<Users> getUsersByName(@PathVariable String name) {
        System.out.println("Searching for users by name: " + name);
        List<Users> users = userRepository.findByNameIgnoreCase(name);
        System.out.println("Found users: " + users);
        return users;
    }


    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/byEmail/{email}")
    public Optional<Users> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping
    public Users addUser(@RequestBody Users user) {
        return userRepository.save(user);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PutMapping("/{id}")
    public Users updateUser(@PathVariable Long id, @RequestBody Users updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setEmail(updatedUser.getEmail());
                    return userRepository.save(user);
                })
                .orElseGet(() -> {
                    updatedUser.setId(id);
                    return userRepository.save(updatedUser);
                });
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
