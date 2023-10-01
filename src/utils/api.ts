import axios from 'axios';
import Con from '../constants';
import { getItemFromLocalStorage, saveArrayToLocalStorage } from './async';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { getLocalUserData } from './getLocalUserData';

export async function makeAuth(phone: string, password: string): Promise<any> {
  const requestData = {
    phoneNumber: phone,
    password: password,
  };

  try {
    const response = await axios.post(`${Con.api}/auth`, requestData);
    Con.DEBUG && console.log(response.data);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function updateAuth(): Promise<any> {
  try {
    const phone = await getItemFromLocalStorage(Con.PHONE_ASYNC_KEY);
    const password = await getItemFromLocalStorage(Con.PASSWORD_ASYNC_KEY);

    Con.DEBUG && console.log('Update auth with: ', phone, password);

    const requestData = {
      phoneNumber: phone,
      password: password,
    };

    const response = await axios.post(`${Con.api}/auth`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getLoyaltyCardDetails(_loyaltyCardId: string): Promise<any> {
  try {
    const requestData = {
      loyaltyCardId: _loyaltyCardId,
    };

    const response = await axios.post(`${Con.api}/loyaltycard/getloyaltycardbyid`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getLastUsedLoyaltyCard(userId: string): Promise<any> {
  try {
    const requestData = {
      userId: userId,
    };

    const response = await axios.post(`${Con.api}/loyaltycard/getlastusedloyaltycard`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getBusinessInfoByBid(_bid: string): Promise<any> {
  try {
    const requestData = {
      businessId: _bid,
    };

    const response = await axios.post(`${Con.api}/business/getbusinessbyid`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getBusinessReceiptsWithFilter(businessId: string, startdate: Date, enddate: Date): Promise<any> {
  try {
    const requestData = {
      businessId: businessId,
      startDate: startdate,
      endDate: enddate,
    };

    const response = await axios.post(`${Con.api}/business/getBusinessReceiptsWithFilter`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
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
  minusBonus: number,
  inputDigitMoneyValue: number
): Promise<any> {
  try {
    const requestData = {
      purchaseAmount: purchaseAmount,
      card: card,
      clientId: clientId,
      workerId: workerId,
      bonusAmount: bonusAmount,
      minusBonus: minusBonus,
      inputDigitMoneyValue: inputDigitMoneyValue,
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

export async function updateBusinessLoyaltyPercent(
  jwtToken: string,
  loyaltyPercent: number,
  businessId: string
): Promise<any> {
  try {
    const requestData = {
      loyaltyPercent: loyaltyPercent,
    };

    const headers = {
      businessId: businessId,
      Authorization: jwtToken, // Replace "your_access_token" with your actual token
    };

    const config = {
      headers: headers,
    };

    const response = await axios.post(`${Con.api}/business/updatebusinessloyaltypercent`, requestData, config);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getOrCreateLoyaltyCardByClientIdAndBusinessId(cliendId: string, businessId: string) {
  try {
    const requestData = {
      cliendId: cliendId,
      businessId: businessId,
    };

    const response = await axios.post(`${Con.api}/loyaltycard/getorcreatecard`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getDetailedReceipt(receiptId: string) {
  try {
    const requestData = {
      receiptId: receiptId,
    };

    const response = await axios.post(`${Con.api}/receipt/getdetailedreceipt`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getWorkersByBid(businessId: string) {
  try {
    const requestData = {
      businessId: businessId,
    };

    const response = await axios.post(`${Con.api}/business/getbusinesswithworkers`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function deleteWorkerFromBusiness(workerId: string, businessId: string, jwtToken: string) {
  try {
    const requestData = {
      workerId: workerId,
      businessId: businessId,
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
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function addWorkerFromBusiness(workerId: string, businessId: string, jwtToken: string) {
  try {
    const requestData = {
      workerId: workerId,
      businessId: businessId,
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
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getUserById(userId: string) {
  try {
    const requestData = {
      userId: userId,
    };

    const response = await axios.post(`${Con.api}/user/getuserbyid`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getUserByPhoneNumber(phoneNumber: string) {
  try {
    const requestData = {
      phoneNumber: phoneNumber,
    };

    const response = await axios.post(`${Con.api}/user/getuserbyphone`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function createNewUser(
  phoneNumber: string,
  name: string,
  surname: string,
  birthDate: Date,
  password: string
) {
  try {
    const requestData = {
      type: 'Client',
      email: 'email',
      homeAddress: 'homeAddress',
      paymentInfo: 'paymentInfo',
      workBusiness: '',

      phoneNumber: phoneNumber,
      name: name,
      surname: surname,
      birthDate: birthDate,
      password: password,
    };

    const response = await axios.post(`${Con.api}/user`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function deleteAccountForever(userId: string, jwtToken: string) {
  try {
    const requestData = {
      userId: userId,
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
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function setFcmToken(userId: string, fcmToken?: string) {
  try {
    const requestData = {
      userId: userId,
      fcmToken: fcmToken,
    };

    const response = await axios.post(`${Con.api}/user/setfcmtoken`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getBusinessClients(businessId: string) {
  try {
    const requestData = {
      businessId: businessId,
    };

    const response = await axios.post(`${Con.api}/business/clients`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function makeAnnouncement(jwtToken: string, businessId: string, announceBody: string) {
  try {
    const requestData = {
      businessId: businessId,
      announceBody: announceBody,
    };

    const headers = {
      Authorization: jwtToken, // Replace "your_access_token" with your actual token
    };

    const config = {
      headers: headers,
    };

    const response = await axios.post(`${Con.api}/business/announce`, requestData, config);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function removeFcmToken(userId: string) {
  try {
    const requestData = {
      userId: userId,
    };

    const response = await axios.post(`${Con.api}/user/removefcmtoken`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getUserRooms(userId: string) {
  try {
    const requestData = {
      userId: userId,
    };

    const response = await axios.post(`${Con.api}/chat/getuserrooms`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function createMessage(message: MessageType.Text) {
  try {
    const requestData = {
      message,
    };

    const response = await axios.post(`${Con.api}/chat/createmessage`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getRoomMessages(roomId: string) {
  try {
    const requestData = {
      roomId,
    };

    const response = await axios.post(`${Con.api}/chat/getroommessages`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getBusinessReceipts(businessId: string) {
  try {
    const requestData = {
      businessId,
    };

    const response = await axios.post(`${Con.api}/receipt/getbusinessreceipts`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function markUserRoomAsSeen(userId: string, roomId: string) {
  try {
    const requestData = {
      userId,
      roomId,
    };

    const response = await axios.post(`${Con.api}/chat/markuserroomasseen`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getCurrentUserIdAsync() {
  try {
    const asyncData = await getLocalUserData();

    return asyncData.userData._id;
  } catch (error) {
    // Handle errors
    console.error('Error getLocalDataAsync:', error);
  }
}

export async function getBadge() {
  console.log('Get badge called');
  const userId = await getCurrentUserIdAsync();
  const userRooms = await getUserRooms(userId);

  /// Get unseen user rooms
  const unseenData = userRooms.userRooms.filter((item: any) => !item.isSeen);

  return unseenData.length;
}

export async function createAbonnement(
  name: string,
  currency: string,
  price: number,
  value: number,
  startDate: Date,
  endDate: Date,
  cliendId: string,
  businessId: string,
  createdByUserId: string
) {
  try {
    const requestData = {
      name: name,
      currency: currency,
      price: price,
      value: value,
      totalValue: value,
      startDate: startDate,
      endDate: endDate,
      clientId: cliendId,
      businessId: businessId,
      createdByUserId: createdByUserId,
    };

    // const headers = {
    //   Authorization: jwtToken, // Replace "your_access_token" with your actual token
    // };

    // const config = {
    //   headers: headers,
    // };

    const response = await axios.post(`${Con.api}/abonnement/creation`, requestData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getAbonnementsByUserIdAndBusinessId(userId: string, businessId: string) {
  try {
    const requestData = {
      userId: userId,
      businessId: businessId,
    };

    const response = await axios.post(`${Con.api}/abonnement/getbyuseridandbusinessid`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getAbonnementById(abonnementId: string) {
  try {
    const requestData = {
      abonnementId: abonnementId,
    };

    const response = await axios.post(`${Con.api}/abonnement`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function createVisit(abonnementId: string, value: number) {
  try {
    const requestData = {
      abonnementId: abonnementId,
      value: value,
    };

    const response = await axios.post(`${Con.api}/abonnement/visits`, requestData);
    return response.data;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}
