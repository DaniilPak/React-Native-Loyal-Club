import axios from 'axios';
import Con from '../constants';

export async function makeAuth(phone: string, password: string) {

    const requestData = {
        "phoneNumber": '77057773377',
        "password": 'password',
    };

    axios.post('http://localhost:3000/api/auth', requestData)
        .then(response => {
            // Handle the received data
            console.log(response.data);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });

}