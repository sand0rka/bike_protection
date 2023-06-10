import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

const SettingsScreen = ({navigation}) => {
    const localImage = require('../assets/fon3.png');
    return (
        <View style = {{flex:1}}>
         <View >
         <ImageBackground source={localImage} style={styles.image}/>
         </View>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    image: {
         flex: 1,
         height: 880,
         width: '100%'
     },  
})