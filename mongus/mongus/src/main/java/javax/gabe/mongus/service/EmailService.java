package javax.gabe.mongus.service;

import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Date;
import java.util.List;

import javax.gabe.mongus.model.User;
import javax.gabe.mongus.repository.UserRepository;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
public class EmailService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JavaMailSender sender;

    private static String DATA_URL_COUNTY = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv";
    private static String DATA_URL_STATE = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-states.csv";

    @Scheduled(cron = "0 0 10 * * *")
    //@Scheduled(fixedRate = 60000)
    public void generateUpdate() throws IOException, InterruptedException
    {
        //System.out.println("hi");
        HttpClient client1 = HttpClient.newHttpClient();
        HttpRequest request1 = HttpRequest.newBuilder().uri(URI.create(DATA_URL_COUNTY)).build();
        HttpResponse<String> httpResponse1 = client1.send(request1, HttpResponse.BodyHandlers.ofString());
        
        StringReader csvReader1 = new StringReader(httpResponse1.body());
        Iterable<CSVRecord> records1 = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(csvReader1);

        HttpClient client2 = HttpClient.newHttpClient();
        HttpRequest request2 = HttpRequest.newBuilder().uri(URI.create(DATA_URL_STATE)).build();
        HttpResponse<String> httpResponse2 = client2.send(request2, HttpResponse.BodyHandlers.ofString());
        
        StringReader csvReader2 = new StringReader(httpResponse2.body());
        Iterable<CSVRecord> records2 = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(csvReader2);
        
        List<User> list = repo.findAll();
        for(User user : list)
        {
            //makes sure weekly users only get updates on mondays
            if(user.getPreferences().equals("weekly"))
            {
                Date currentDate = new Date();
                if(!currentDate.toString().substring(0,3).equals("Mon"))
                {
                    continue;
                }
            }
            
            int totalCountyCases = 0, newCountyCases = 0;
            for(CSVRecord record : records1)
            {
                if(record.get("state").equalsIgnoreCase(user.getState()) && record.get("county").equalsIgnoreCase(user.getCounty()))
                {
                    System.out.println("county found!");
                    totalCountyCases = Integer.parseInt(record.get("cases"));
                    /*if(user.getPrevCountyCases()==-1)
                    {
                        user.setPrevCountyCases(totalCountyCases);
                        continue;
                    }*/
                    newCountyCases = totalCountyCases-user.getPrevCountyCases();
                    user.setPrevCountyCases(totalCountyCases);
                    repo.save(user);
                }
            }
            csvReader1 = new StringReader(httpResponse1.body());
            records1 = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(csvReader1);

            int totalStateCases = 0, newStateCases = 0;
            for(CSVRecord record : records2)
            {
                if(record.get("state").equalsIgnoreCase(user.getState()))
                {
                    totalStateCases = Integer.parseInt(record.get("cases"));
                    if(user.getPrevStateCases()==-1)
                    {
                        user.setPrevStateCases(totalStateCases);
                        repo.save(user);
                        continue;
                    }
                    newStateCases = totalStateCases-user.getPrevStateCases();
                    user.setPrevStateCases(totalStateCases);
                    repo.save(user);
                }
            }
            csvReader2 = new StringReader(httpResponse2.body());
            records2 = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(csvReader2);
            
            sendUpdate(newStateCases, totalStateCases, newCountyCases, totalCountyCases, user);

        }
    }

    public void sendUpdate(int newStateCases, int totalStateCases, int newCountyCases, int totalCountyCases, User user)
    {
        System.out.println("Total Cases in " + user.getState() + ": "  + totalStateCases + "\n");
        System.out.println("New Cases in " + user.getState() + ": "  + newStateCases + "\n");
        System.out.println("Total Cases in " + user.getCounty() + ": "  + totalCountyCases + "\n");
        System.out.println("New Cases in " + user.getCounty() + ": "  + newCountyCases + "\n");

        Date currentDate = new Date();

        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom("noreply.covidtracker@gmail.com");
        email.setTo(user.getEmail());
        email.setSubject("Coronavirus Update " + currentDate.toString().substring(0,10) + " 2021");
        String body = "Hello dear user " + user.getName() + ",\n\n";
        if(user.getPreferences().equals("weekly"))
        {
            body+="This week,";
        }
        else
        {
            body+="Today,";
        }
        body+=" in " + user.getState() + " there were " + newStateCases + " new cases, for a total of " + totalStateCases +" cases in your state all-time.\n\n";
        body+="In " + user.getCounty() + " county, there were " + newCountyCases + " new cases, for a total of " + totalCountyCases + " cases in your county all-time.\n\n";
        body+="Stay safe out there,\nThe Ultimate Coronavirus Tracker team";
        email.setText(body);
        sender.send(email);

    }
}
