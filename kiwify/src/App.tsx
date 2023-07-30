import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import OneSignal, {DeviceState} from 'react-native-onesignal';
import Clipboard from '@react-native-clipboard/clipboard';
import {getStatus, sendNotification} from './api';

const App = () => {
  const [valorInput, setValorInput] = useState('');
  const [valorTitleInput, setValorTitleInput] = useState('');
  const [valorMsgInput, setValorMsgInput] = useState('');
  const [playerid, setplayerid] = useState('');

  const styleBody = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
  });

  const stylesTitle = StyleSheet.create({
    container: {
      marginBottom: 30,
      fontSize: 26,
      marginTop: 30,
    },
    playerid: {
      fontSize: 16,
      marginBottom: 20,
    },
  });

  const stylesMessageInput = StyleSheet.create({
    container: {
      padding: 10,
      fontSize: 16,
    },
    input: {
      textAlignVertical: 'center',
      width: '80%',
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
    },
  });

  const stylesButton = StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#007BFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      width: '80%',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  const handleButtonPress = async () => {
    OneSignal.setAppId('25dd4296-7fc9-475e-8fd9-76ade13e630a');

    try {
      const deviceState = await OneSignal.getDeviceState();
      if (deviceState) {
        const {userId} = deviceState;
        const checkStatus = await getStatus(userId);
        console.log(checkStatus);
        if (checkStatus === '0') {
          Alert.alert('ERRO', 'Você não esta autorizado!');
          return null;
        }
        Alert.alert('Sucesso', 'Player ID encontrado');
        const result = await sendNotification(
          userId,
          valorTitleInput,
          valorMsgInput,
          valorInput,
        );
        if (result === 1) {
          Alert.alert('Sucesso', 'Notificação foi enviada!');
        } else {
          Alert.alert('Erro', 'Notificação não foi enviada!');
        }
      } else {
        Alert.alert('Erro', 'Player ID do OneSignal não encontrado.');
      }
    } catch (error: any) {
      Alert.alert('ERRO', error.message);
    }
  };

  useEffect(() => {
    OneSignal.setAppId('25dd4296-7fc9-475e-8fd9-76ade13e630a');
    OneSignal.setLogLevel(6, 0);
    OneSignal.sendTag('success', '0');
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      if (!response) {
        Alert.alert(
          'Erro',
          'Você não concedeu permissão para enviar e receber notificações.',
        );
      }
    });
    OneSignal.getDeviceState().then(async (deviceState: DeviceState | null) => {
      if (deviceState) {
        const {userId} = deviceState;
        setplayerid(userId);
      }
    });
  }, []);

  const formatarValorEmReal = (valor: string) => {
    const numero = Number(valor.replace(/[^0-9.-]+/g, ''));
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <SafeAreaView style={styleBody.container}>
      <Image
        source={require('./images/nubank-icon.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={stylesTitle.container}>Crie sua notificação Nubank</Text>

      <TouchableOpacity
        onPress={() => {
          Clipboard.setString(playerid);
          Alert.alert('Sucesso!', 'ID copiado para área de transferência.');
        }}>
        <Text style={stylesTitle.playerid}>Player ID: {playerid}</Text>
      </TouchableOpacity>

      <TextInput
        style={stylesMessageInput.input}
        placeholder="Título"
        onChangeText={msg => setValorTitleInput(msg)}
        multiline={true}
        numberOfLines={1}
      />

      <TextInput
        style={stylesMessageInput.input}
        placeholder="Mensagem"
        onChangeText={msg => setValorMsgInput(msg)}
        multiline={true}
        numberOfLines={3}
      />

      <TextInput
        style={stylesMessageInput.input}
        placeholder="Valor do Pix"
        onChangeText={valor => setValorInput(formatarValorEmReal(valor))}
        multiline={true}
        numberOfLines={1}
      />

      <TouchableOpacity
        style={stylesButton.buttonContainer}
        onPress={handleButtonPress}>
        <Text style={stylesButton.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;
