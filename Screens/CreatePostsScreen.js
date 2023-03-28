import React, {useState, useEffect} from "react";
import {Text, View, StyleSheet, Image} from "react-native";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";


const CreatePostsScreen = ({navigation}) => {
    const [camera, setCamera] = useState(null);
    const [photo, setPhoto] = useState(null);
    const takePhoto = async () => {
        const photo = await camera.takePictureAsync();
        const location = await Location.getCurrentPositionAsync();
        setPhoto(photo.uri)
    };

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
        })();
      }, []);

    const sendPhoto = () => {
        navigation.navigate("DefaultScreen", {photo});
    }
    return (
        <View style={styles.container}>
            <Camera style={styles.camera} ref={setCamera}>
                {photo && (
                    <View style={styles.takePhotoContainer}>
                    <Image source={{uri: photo}} style={{height: 200, width: 200}}/>
                </View>
                )}
                <TouchableOpacity onPress={takePhoto} style={styles.snapContainer}>
                    <Text style={styles.snap}>SNAP</Text>
                </TouchableOpacity>
            </Camera>
            <View>
                <TouchableOpacity onPress={sendPhoto} style={styles.sendBtn}>
                    <Text style={styles.sendBtnTitle}>Publish</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,   
    },
    camera: {
        height: '50%',
        marginHorizontal: 16,
        borderRadius: 10,
        marginTop: 32,
        alignItems: "center",
    },
    snap: {
        color: "#fff",
    },
    snapContainer: {
        borderWidth: 1,
        borderColor: "#ff0000",
        width: 70,
        height: 70,
        marginTop: '80%',
        borderRadius: 50,
        justifyContent:"center",
        alignItems:"center"
    },
    takePhotoContainer: {
        position: 'absolute',
        top: 50,
        left: 10,
        borderColor: "#fff",
        borderWidth: 1,
        
    },
    sendBtn: {
        marginHorizontal: 16,
        height: 51,
        marginTop: 32,
        borderRadius: 100,
        backgroundColor: '#FF6C00',
        justifyContent: 'center',
        alignItems: "center"
    },
    sendBtnTitle: {
        color: "#fff",
        fontSize: 16,
    }
})

export default CreatePostsScreen;