package javax.gabe.mongus;

import java.util.List;

import javax.gabe.mongus.model.User;
import javax.gabe.mongus.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class MongusApplicationTests {

	@Autowired
	private UserRepository user;

	@Test
	void testQuery() {

		List<User> list = user.findUserByStateAndCounty("New Jersey", "Passaic");
		for(User u : list)
		{
			System.out.println(u.getEmail());
		}
	}

}
