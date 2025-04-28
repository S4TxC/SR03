package fr.utc.sr03.services;


import fr.utc.sr03.model.User;
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

    public void addUser(User user){
        em.persist(user);
    }

    public void updateUser(User user){
        em.merge(user);
    }

    public User getOneUser(int id){
        //return un user via la clé primaire
        return em.find(User.class, id);
    }

    public void deleteOneUser(int id){
        //return un user via la clé primaire
        em.remove(em.find(User.class, id));
    }

    @SuppressWarnings("unchecked")
    public List<User> getUsers(){
        Query q = em.createQuery("select u from User u");
        return q.getResultList();
    }





}
