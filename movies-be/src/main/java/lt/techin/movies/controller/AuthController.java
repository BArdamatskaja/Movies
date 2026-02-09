package lt.techin.movies.controller;


import lombok.RequiredArgsConstructor;
import lt.techin.movies.dto.AuthResponse;
import lt.techin.movies.dto.LoginRequest;
import lt.techin.movies.dto.RegisterRequest;
import lt.techin.movies.entity.Role;
import lt.techin.movies.entity.User;
import lt.techin.movies.repository.UserRepository;
import lt.techin.movies.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest) {
        if (registerRequest.email() == null || registerRequest.password() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        if (userRepository.existsByEmail(registerRequest.email())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email exists");

        User user = new User();
        user.setEmail(registerRequest.email().toLowerCase());
        user.setPassword(encoder.encode(registerRequest.password()));
        user.setRole(Role.USER);
        userRepository.save(user);

        String token = jwt.generate(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        var u = userRepository.findByEmail(loginRequest.email().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad credentials"));

        if (!encoder.matches(loginRequest.password(), u.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad credentials");

        String token = jwt.generate(u.getEmail(), u.getRole().name());
        return new AuthResponse(token, u.getEmail(), u.getRole().name());
    }

}
