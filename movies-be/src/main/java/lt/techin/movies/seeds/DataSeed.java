package lt.techin.movies.seeds;

import lombok.RequiredArgsConstructor;
import lt.techin.movies.entity.Category;
import lt.techin.movies.entity.Movie;
import lt.techin.movies.repository.CategoryRepository;
import lt.techin.movies.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeed implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final MovieRepository movieRepository;

    @Override
    public void run(String... args) {

        Category drama = new Category();
        drama.setName("Drama");
        drama = categoryRepository.save(drama);

        Category sciFi = new Category();
        sciFi.setName("Sci-Fi");
        sciFi = categoryRepository.save(sciFi);

        Category comedy = new Category();
        comedy.setName("Comedy");
        comedy = categoryRepository.save(comedy);

        movieRepository.save(new Movie(
                null,
                "Interstellar",
                "Epic science fiction film about space exploration and survival of humanity.",
                8.6,
                "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
                sciFi
        ));

        movieRepository.save(new Movie(
                null,
                "Dune",
                "Science fiction film about politics, power and destiny on the desert planet Arrakis.",
                8.0,
                "https://upload.wikimedia.org/wikipedia/en/a/a5/Dune_%282021_film%29.jpg",
                sciFi
        ));

        movieRepository.save(new Movie(
                null,
                "Oppenheimer",
                "Biographical drama about the creation of the atomic bomb.",
                8.4,
                "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%282023%29.jpg",
                drama
        ));

        movieRepository.save(new Movie(
                null,
                "Barbie",
                "Comedy fantasy film exploring identity and gender roles.",
                7.0,
                "https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg",
                comedy
        ));

        movieRepository.save(new Movie(
                null,
                "The Dark Knight",
                "Crime drama film featuring Batman and the Joker.",
                9.0,
                "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
                drama
        ));
    }
}
