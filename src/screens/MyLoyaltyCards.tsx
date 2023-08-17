import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Con from '../constants';
import TextBlockV2 from '../components/TextBlockV2';
import { getArrayFromLocalStorage } from '../utils/async';
import { getLoyaltyCardDetails, getUserById } from '../utils/api';
import LoyaltyCard from '../components/LoyaltyCard';

interface MyLoyaltyCardsScreenProps {
  navigation: any;
  route: any;
}

function MyLoyaltyCards({ route }: MyLoyaltyCardsScreenProps) {
  const [userData, setUserData] = useState([]);
  const [loyaltyCards, setLoyaltyCards] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    try {
      setIsRefreshing(true);
      // Indicate that loading started
      setIsLoading(true);
      initFunc();
    } catch {
      Con.DEBUG && console.log('Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      const user = await getUserById(asyncdata.userData._id);
      Con.DEBUG && console.log('User got: ', user);

      setUserData(asyncdata.userData);
      const apiLoyaltyCards = user.loyaltyCards;

      const loyaltyCardPromises = apiLoyaltyCards.map((loyaltyCardId) => getLoyaltyCardDetails(loyaltyCardId));

      const tempLoyaltyCards = await Promise.all(loyaltyCardPromises);
      Con.DEBUG && console.log('++++++++', tempLoyaltyCards);

      // Sorting the array alphabetically
      tempLoyaltyCards.sort((a, b) => {
        const nameA = a.businessName.toUpperCase();
        const nameB = b.businessName.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      setLoyaltyCards(tempLoyaltyCards);
    } catch (err) {
      Con.DEBUG && console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initFunc();
  }, []);

  const renderItem = ({ item }: any) => (
    // <TextBlockV2 text={`${item.businessName} bonus: ${item.bonusAmount} ${item.currencySign}`} />
    <LoyaltyCard businessName={item.businessName} bonusAmount={`${item.bonusAmount} ${item.currencySign}`} />
  );

  return (
    <View style={{ flex: 1 }}>
      {!isLoading && (
        <FlatList
          data={loyaltyCards}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
      {isLoading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Con.AppleBlueLight} />
        </View>
      )}
    </View>
  );
}

export default MyLoyaltyCards;
