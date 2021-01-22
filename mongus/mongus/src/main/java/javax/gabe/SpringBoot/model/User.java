package javax.gabe.SpringBoot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter 
@Setter

@ToString

@Document(collection="User")
public class User 
{  
    @Id
    private String email;
    private String password;
    private String name;
    private String state;
    private String county;
    private String preferences;
    private int prevCountyCases;
    private int prevStateCases;
}
