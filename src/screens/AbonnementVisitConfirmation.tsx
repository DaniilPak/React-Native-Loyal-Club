import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import GrayButton from '../components/GrayButton';
import {
  createVisit,
  getAbonnementById,
  getAbonnementsByUserIdAndBusinessId,
  getBusinessInfoByBid,
  getUserById,
  makeAnnouncement,
} from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';
import NavigationRow from '../components/NavigationRow';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
import Loading from './Loading';
import TextBlock from '../components/TextBlock';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextBlockV2 from '../components/TextBlockV2';
Ionicons.loadFont();
import { Text } from 'react-native-paper';
import NavigationRowExtended from '../components/NavigationRowExtended';
import { TextInputMask } from 'react-native-masked-text';
import { formatToClassicDateStyle } from '../utils/helper';

interface AbonnementVisitConfirmationProps {
  navigation: any;
  route: any;
}

function AbonnementVisitConfirmation({ route, navigation }: AbonnementVisitConfirmationProps) {
  const { abonnementId, clientId } = route.params;

  const confirmVisitButtonTitle = 'Подтвердить визит';

  const [client, setClient] = useState([]);
  const [asyncdata, setAsyncdata] = useState([]);
  const [abonnementDetails, setAbonnementDetails] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  /// Form state
  const [abonnementValue, setAbonnementValue] = useState(0);

  const iconSize = 25;
  const iconColor = Con.AppleBlueLight;
  const personIcon = <Ionicons name="person-circle-outline" size={iconSize} color={iconColor} />;

  /// Methods
  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      setAsyncdata(asyncdata);

      /// Get clients info
      const user = await getUserById(clientId);
      setClient(user);

      /// Get abonnement info
      const abonnement = await getAbonnementById(abonnementId);
      console.log('abonnement: ', abonnement);
      setAbonnementDetails(abonnement);
    } catch (err) {
      Con.DEBUG && console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  enum abonnementErrorTypes {
    abonnementValueException = 'Введите количество единиц',
    abonnementInputIsBiggerThanAbonnementValue = 'Введенная единица больше чем есть на балансе абонемента',
  }

  const validateForm = (abonnementValue: number) => {
    const errors: any[] = [];

    if (abonnementValue === 0) {
      errors.push(abonnementErrorTypes.abonnementValueException);
    }

    if (abonnementValue > abonnementDetails.value) {
      errors.push(abonnementErrorTypes.abonnementInputIsBiggerThanAbonnementValue);
    }

    return errors;
  };

  const confirmVisit = async () => {
    // Validate visit form
    const errors = validateForm(abonnementValue);

    if (errors.length > 0) {
      showMessage({
        message: 'Ошибка',
        description: errors[0],
        type: 'warning',
      });

      return;
    }

    /// If all is ok

    // Button management
    setButtonDisabled(true);
    setButtonIsLoading(true);

    await createVisit(abonnementId, abonnementValue)
      .then((receiptResponse) => {
        console.log('Response from creating visit', receiptResponse);

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SuccessVisitCreation',
              params: {
                receiptResponse: receiptResponse,
              },
            },
          ],
        });
      })
      .catch((err) => {
        Con.DEBUG && console.log('Error with creating visit', err);
      });
  };

  const handleAbonnementValueChange = (value: string) => {
    /// If text is not empty enable button and hide dim
    if (value.trim() !== '') {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }

    setAbonnementValue(parseInt(value));
  };

  useEffect(() => {
    console.log(abonnementId, '999');

    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView style={{ marginBottom: 15, flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <TextBlock text={`Клиент: ${client.name} ${client.surname}`} icon={personIcon}></TextBlock>

              {/* Cost of the Abonnement */}
              <View style={styles.inputContainer}>
                <Text style={styles.tipText}>{`Вычесть ${abonnementDetails.currency}`}</Text>
                <TextInputMask
                  type="custom"
                  options={{
                    mask: '999999999', // Customize the mask pattern for days (you can adjust it)
                  }}
                  value={abonnementValue.toString()} // Assuming costOfAbonnement is a number
                  onChangeText={handleAbonnementValueChange}
                  keyboardType="numeric"
                  placeholder={`0 ${abonnementDetails.currency}`}
                  placeholderTextColor={'gray'}
                  style={styles.input}
                />

                {/* Info about abonnement */}
                <View style={{ marginTop: 25 }}>
                  <TextBlockV2 text={`Название: ${abonnementDetails.name}`} />
                  <TextBlockV2
                    text={`Осталось: ${abonnementDetails.value}/${abonnementDetails.totalValue} ${abonnementDetails.currency}`}
                  />
                  <TextBlockV2 text={`Начало: ${formatToClassicDateStyle(abonnementDetails.startDate)}`} />
                  <TextBlockV2 text={`Конец: ${formatToClassicDateStyle(abonnementDetails.endDate)}`} />
                </View>
              </View>

              <BlueButton
                title={`${confirmVisitButtonTitle} ${abonnementValue} ${abonnementDetails.currency}`}
                onPress={confirmVisit}
                isLoading={buttonIsLoading}
                isDisabled={buttonDisabled}
                isShadowDisabled={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  } else {
    return <Loading />;
  }
}

const styles = StyleSheet.create({
  keyboardAvoidingViewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scrollViewStyle: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    textAlign: 'center',
    color: 'black',
    fontSize: 30,
  },
  tipText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 15,
    padding: 10,
  },
});

export default AbonnementVisitConfirmation;
