package lt.techin.movies.controller;

import lombok.RequiredArgsConstructor;
import lt.techin.movies.dto.CategoryDto;
import lt.techin.movies.repository.CategoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoriesController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<CategoryDto> list() {
        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategoryDto(c.getId(), c.getName()))
                .toList();
    }
}