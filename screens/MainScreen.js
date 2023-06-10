import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Button, ImageBackground, Text} from 'react-native';
import {THEME} from '../src/Theme';
import BleManager from 'react-native-ble-manager';
import * as BleManagerEmitter from "expo-updates";

const MainScreen = ({navigation}) => {
    const localImage = require('../assets/fon3.png');
    const [changeColor, setChangeColor] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [deviceConnected] = useState(false);
    const [bleError, setBleError] = useState('');
    const ARDUINO_UID_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    const ARDUINO_UID_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

    useEffect(() => {
        BleManager.start({showAlert: false}).then(() => {
            const subscription = BleManagerEmitter.addListener(
                'BleManagerDidUpdateState',
                ({state}) => {
                    if (state === 'PoweredOn') {
                        scanAndConnectToDevice();
                    }
                }
            );

            // Clean up the subscription when the component unmounts
            return () => {
                subscription.remove();
                disconnectFromDevice();
            };
        });
    }, []);


    // BleManager.start({showAlert: false});

// Підписка на події Bluetooth
    BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    BleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    BleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

// Обробка знайдених пристроїв Bluetooth
    function handleDiscoverPeripheral(peripheral) {
        if (peripheral.name === 'ESP32') {
            // Зупинка сканування, якщо знайдено ардуінку ESP32
            BleManager.stopScan();

            // Підключення до Long name works now
            BleManager.connect(peripheral.id)
                .then(() => {
                    console.log('Connected to Long name works now');

                    // Отримання значень з характеристики
                    BleManager.retrieveServices(peripheral.id)
                        .then((peripheralInfo) => {
                            const {characteristics} = peripheralInfo.characteristics.find(
                                (service) => service.service === ARDUINO_UID_SERVICE_UUID
                            );

                            BleManager.read(peripheral.id, ARDUINO_UID_SERVICE_UUID, characteristics[0])
                                .then((value) => {
                                    const uid = decoder.write(value);
                                    console.log('UID:', uid);
                                    // Відключення від Long name works now
                                    BleManager.disconnect(peripheral.id);
                                })
                                .catch((error) => {
                                    console.log('Error reading characteristic:', error);
                                });
                        })
                        .catch((error) => {
                            console.log('Error retrieving services:', error);
                        });
                })
                .catch((error) => {
                    console.log('Error connecting to Long name works now:', error);
                });
        }
    }

// Обробка закінчення сканування
    function handleStopScan() {
        console.log('Scanning stopped');
    }

// Обробка оновлення значення характеристики
    function handleUpdateValueForCharacteristic(data) {
        console.log('Received data:', data);
    }

// Зупинка сканування після 10 секунд
    setTimeout(() => {
        BleManager.stopScan();
        console.log('Scanning stopped');
    }, 10000);

    const onPressHandler = () => {
        setBlocked(!blocked);
        setChangeColor(!changeColor);

        const data = blocked ? 'BLOCK' : 'UNBLOCK';
        sendDataToArduino(data);
    };

    return (
        <View style={{flex: 1}}>
            <View>
                <ImageBackground source={localImage} style={styles.image}/>
                <View style={styles.eclipse}/>

                <View style={styles.viewText}>
                    {blocked ? (
                        <Text style={styles.text}>Пристрій заблоковано</Text>
                    ) : (
                        <Text style={styles.text}>Пристрій розблоковано</Text>
                    )}
                </View>
                <View style={styles.buttons}>
                    <Button
                        title={blocked ? 'Розблокувати' : 'Заблокувати'}
                        onPress={onPressHandler}
                        color={blocked ? THEME.GREEN_COLOR : THEME.RED_COLOR}
                        disabled={!deviceConnected || bleError !== ''}
                    />
                    {bleError !== '' && <Text style={styles.errorText}>{bleError}</Text>}
                </View>
            </View>
        </View>
    );
};

export default MainScreen;

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 880,
        width: '100%',
    },
    buttons: {
        marginTop: 180,
        paddingHorizontal: 90,
    },
    eclipse: {
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        width: '94%',
        height: 545,
        position: 'absolute',
        borderRadius: 20,
        left: '3%',
        right: '3%',
        top: '15%',
    },
    viewText: {
        marginTop: '80%',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 10,
    },
});
