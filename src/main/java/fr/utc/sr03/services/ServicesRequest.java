package fr.utc.sr03.services;


import fr.utc.sr03.model.Users;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

import java.util.List;

@Repository
@Transactional
public class ServicesRequest {

    @PersistenceContext
    EntityManager em;

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
