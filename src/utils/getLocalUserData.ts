import Con from '../constants';
import { getArrayFromLocalStorage } from './async';

export async function getLocalUserData() {
  try {
    const asyncData = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
    return asyncData;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}
