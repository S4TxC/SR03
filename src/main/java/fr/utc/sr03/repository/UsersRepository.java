package fr.utc.sr03.repository;

import fr.utc.sr03.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByEmail(String email);
    Page<Users> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
            String firstname, String lastname, Pageable pageable);

    Page<Users> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    long countByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(String firstname, String lastname);
}
