package lt.techin.movies.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.techin.movies.entity.Movie;
import lt.techin.movies.entity.Review;
import lt.techin.movies.repository.MovieRepository;
import lt.techin.movies.dto.ReviewCreateRequest;
import lt.techin.movies.repository.ReviewRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/movies/{movieId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;

    @GetMapping
    public List<Review> list(@PathVariable Long movieId) {
        return reviewRepository.findByMovie_IdOrderByCreatedAtDesc(movieId);
    }

    @PostMapping
    public Review create(@PathVariable Long movieId, @Valid @RequestBody ReviewCreateRequest req) {
        Movie movie = movieRepository.findById(movieId).orElseThrow();

        Review r = new Review();
        r.setUserId(req.userId());
        r.setMovie(movie);
        r.setRating(req.rating());
        r.setComment(req.comment());
        r.setCreatedAt(LocalDate.now());

        return reviewRepository.save(r);
    }
}
