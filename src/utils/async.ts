import AsyncStorage from '@react-native-async-storage/async-storage';
import Con from '../constants';

export async function saveArrayToLocalStorage(arrayToStore: any[], key: string) {
  // Convert the array to a string
  const arrayString = JSON.stringify(arrayToStore);

  try {
    await AsyncStorage.setItem(key, arrayString);
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getArrayFromLocalStorage(key: string) {
  try {
    const arrayString = await AsyncStorage.getItem(key);
    if (arrayString) {
      const retrievedArray = JSON.parse(arrayString);
      return retrievedArray;
    }
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function setItemToLocalStorage(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}

export async function getItemFromLocalStorage(key: string): Promise<string | null> {
  try {
    const item = await AsyncStorage.getItem(key);
    return item !== null ? item : null;
  } catch (error) {
    Con.DEBUG && console.error(error);
    throw error; // You can choose to handle the error here or propagate it
  }
}
