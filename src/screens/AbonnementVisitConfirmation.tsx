import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Con from '../constants';
import BlueButton from '../components/BlueButton';
import { createVisit, getAbonnementById, getUserById } from '../utils/api';
import { getArrayFromLocalStorage } from '../utils/async';
import { showMessage } from 'react-native-flash-message';
import Loading from './Loading';
import TextBlock from '../components/TextBlock';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextBlockV2 from '../components/TextBlockV2';
Ionicons.loadFont();
import { Text } from 'react-native-paper';
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

  const [abonnementValue, setAbonnementValue] = useState(0);

  const iconSize = 25;
  const iconColor = Con.AppleBlueLight;
  const personIcon = <Ionicons name="person-circle-outline" size={iconSize} color={iconColor} />;

  const initFunc = async () => {
    try {
      const asyncdata = await getArrayFromLocalStorage(Con.API_AUTH_DATA_KEY);
      setAsyncdata(asyncdata);

      const user = await getUserById(clientId);
      setClient(user);

      const abonnement = await getAbonnementById(abonnementId);
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
    abonnementExpired = 'Абонемент истёк!',
  }

  const validateForm = (abonnementValue: number) => {
    const errors: any[] = [];

    if (abonnementValue === 0) {
      errors.push(abonnementErrorTypes.abonnementValueException);
    }

    if (abonnementValue > abonnementDetails.value) {
      errors.push(abonnementErrorTypes.abonnementInputIsBiggerThanAbonnementValue);
    }

    if (Date.now() > abonnementDetails.endDate) {
      errors.push(abonnementErrorTypes.abonnementExpired);
    }

    return errors;
  };

  const confirmVisit = async () => {
    const errors = validateForm(abonnementValue);

    if (errors.length > 0) {
      showMessage({
        message: 'Ошибка',
        description: errors[0],
        type: 'warning',
      });

      return;
    }

    setButtonDisabled(true);
    setButtonIsLoading(true);

    await createVisit(abonnementId, abonnementValue, asyncdata.token)
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
    if (value.trim() !== '') {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }

    setAbonnementValue(parseInt(value));
  };

  useEffect(() => {
    initFunc();
  }, []);

  if (!isLoading) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 170 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <TextBlock text={`Клиент: ${client.name} ${client.surname}`} icon={personIcon}></TextBlock>

              {/* Cost of the Abonnement */}
              <View style={styles.inputContainer}>
                <Text style={styles.tipText}>{`Вычесть ${abonnementDetails.currency}`}</Text>
                <TextInputMask
                  type="custom"
                  options={{
                    mask: '999999999',
                  }}
                  value={abonnementValue.toString()}
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
