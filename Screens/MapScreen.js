import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, {Marker} from 'react-native-maps';

const MapScreen = ({route}) => {
    const { longitude, latitude } = route.params.location.coords;

    return (
        <View style={styles.container}>
        <MapView 
            style={{flex: 1}} 
            initialRegion={{
                latitude: latitude, 
                longitude: longitude, 
                latitudeDelta:'0.09',
                longitudeDelta: '0.04',
            }} >
                <Marker
                    title="travel photo" 
                    coordinate={{
                        latitude: latitude, 
                        longitude: longitude}} 
                    
                />
        </MapView>
    </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

export default MapScreen;