package lt.techin.movies.controller;

import lombok.RequiredArgsConstructor;
import lt.techin.movies.dto.CategoryDto;
import lt.techin.movies.entity.Category;
import lt.techin.movies.repository.MovieRepository;
import lt.techin.movies.repository.CategoryRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoriesController {

    private final CategoryRepository categoryRepository;
    private final MovieRepository movieRepository;

    @GetMapping
    public List<CategoryDto> list() {
        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategoryDto(c.getId(), c.getName()))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDto create(@RequestBody CategoryDto req) {
        if (req == null || req.name() == null || req.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }

        Category c = new Category();
        c.setName(req.name().trim());

        try {
            var saved = categoryRepository.save(c);
            return new CategoryDto(saved.getId(), saved.getName());
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }
    }

    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @RequestBody CategoryDto req) {
        if (req == null || req.name() == null || req.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }

        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        c.setName(req.name().trim());

        try {
            var saved = categoryRepository.save(c);
            return new CategoryDto(saved.getId(), saved.getName());
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }

        if (movieRepository.existsByCategory_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category is used by books");
        }

        categoryRepository.deleteById(id);
    }
}
