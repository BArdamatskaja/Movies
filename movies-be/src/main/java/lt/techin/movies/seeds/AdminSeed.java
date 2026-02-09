package lt.techin.movies.seeds;

import lombok.RequiredArgsConstructor;
import lt.techin.movies.entity.Role;
import lt.techin.movies.entity.User;
import lt.techin.movies.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeed implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Value("${app.admin.email}")
    private String email;

    @Value("${app.admin.password}")
    private String password;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(email)) return;

        User u = new User();
        u.setEmail(email);
        u.setPassword(encoder.encode(password));
        u.setRole(Role.ADMIN);

        userRepository.save(u);
    }
}