package lt.techin.movies.repository;

import lt.techin.movies.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("""
  select m from Movie m
  left join fetch m.category
  where (:q is null or lower(m.title) like lower(concat('%', :q, '%')))
    and (:categoryId is null or m.category.id = :categoryId)
""")
    List<Movie> search(@Param("q") String q,
                       @Param("categoryId") Long categoryId);

    boolean existsByCategory_Id(Long id);
}

