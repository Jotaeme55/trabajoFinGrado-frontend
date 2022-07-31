import axios from 'axios';

export default class UserService {

    getUsers() {
        return axios.get('/users')
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    saveUser(user) {
        return axios.post('/users/', user);
    }
    
    getSuscripcion(userId){
        return axios.get(`/users/suscripcion/${userId}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    getUser(username){
        return axios.get(`/users/${username}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    guardar(user){
        return axios.post(`auth/register/`,user)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    actualizar(userId,user){
        return axios.put(`users/${userId}`,user)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    deleteUser(userID){
        return axios.delete(`/users/${userID}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

}