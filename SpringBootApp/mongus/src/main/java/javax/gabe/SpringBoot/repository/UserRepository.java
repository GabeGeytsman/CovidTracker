package javax.gabe.SpringBoot.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

import javax.gabe.SpringBoot.model.*;

public interface UserRepository extends MongoRepository<User, String>{
    

    @Query("SELECT u FROM User u WHERE u.state = ?1 and u.county = ?2")
    public List<User> findUserByStateAndCounty(String state, String county);
}
