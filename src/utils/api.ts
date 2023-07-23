import axios from 'axios';
import Con from '../constants';
import { getItemFromLocalStorage, saveArrayToLocalStorage } from './async';

export async function makeAuth(phone: string, password: string): Promise<any> {

    const requestData = {
        "phoneNumber": phone,
        "password": password,
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
    jwtToken: string,
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

        const headers = {
            Authorization: jwtToken, // Replace "your_access_token" with your actual token
        };

        const config = {
            headers: headers,
        };

        const response = await axios.post(`${Con.api}/receipt`, requestData, config);
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

export async function getWorkersByBid(businessId: string) {
    try {
        const requestData = {
            "businessId": businessId,
        };

        const response = await axios.post(`${Con.api}/business/getbusinesswithworkers`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function deleteWorkerFromBusiness(workerId: string, businessId: string, jwtToken: string) {
    try {
        const requestData = {
            "workerId": workerId,
            "businessId": businessId,
        };

        const headers = {
            Authorization: jwtToken, // Replace "your_access_token" with your actual token
        };

        const config = {
            headers: headers,
        };

        const response = await axios.post(`${Con.api}/business/workerdelete`, requestData, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function addWorkerFromBusiness(workerId: string, businessId: string, jwtToken: string) {
    try {
        const requestData = {
            "workerId": workerId,
            "businessId": businessId,
        };

        const headers = {
            Authorization: jwtToken, // Replace "your_access_token" with your actual token
        };

        const config = {
            headers: headers,
        };

        const response = await axios.post(`${Con.api}/business/workeradd`, requestData, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function getUserById(userId: string) {
    try {
        const requestData = {
            "userId": userId,
        };

        const response = await axios.post(`${Con.api}/user/getuserbyid`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function getUserByPhoneNumber(phoneNumber: string) {
    try {
        const requestData = {
            "phoneNumber": phoneNumber,
        };

        const response = await axios.post(`${Con.api}/user/getuserbyphone`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function createNewUser(phoneNumber: string, name: string, surname: string, password: string) {
    try {
        const requestData = {
            "type": "Client",
            "email": "email",
            "homeAddress": "homeAddress",
            "paymentInfo": "paymentInfo",
            "workBusiness": "",

            "phoneNumber": phoneNumber,
            "name": name,
            "surname": surname,
            "password": password,
        };

        const response = await axios.post(`${Con.api}/user`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function deleteAccountForever(userId: string, jwtToken: string) {
    try {
        const requestData = {
            "userId": userId,
        };

        const headers = {
            Authorization: jwtToken, // Replace "your_access_token" with your actual token
        };

        const config = {
            headers: headers,
        };

        const response = await axios.post(`${Con.api}/user/calluser`, requestData, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}

export async function setFcmToken(userId: string, fcmToken?: string) {
    try {
        const requestData = {
            "userId": userId,
            "fcmToken": fcmToken,
        };

        const response = await axios.post(`${Con.api}/user/setfcmtoken`, requestData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // You can choose to handle the error here or propagate it
    }
}