package javax.gabe.SpringBoot.resource;

import java.util.List;
import java.util.Optional;

import javax.gabe.SpringBoot.model.*;
import javax.gabe.SpringBoot.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {
    
    @Autowired
    private UserRepository repo;

    @PostMapping("/newUser")
    public String newUser(@RequestBody User user)
    {
        repo.save(user);
        return "Added new user with email: " + user.getEmail();
    }

    @PostMapping("/updateUser/{email}")
    public String updateUser(@PathVariable String email, @RequestBody User userUpdate)
    {
        Optional<User> u = repo.findById(email);
        if(u.isPresent())
        {
            User user = u.get();
            user.setEmail(userUpdate.getEmail());
            user.setPassword(userUpdate.getPassword());
            user.setName(userUpdate.getName());
            user.setState(userUpdate.getState());
            user.setCounty(userUpdate.getCounty());
            user.setPreferences(userUpdate.getPreferences());
            user.setPrevCountyCases(userUpdate.getPrevCountyCases());
            user.setPrevStateCases(userUpdate.getPrevStateCases());
            return "Updated user with email: " + email;
        }
        else
        {
            return "User not found with email: " + email;
        }
    }

    @GetMapping("/getUser/{email}")
    public Optional<User> getUser(@PathVariable String email)
    {
        return repo.findById(email);
    }

    @GetMapping("/showAllUsers")
    public List<User> showAllUsers()
    {
        return repo.findAll();
    }

    @DeleteMapping("/deleteAllUsers")
    public void deleteAllUsers()
    {
        repo.deleteAll();
    }

    @DeleteMapping("deleteUser/{email}")
    public String deleteUser(@PathVariable String email)
    {
        repo.deleteById(email);
        return "User no longer in database: " + email;
    }
}
