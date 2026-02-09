package lt.techin.movies.dto;

public record MovieAddRequest (
        String title,
        String description,
        Double IMBD,
        String cover,
        Long categoryId
) {

}
