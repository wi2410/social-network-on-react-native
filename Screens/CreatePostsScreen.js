import React, {useState, useEffect, useCallback} from "react";
import {Text, View, StyleSheet, Image, TextInput, Keyboard, KeyboardAvoidingView, Dimensions} from "react-native";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";


import LocationIcon from "../assets/images/location.svg";
import Trash from "../assets/images/trash.svg";


const CreatePostsScreen = ({route, navigation}) => {
    const [fontsLoaded] = useFonts({
        RobotoBold: require("../assets/fonts/Roboto/Roboto-Bold.ttf"),
        RobotoRegular: require("../assets/fonts/Roboto/Roboto-Regular.ttf"),
      });

    const [camera, setCamera] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

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

    const takePhoto = async () => {
        const photo = await camera.takePictureAsync();
        const location = await Location.getCurrentPositionAsync();
        setPhoto(photo.uri);
        setLocation(location);
        console.log("take photo", location)
    };
    const titleHandler = (title) => setTitle(title);
    

    const onPublish = () => {
        const newPost = {
            id: Date(),
            imagePost: photo,
            title: title,
            location: `${location.coords.latitude}, ${location.coords.longitude}`,
            comments: 0,
            likes: 0,
          };
          setPhoto();
          setTitle("");
          setLocation("");
          Keyboard.dismiss();
        navigation.navigate("PostScreen", {newPost});
    };

    const onDelete = () => {
        setTitle("");
        setLocation("");
        setPhoto(null);
        
        Keyboard.dismiss();
      };
    // useEffect(() => {
    //     if (route.params) {
          
    //       setLocation(route.params.location);
    //     }
    //   }, [route.params]);
      
    useEffect(() => {
        async function makeReady() {
          await SplashScreen.preventAutoHideAsync();
        }
        makeReady();
      }, []);
    
      const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
      if (!fontsLoaded) {
        return null;
      }
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
                value={
                  location
                    ? `${location?.latitude}, ${location?.longitude}`
                    : ""
                }
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