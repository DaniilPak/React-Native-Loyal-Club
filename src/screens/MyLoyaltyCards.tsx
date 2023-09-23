import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Con from '../constants';
import TextBlockV2 from '../components/TextBlockV2';
import { getArrayFromLocalStorage } from '../utils/async';
import { getBusinessInfoByBid, getLoyaltyCardDetails, getUserById } from '../utils/api';
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

      /// Getting business data to get loyalty percent and show
      /// to user
      for (const lc of tempLoyaltyCards) {
        const businessData = await getBusinessInfoByBid(lc.business);
        lc.businessData = businessData;
      }

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

  const renderItem = ({ item }: any) => {
    const bonusAmountWithCurrency = `${item.bonusAmount} ${item.currencySign}`;
    const businessLoyaltyLvls = item.businessData.loyaltyLevels;
    const currentLoyaltyLvl = item.loyaltyCardLevel;

    const selectedLvl = businessLoyaltyLvls.find((level: any) => level.name === currentLoyaltyLvl);
    const currentLoyaltyLevelIndex = businessLoyaltyLvls.findIndex((level: any) => level.name === currentLoyaltyLvl);

    let nextLevelName = 'Max';
    let nextLevelMinSpending = 0;

    if (currentLoyaltyLevelIndex !== -1 && currentLoyaltyLevelIndex < businessLoyaltyLvls.length - 1) {
      const nextLevel = businessLoyaltyLvls[currentLoyaltyLevelIndex + 1];
      nextLevelName = nextLevel.name;
      nextLevelMinSpending = nextLevel.minSpending;
    } else {
      console.log('No next level');
    }

    /// Total spend calculate
    const totalSpent = item.totalSpent;
    const progressVal = totalSpent / nextLevelMinSpending;

    return (
      <LoyaltyCard
        businessName={`${selectedLvl.name} ${selectedLvl.percent}%`}
        bonusAmount={bonusAmountWithCurrency}
        pictureUrl={item.businessData.pictureUrl}
        prevLvl={`${selectedLvl.name}`}
        nextLvl={`${nextLevelName}`}
        progressStat={`${totalSpent} ${item.currencySign} / ${nextLevelMinSpending} ${item.currencySign}`}
        progressVal={progressVal}
      />
    );
  };

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
