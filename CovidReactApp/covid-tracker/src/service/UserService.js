import axios from 'axios'

const API_URL = "http://localhost:8080";

class UserService{
    
    getUsers(){
        return axios.get(API_URL + "/showAllUsers");
    }
    getUserByID(email){
        return axios.get(API_URL + email);
    }
    createUser(body){
        axios.post(API_URL + "/newUser", body);
    }
    deleteUser(email){
        axios.delete(API_URL + "/deleteUser/" + email);
    }
    updateUser(email, body){
        axios.post(API_URL + "/" + email, body);
    }
}

export default new UserService()