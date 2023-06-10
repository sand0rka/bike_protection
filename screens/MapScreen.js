import * as React from 'react';
import * as Location from 'expo-location';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';

export default function MapScreen({navigation}){

    const[origin, setOrigin] = React.useState({
        latitude: 50.426793,
        longitude: 30.563402,
    });

    const[destination, setDestination] = React.useState({
        latitude: 50.426793,
        longitude: 30.563402,
     });

    React.useEffect(() => {
       getLocationPermission();
    }, [])

    async function getLocationPermission() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted') {
        alert('Дозвіл відхилено');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
      setOrigin(current);
    }

    return (
        <View style={styles.container}>
          <MapView 
            style={styles.map}
            initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04
            }}
          >
            <Marker 
             draggable
             coordinate={origin}
             onDragEnd={(direction) => setOrigin(direction.
                nativeEvent.coordinate)}
            />
            <Marker
             draggable
             coordinate={destination}
             onDragEnd={(direction) => setDestination(direction.
                nativeEvent.coordinate)}
            />
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={API_KEY}
              strokeColor= "rgba(103, 103, 103, 1)"
              strokeWidth={5}
            />
          </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: 'black',
      alignItems:'center',
      justifyContent: 'center'
    },
    map: {
      width: '100%',
      height: '100%'
    }
});