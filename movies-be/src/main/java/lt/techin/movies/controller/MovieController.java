package lt.techin.movies.controller;


import lombok.RequiredArgsConstructor;
import lt.techin.movies.dto.MovieDto;
import lt.techin.movies.entity.Movie;
import lt.techin.movies.repository.MovieRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/movies")
public class MovieController {

 private final MovieRepository movieRepository;

 @GetMapping
    public List<MovieDto> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId
 ) {
     String query = (q == null || q.isBlank()) ? null : q.trim();
     List<Movie> movies = movieRepository.search(query, categoryId);

     return movies.stream()
             .map(m -> new MovieDto(
                     m.getId(),
                     m.getTitle(),
                     m.getDescription(),
                     m.getCover(),
                     m.getCategory() != null ? m.getCategory().getId() : null,
                     m.getCategory() != null ? m.getCategory().getName() : null,
                     m.getIMBD()
             ))
             .toList();

 }
}
