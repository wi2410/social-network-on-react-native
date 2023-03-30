import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, {Marker} from 'react-native-maps';

const MapScreen = () => (
    <View style={styles.container}>
        <MapView 
            style={{flex: 1}} 
            initialRegion={{
                latitude:'37,785834', 
                longitude:'-122,406417', 
                latitudeDelta:'0.09',
                longitudeDelta: '0.04',
            }} >
                <Marker
                    title="travel photo" 
                    coordinate={{
                        latitude:'37,785834', 
                        longitude:'-122,406417'}} 
                    
                />
        </MapView>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

export default MapScreen;