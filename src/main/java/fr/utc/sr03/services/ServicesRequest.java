package fr.utc.sr03.services;


import fr.utc.sr03.model.Users;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;
import fr.utc.sr03.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.List;

@Repository
@Transactional
public class ServicesRequest {

    @PersistenceContext
    EntityManager em;

    @Autowired
    private UsersRepository usersRepository;

    // Recherche par nom ou prénom
    public Page<Users> searchUsers(String search, int page, int size) {
        // PageRequest pour la pagination
        PageRequest pageRequest = PageRequest.of(page, size);

        // Requête personnalisée pour rechercher le prénom ou le nom
        return usersRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(search, search, pageRequest);
    }

    // Recherche de tous les utilisateurs avec pagination (sans critère de recherche)
    public Page<Users> getUsers(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return usersRepository.findAll(pageRequest);
    }

    // Pour obtenir le nombre total de pages pour la pagination sans recherche
    public int getTotalPages(int size) {
        long totalUsers = usersRepository.count();
        return (int) Math.ceil((double) totalUsers / size);
    }

    // Pour obtenir le nombre total de pages pour la recherche avec critère
    public int getTotalPagesForSearch(String search, int size) {
        long totalUsers = usersRepository.countByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(search, search);
        return (int) Math.ceil((double) totalUsers / size);
    }

    public void addUser(Users user){
        em.persist(user);
    }

    public void updateUser(Users user){
        em.merge(user);
    }

    public Users getOneUser(int id){
        //return un user via la clé primaire
        return em.find(Users.class, id);
    }

    public void deleteOneUser(int id){
        //return un user via la clé primaire
        em.remove(em.find(Users.class, id));
    }

    @SuppressWarnings("unchecked")
    public List<Users> getUsers(){
        Query q = em.createQuery("select u from Users u");
        return q.getResultList();
    }

    public void deleteFirstUser() {
        Users firstUser = em.createQuery("SELECT u FROM Users u ORDER BY u.id ASC", Users.class)
                .setMaxResults(1)
                .getSingleResult();

        if (firstUser != null) {
            em.remove(firstUser);
        }
    }





}
