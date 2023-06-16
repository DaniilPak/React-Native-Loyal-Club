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

export async function getBusinessInfoByBid(_bid: string): Promise<any> {

    try {
        const requestData = {
            "businessId": _bid,
        };

        const response = await axios.post(`${Con.api}/business/getbusinessbyid`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }

}

export async function addPayment(
    purchaseAmount: number,
    card: string,
    clientId: string,
    workerId: string,
    bonusAmount: number,
    minusBonus: number): Promise<any> {

    try {
        const requestData = {
            "purchaseAmount": purchaseAmount,
            "card": card,
            "clientId": clientId,
            "workerId": workerId,
            "bonusAmount": bonusAmount,
            "minusBonus": minusBonus,
        };

        const response = await axios.post(`${Con.api}/receipt`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function getOrCreateLoyaltyCardByClientIdAndBusinessId(cliendId: string, businessId: string) {
    try {
        const requestData = {
            "cliendId": cliendId,
            "businessId": businessId,
        };

        const response = await axios.post(`${Con.api}/loyaltycard/getorcreatecard`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function getDetailedReceipt(receiptId: string) {
    try {
        const requestData = {
            "receiptId": receiptId,
        };

        const response = await axios.post(`${Con.api}/receipt/getdetailedreceipt`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}