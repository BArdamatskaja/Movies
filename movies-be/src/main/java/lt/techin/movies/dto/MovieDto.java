package lt.techin.movies.dto;

public record MovieDto(
        Long id,
        String title,
        String description,
        String cover,
        Long categoryId,
        String categoryName,
        Double IMBD
) {
}
