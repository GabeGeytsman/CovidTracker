import React from 'react';
import UserService from '../service/UserService';

class UserComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            users:[]
        }
    }

    componentDidMount(){
        UserService.getUsers().then((response) => {
            this.setState({users : response.data})
            console.log("done");
        })
    }

    render (){
        return (
            <div>
                <h1 className = "text-center"> Users List</h1>
                <table className = "table table-striped">
                    <thead>
                        <tr>

                            <td> User Id</td>
                            <td> User First Name</td>
                            <td> User Last Name</td>
                            <td> User Email Id</td>
                        </tr>

                    </thead>
                    <tbody>
                        {
                            this.state.users.map(
                                user => 
                                <tr key = {user.email}>
                                     <td> {user.email}</td>   
                                     <td> {user.name}</td>   
                                     <td> {user.state}</td>   
                                     <td> {user.county}</td>   
                                </tr>
                            )
                        }

                    </tbody>
                </table>

            </div>

        )
    }

}

export default UserComponent