package lt.techin.movies.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ManyToOne(optional=false)
    private Movie movie;

    @Column(nullable=false)
    private Integer rating;

    @Column(nullable=false, length=2000)
    private String comment;

    @Column(nullable=false)
    private LocalDate createdAt;
}
