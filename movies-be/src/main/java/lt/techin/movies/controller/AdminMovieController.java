package lt.techin.movies.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.techin.movies.dto.MovieAddRequest;
import lt.techin.movies.dto.MovieDto;
import lt.techin.movies.entity.Category;
import lt.techin.movies.entity.Movie;
import lt.techin.movies.repository.CategoryRepository;
import lt.techin.movies.repository.MovieRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/movies")
@RequiredArgsConstructor
public class AdminMovieController {

    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovieDto create(@Valid @RequestBody MovieAddRequest req) {
        Category category = categoryRepository.findById(req.categoryId()).orElseThrow();

        Movie m = new Movie();
        m.setTitle(req.title());
        m.setDescription(req.description());
        m.setIMBD(req.IMBD());
m.setCover(req.cover());

        if (req.categoryId() == null) {
            m.setCategory(null);
        } else {
            var cat = categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));
            m.setCategory(cat);
        }
Movie saved = movieRepository.save(m);
        return toResponse(saved);
    }
    @PutMapping("/{id}")
    public MovieDto update(@PathVariable Long id, @Valid @RequestBody MovieAddRequest req) {
        Movie m = movieRepository.findById(id).orElseThrow();
        Category category = categoryRepository.findById(req.categoryId()).orElseThrow();

        m.setTitle(req.title());
        m.setDescription(req.description());
        m.setIMBD(req.IMBD());
        m.setCover(req.cover());

        if (req.categoryId() == null) {
            m.setCategory(null);
        } else {
            var cat = categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));
            m.setCategory(cat);
        }

        Movie saved = movieRepository.save(m);
        return toResponse(saved);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
if(!movieRepository.existsById(id)) {
throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found");
}
movieRepository.deleteById(id);
    }

    private MovieDto toResponse(Movie m) {
        return new MovieDto(
                m.getId(),
                m.getTitle(),
                m.getDescription(),
                m.getCover(),
                m.getCategory().getId(),
                m.getCategory().getName(),
                m.getIMBD()
        );
    }
}