import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import ShrinkableContainer from '../components/ShrinkableContainer';
import {
  getBusinessInfoByBid,
  getCurrentUserIdAsync,
  getLastUsedLoyaltyCard,
  getRewardedActionsByUserId,
} from '../utils/api';
import LoyaltyCard from '../components/LoyaltyCard';
import HalfScreenButtons from '../components/HalfScreenButton';
import HalfScreenButtonsContainer from '../components/HalfScreenButtonsContainer';
import Octicons from 'react-native-vector-icons/Octicons';
import { BadgeContext } from '../contexts/BadgeContext';
import SocialButton from '../components/SocialButton';
Octicons.loadFont();

interface QRScreenProps {
  navigation: any;
}

function QRScreen({ navigation }: QRScreenProps) {
  const [qr, setQr] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userData, setUserData] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [latestBusiness, setLatestBusiness] = useState();

  /// Context stuff
  const { updateTrigger } = useContext(BadgeContext);

  /// Last used loyalty card states
  const [selectedLvl, setSelectedLvl] = useState([]);
  const [bonusAmountWithCurrency, setBonusAmountWithCurrency] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [nextLevelName, setNextLevelName] = useState('');
  const [progressStat, setProgressStat] = useState('');
  const [progressVal, setProgressVal] = useState(0);
  const [isRewardedActionsExist, setIsRewardedActionsExist] = useState(false);

  const [loyaltyCardIsLoaded, setLoyaltyCardIsLoaded] = useState(false);

  const myLoyaltyCards = 'Карты лояльности';
  const myAbonnements = 'Сертификаты и абонементы';
  const rewardedBonusesTitle = 'Получить бонусы';
  const voucherApplyTitle = 'Ввести промокод';

  useEffect(() => {
    fetchData();
    // Redirect if reward actions exist
    getRewardedActions();
  }, [updateTrigger]); // This will now only execute when updateTrigger changes

  const linkOnPress = (url: string) => {
    Linking.openURL(url);
  };

  async function fetchData() {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      const userData = asyncdata.userData;

      if (!userData) {
        return;
      }

      Con.DEBUG && console.log('My userId', userData._id);
      setQr(userData._id);
      setUserData(userData);

      setCurrentGreeting();

      /// Get rewarded actions
      const fetchedRewardedActions = await getRewardedActionsByUserId(userData._id);
      const isExistFlag = fetchedRewardedActions.length > 0 ? true : false;
      setIsRewardedActionsExist(isExistFlag);

      /// Get last used loyalty card
      const lastUsedLoyaltyCard = await getLastUsedLoyaltyCard(userData._id);

      if (!lastUsedLoyaltyCard) {
        return;
      }

      const lastUsedLoyaltyCardBusinessData = await getBusinessInfoByBid(lastUsedLoyaltyCard.business);

      setLatestBusiness(lastUsedLoyaltyCardBusinessData);
      setBusinessName(lastUsedLoyaltyCardBusinessData.name);

      const bonusAmountWithCurrency = `${lastUsedLoyaltyCard.bonusAmount} ${lastUsedLoyaltyCardBusinessData.currencySign}`;
      const businessLoyaltyLvls = lastUsedLoyaltyCardBusinessData.loyaltyLevels;
      const currentLoyaltyLvl = lastUsedLoyaltyCard.loyaltyCardLevel;

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
      const totalSpent = lastUsedLoyaltyCard.totalSpent;
      const progressVal = totalSpent / nextLevelMinSpending;

      /// Assigning states
      setSelectedLvl(selectedLvl);
      setBonusAmountWithCurrency(bonusAmountWithCurrency);
      // Set picture considering loyalty level
      switch (currentLoyaltyLvl) {
        case 'Bronze':
          setPictureUrl(lastUsedLoyaltyCardBusinessData.bronzeCardUrl);
          break;
        case 'Silver':
          setPictureUrl(lastUsedLoyaltyCardBusinessData.silverCardUrl);
          break;
        case 'Gold':
          setPictureUrl(lastUsedLoyaltyCardBusinessData.goldCardUrl);
          break;
        case 'Platinum':
          setPictureUrl(lastUsedLoyaltyCardBusinessData.platinumCardUrl);
          break;
        default:
          // Handle any other cases or provide a default picture
          setPictureUrl(lastUsedLoyaltyCardBusinessData.bronzeCardUrl);
          break;
      }

      // End setting loyalty card background pic
      setNextLevelName(nextLevelName);
      setProgressStat(
        `${totalSpent} ${lastUsedLoyaltyCardBusinessData.currencySign} / ${nextLevelMinSpending} ${lastUsedLoyaltyCardBusinessData.currencySign}`
      );
      setProgressVal(progressVal);

      /// LC is loaded
      setLoyaltyCardIsLoaded(true);
    } catch (err) {
      Con.DEBUG && console.log(err);
    }
  }

  async function getRewardedActions() {
    const userId = await getCurrentUserIdAsync();
    const rewardedActions = await getRewardedActionsByUserId(userId);
    const isRewardedActionsExist = rewardedActions.length > 0 ? true : false;

    if (isRewardedActionsExist) {
      navigation.navigate('RewardedActions');
    }
  }

  function setCurrentGreeting() {
    const currentHour = new Date().getHours();
    let greeting = 'Добрый вечер';

    if (currentHour < 12) {
      greeting = 'Доброе утро';
    } else if (currentHour < 18) {
      greeting = 'Добрый день';
    }

    setGreeting(greeting);
  }

  const showMyLoyaltyCards = () => {
    navigation.navigate('MyLoyaltyCards');
  };

  const showMyAbonnements = () => {
    navigation.navigate('UserAbonnements');
  };

  const redDotSize = 25;

  const redDot = <Octicons name="dot-fill" size={redDotSize} color={Con.AppleRedLight} />;

  /// 0.9 is width of the qr card
  /// 0.6293 is CR80 proportion
  /// 0.9 is height of CR80
  const qrSize = Con.width * 0.9 * 0.6293 * 0.85;

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 25,
      }}
    >
      {qr && (
        <View>
          <View style={styles.labelContainer}>
            {userData && (
              <View style={{ flexDirection: 'row' }}>
                <Text variant="headlineMedium">
                  {greeting}, {userData.name}!
                </Text>
              </View>
            )}
          </View>
          {/* Rewarded actions */}
          <ShrinkableContainer
            onPress={() => {
              navigation.navigate('RewardedActions');
            }}
          >
            {/* Only show if user has proposals */}
            {isRewardedActionsExist && (
              <View style={styles.rewardedActionsContainer}>
                <Text style={styles.buttonText}>{rewardedBonusesTitle}</Text>
                {redDot}
              </View>
            )}
          </ShrinkableContainer>
          {/* Rewarded actions end*/}
          {/* Vouchers */}
          <ShrinkableContainer
            onPress={() => {
              navigation.navigate('ApplyVoucher');
            }}
          >
            <View style={styles.rewardedActionsContainer}>
              <Text style={styles.buttonText}>{voucherApplyTitle}</Text>
            </View>
          </ShrinkableContainer>
          {/* Vouchers end*/}
          <ShrinkableContainer>
            <View style={styles.mainContainer}>
              <QRCode value={qr} size={qrSize} color="black" backgroundColor="white" />
            </View>
          </ShrinkableContainer>
        </View>
      )}
      <View style={styles.lowerContainer}>
        <HalfScreenButtonsContainer>
          <HalfScreenButtons title={myLoyaltyCards} onPress={showMyLoyaltyCards} />
          <HalfScreenButtons title={myAbonnements} onPress={showMyAbonnements} />
        </HalfScreenButtonsContainer>

        {/* Last used loyalty card */}
        {loyaltyCardIsLoaded && (
          <View>
            <View style={styles.labelContainer}>
              <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                <Text variant="headlineMedium">{businessName}</Text>
              </View>
            </View>
            <LoyaltyCard
              businessName={`${selectedLvl.name} ${selectedLvl.percent}%`}
              bonusAmount={bonusAmountWithCurrency}
              pictureUrl={pictureUrl}
              prevLvl={`${selectedLvl.name}`}
              nextLvl={nextLevelName}
              progressStat={progressStat}
              progressVal={progressVal}
            />
            {latestBusiness && latestBusiness.socialButtons && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', paddingLeft: 5, paddingRight: 5 }}>
                {latestBusiness.socialButtons.map((button: any) => (
                  <SocialButton
                    title={button.name}
                    onPress={() => {
                      linkOnPress(button.link);
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    color: '#333',
    fontSize: 25,
    fontWeight: '800',
    marginVertical: 10,
  },
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    width: Con.width * 0.9,
    height: Con.width * 0.9 * 0.6293,
    backgroundColor: 'white',
    borderRadius: Con.universalBorderRadius,

    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.01,
    shadowRadius: 1,
    elevation: 20,
  },
  lowerContainer: {
    flex: 1,
    width: '100%',
  },
  rewardedActionsContainer: {
    marginBottom: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: Con.width * 0.9,
    height: Con.width * 0.9 * 0.18,
    backgroundColor: 'white',
    borderRadius: Con.universalBorderRadius,

    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.01,
    shadowRadius: 1,
    elevation: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    padding: 20,
  },
});

export default QRScreen;
