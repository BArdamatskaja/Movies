package lt.techin.movies.dto;

import jakarta.validation.constraints.*;

public record ReviewCreateRequest(
        @NotNull
        Long userId,

        @NotNull @Min(1) @Max(5)
        Integer rating,

        @NotBlank
        String comment
) {}
