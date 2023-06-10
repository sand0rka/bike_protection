import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

import {THEME} from '../src/Theme';
import MainScreen from '../screens/MainScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';

const homeName = 'Головна';
const mapName = 'Мапа';
const settingsName = 'Налаштування';

const Tab = createBottomTabNavigator();

export default function MainContainer(){
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName={homeName}
        screenOptions={({route}) => ({
            tabBarActiveTintColor: THEME.GREEN_COLOR,
            headerShown: false,
            tabBarInactiveTintColor: 'white',
            tabBarLabelStyle:{ paddingBottom: 15, fontSize: 12},
            tabBarStyle: {padding: 10, height: 70, backgroundColor: 'black'},
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              let rn = route.name;

              if (rn === homeName){
                iconName = focused ? 'home' : 'home-outline';
              }else if(rn === mapName){
                iconName = focused ? 'location-sharp' : 'location-outline';
              }else if (rn === settingsName){
                iconName = focused ? 'settings-sharp' : 'settings-outline';
              }

               return <Ionicons name={iconName} size={size} color={color} />

            },
        })}
        >
            <Tab.Screen name={mapName} component={MapScreen}/>
            <Tab.Screen name={homeName} component={MainScreen}/>
            <Tab.Screen name={settingsName} component={SettingsScreen}/>

        </Tab.Navigator>
      </NavigationContainer>
    );
}