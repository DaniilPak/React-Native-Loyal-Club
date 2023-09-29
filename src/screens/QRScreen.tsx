import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getArrayFromLocalStorage } from '../utils/async';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import ShrinkableContainer from '../components/ShrinkableContainer';
import { getBusinessInfoByBid, getLastUsedLoyaltyCard } from '../utils/api';
import LoyaltyCard from '../components/LoyaltyCard';
import HalfScreenButtons from '../components/HalfScreenButton';
import HalfScreenButtonsContainer from '../components/HalfScreenButtonsContainer';

interface QRScreenProps {
  navigation: any;
}

function QRScreen({ navigation }: QRScreenProps) {
  const [qr, setQr] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userData, setUserData] = useState([]);

  /// Last used loyalty card states
  const [selectedLvl, setSelectedLvl] = useState([]);
  const [bonusAmountWithCurrency, setBonusAmountWithCurrency] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [nextLevelName, setNextLevelName] = useState('');
  const [progressStat, setProgressStat] = useState('');
  const [progressVal, setProgressVal] = useState(0);

  const [loyaltyCardIsLoaded, setLoyaltyCardIsLoaded] = useState(false);

  const myLoyaltyCards = 'Мои карты лояльности';
  const myAbonnements = 'Мои абонементы';

  useEffect(() => {
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

        /// Get last used loyalty card
        const lastUsedLoyaltyCard = await getLastUsedLoyaltyCard(userData._id);

        if (!lastUsedLoyaltyCard) {
          return;
        }

        const lastUsedLoyaltyCardBusinessData = await getBusinessInfoByBid(lastUsedLoyaltyCard.business);

        const bonusAmountWithCurrency = `${lastUsedLoyaltyCard.bonusAmount} ${lastUsedLoyaltyCardBusinessData.currencySign}`;
        const businessLoyaltyLvls = lastUsedLoyaltyCardBusinessData.loyaltyLevels;
        const currentLoyaltyLvl = lastUsedLoyaltyCard.loyaltyCardLevel;

        const selectedLvl = businessLoyaltyLvls.find((level: any) => level.name === currentLoyaltyLvl);
        const currentLoyaltyLevelIndex = businessLoyaltyLvls.findIndex(
          (level: any) => level.name === currentLoyaltyLvl
        );

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
        setPictureUrl(lastUsedLoyaltyCardBusinessData.pictureUrl);
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

    fetchData();
  }, []);

  const showMyLoyaltyCards = () => {
    navigation.navigate('MyLoyaltyCards');
  };

  const showMyAbonnements = () => {
    navigation.navigate('UserAbonnements');
  };

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
                <Text style={styles.greeting}>
                  {greeting}, {userData.name}!
                </Text>
              </View>
            )}
          </View>
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
          <LoyaltyCard
            businessName={`${selectedLvl.name} ${selectedLvl.percent}%`}
            bonusAmount={bonusAmountWithCurrency}
            pictureUrl={pictureUrl}
            prevLvl={`${selectedLvl.name}`}
            nextLvl={nextLevelName}
            progressStat={progressStat}
            progressVal={progressVal}
          />
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
    elevation: 100,
  },
  lowerContainer: {
    flex: 1,
    width: '100%',
  },
});

export default QRScreen;
