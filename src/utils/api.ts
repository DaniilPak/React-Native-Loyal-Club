import axios from 'axios';
import Con from '../constants';
import { getItemFromLocalStorage, saveArrayToLocalStorage } from './async';

export async function makeAuth(phone: string, password: string): Promise<any> {

    const requestData = {
        "phoneNumber": '+7 (000) 000-00-00',
        "password": 'password',
    };

    try {
        const response = await axios.post(`${Con.api}/auth`, requestData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }

}

export async function updateAuth(): Promise<any> {

    try {
        const phone = await getItemFromLocalStorage(Con.PHONE_ASYNC_KEY);
        const password = await getItemFromLocalStorage(Con.PASSWORD_ASYNC_KEY);

        console.log("Update auth with: ", phone, password);

        const requestData = {
            "phoneNumber": phone,
            "password": password,
        };

        const response = await axios.post(`${Con.api}/auth`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }

}


export async function getLoyaltyCardDetails(_loyaltyCardId: string): Promise<any> {

    try {
        const requestData = {
            "loyaltyCardId": _loyaltyCardId,
        };

        const response = await axios.post(`${Con.api}/loyaltycard/getloyaltycardbyid`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }

}