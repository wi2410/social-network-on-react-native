import React, {useState, useEffect, useCallback} from "react";
import { useSelector } from "react-redux";
import {Text, View, StyleSheet, Image, TextInput, Keyboard, KeyboardAvoidingView, Dimensions} from "react-native";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";



import LocationIcon from "../assets/images/location.svg";
import Trash from "../assets/images/trash.svg";


const CreatePostsScreen = ({route, navigation, onLayoutRootView}) => {

    const [camera, setCamera] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");

    const [isFocusedTitle, setIsFocusedTitle] = useState(false);
    const [isFocusedLocation, setIsFocusedLocation] = useState(false);
    const [isDisabledPublish, setIsDisabledPublish] = useState(true);
    const [isDisabledTrash, setIsDisabledTrash] = useState(true);

    const [dimensions, setDimensions] = useState(Dimensions.get('window').width - 16 * 2)

    useEffect(()=>{
        const onChange = () => {
            const width = Dimensions.get('window').width - 16 * 2;
            
            setDimensions(width);
        }
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => subscription.remove();
    },[]);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
        })();
      }, []);

    useEffect(() => {
        photo && title && location
          ? setIsDisabledPublish(false)
          : setIsDisabledPublish(true);
      }, [title, location, photo]);
    
      useEffect(() => {
        photo || title || location
          ? setIsDisabledTrash(false)
          : setIsDisabledTrash(true);
      }, [title, location, photo]);

      const { userId, userName } = useSelector((state) => state.auth);

    const takePhoto = async () => {
        const photo = await camera.takePictureAsync();
        let location = await Location.getCurrentPositionAsync();
        let coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        let address = await Location.reverseGeocodeAsync(coords);
        let city = address[0].city;
        setPhoto(photo.uri);
        setLocation(location);
        setCity(city);
        console.log("take photo", address)
    };
    const titleHandler = (title) => setTitle(title);
    
    const uploadPhotoToServer = async () => {
      try {
        const response = await fetch (photo);
        const file = await response.blob();
        const uniquePostId = Date.now().toString();
        const storage = getStorage();
        const storageRef = ref(storage, `postImage/${uniquePostId}`);

        await uploadBytes(storageRef, file);

        const uploadedPhoto = await getDownloadURL(storageRef);
        return uploadedPhoto;
      } catch (error) {
        console.log("error.message", error.message);
      }
    };

    const uploadPostToServer = async () => {
      try {
        const photo = await uploadPhotoToServer();
        const postRef = await addDoc(collection(db, "posts"), {
          photo,
          title,
          location,
          city,
          userId,
          userName,
          commentsQuantity: 0,
          likesQuantity: 0,
          likeStatus: false,
        });
      } catch (error) {
        console.log("error.message", error.message);
      }
    };

    const onPublish = () => {
          uploadPostToServer();
          setPhoto();
          setTitle("");
          setLocation("");
          setCity("");
          Keyboard.dismiss();
          navigation.navigate("PostScreen");
    };

    const onDelete = () => {
        setTitle("");
        setLocation("");
        setPhoto(null);
        
        Keyboard.dismiss();
      };
    return (
        <KeyboardAvoidingView
                onLayout={onLayoutRootView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
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
            <View style={{width: dimensions}}>
            <TextInput
                style={{
                  ...styles.input,
                  borderColor: isFocusedTitle ? "#FF6C00" : "#E8E8E8",
                  fontFamily: "RobotoRegular",
                  width: dimensions,
                }}
                onFocus={() => setIsFocusedTitle(true)}
                onBlur={() => setIsFocusedTitle(false)}
                value={title}
                placeholder="Title..."
                cursorColor={"#BDBDBD"}
                placeholderTextColor={"#BDBDBD"}
                onChangeText={titleHandler}
              />
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: isFocusedLocation ? "#FF6C00" : "#E8E8E8",
                  paddingLeft: 26,
                  fontFamily: "RobotoRegular",
                  width: dimensions,
                }}
                onFocus={() => setIsFocusedLocation(true)}
                onBlur={() => setIsFocusedLocation(false)}
                value={city}
                textContentType={"location"}
                placeholder="Location"
                cursorColor={"#BDBDBD"}
                placeholderTextColor={"#BDBDBD"}
              />
              <LocationIcon style={styles.locationIcon} />
            </View>
            <View>
                <TouchableOpacity onPress={onPublish} style={{...styles.sendBtn, backgroundColor: isDisabledPublish ? "#F6F6F6" : "#FF6C00",}} disabled={isDisabledPublish}>
                    <Text style={styles.sendBtnTitle}>Publish</Text>
                </TouchableOpacity>
            </View>
            <View style={{alignItems: "center",
        justifyContent: "center"}}>
            <TouchableOpacity
              style={{
                ...styles.trashButton,
                backgroundColor: isDisabledTrash ? "#F6F6F6" : "#FF6C00",
              }}
              onPress={onDelete}
              disabled={isDisabledTrash}
            >
              <Trash stroke={isDisabledTrash ? "#BDBDBD" : "#FFFFFF"} />
            </TouchableOpacity>
            </View>
        </View>
            </KeyboardAvoidingView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",   
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
        
        justifyContent: 'center',
        alignItems: "center"
    },
    sendBtnTitle: {
        color: "#fff",
        fontSize: 16,
    },
    input: {
        marginTop: 16,
        paddingTop: 0,
        paddingBottom: 0,
        height: 56,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: "#E8E8E8",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
        marginHorizontal: 16
      },
      locationIcon: {
        position: "absolute",
        bottom: 16,
        left: 16
      },
      trashButton: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 80,
        width: 70,
        height: 40,
        borderRadius: 20,
      },
})

export default CreatePostsScreen;