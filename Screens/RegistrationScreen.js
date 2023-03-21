import React, {useState, useEffect, useCallback} from "react";
import {StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, 
    KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert, Dimensions} from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export const RegistrationScreen =() => {
    const [fontsLoaded] = useFonts({
        RobotoBold: require("../assets/fonts/Roboto/Roboto-Bold.ttf"),
        RobotoRegular: require("../assets/fonts/Roboto/Roboto-Regular.ttf"),
      });

    const [isShowKeyboard, setIsShowKeyboard] = useState(false);

    const [focusEmail, setFocusEmail] = useState(false);
    const [focusPassword, setFocusPassword] = useState(false);
    const [focusUserName, setFocusUserName] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    const [hiddenPassword, setHiddenPassword] = useState(true);

    const [dimensions, setDimensions] = useState(Dimensions.get('window').width - 16 * 2)

    useEffect(()=>{
        const onChange = () => {
            const width = Dimensions.get('window').width - 16 * 2;
            
            setDimensions(width);
        }
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => subscription.remove();
    },[])

    const onFocusEmail =() => {
        setFocusEmail(true);
        setIsShowKeyboard(true);
    }
    const onFocusPassword =() => {
        setFocusPassword(true);
        setIsShowKeyboard(true);
    }
    const onFocusUserName =() => {
        setFocusUserName(true);
        setIsShowKeyboard(true);
    }
    const keyboardHide = ()=>{
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    }

    const userNameChange = (userName) => setUserName(userName);
    const emailChange = (email) => setEmail(email);
    const passwordChange = (password) => setPassword(password);

    const onSignIn = () => {
        if (!email.trim() || !password.trim()) {
          Alert.alert(`Fields must be completed!`);
          return;
        }
        Alert.alert(`Welcome back, ${email}!`);
        setIsShowKeyboard(false);
        console.log(email, password);
        setEmail("");
        setPassword("");
        Keyboard.dismiss();
      };

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
                <TouchableWithoutFeedback onPress={keyboardHide}>
    <View style={styles.container}>
        <ImageBackground style={styles.imageBackground} source={require('./../assets/images/PhotoBG.jpg')}>
                <View style={styles.form}>
                    <Text style={{...styles.text, fontFamily: "RobotoBold"}}>Register</Text>
                    <TextInput style={{...styles.input, 
                                        fontFamily:"RobotoRegular", 
                                        borderColor: focusUserName ? "#FF6C00" : "#E8E8E8",
                                        width: dimensions,
                                    }} 
                        onFocus={onFocusUserName} onBlur={()=> setFocusUserName(false)}
                        placeholder="User name" placeholderTextColor={"#BDBDBD"}
                        value={userName}
                        onChangeText={userNameChange}
                    />
                    <TextInput style={{...styles.input,
                                        marginTop: 16, 
                                        fontFamily:"RobotoRegular", 
                                        borderColor: focusEmail ? "#FF6C00" : "#E8E8E8",
                                        width: dimensions,
                                    }} 
                        onFocus={onFocusEmail} onBlur={()=> setFocusEmail(false)}
                        placeholder="Email address" placeholderTextColor={"#BDBDBD"}
                        value={email}
                        onChangeText={emailChange}
                        keyboardType="email-address"
                    />
                    <View>
                        <TextInput style={{...styles.input, 
                                    marginTop: 16, 
                                    fontFamily:"RobotoRegular",
                                    borderColor: focusPassword ? "#FF6C00" : "#E8E8E8",
                                    width: dimensions,
                                }} 
                        secureTextEntry={hiddenPassword}
                        onFocus={onFocusPassword} onBlur={()=> setFocusPassword(false)}
                        placeholder="Password" 
                        placeholderTextColor={"#BDBDBD"}
                        value={password}
                        onChangeText={passwordChange}
                        />
                    <TouchableOpacity style={styles.btnShowPassword} onPress={()=>setHiddenPassword((prevState)=>!prevState)}>
                        <Text style={{...styles.titliHidePassord, fontFamily: "RobotoRegular"}}>{hiddenPassword ? "Show" : "Hide"}</Text>
                    </TouchableOpacity> 
                    </View>
                      
                    <TouchableOpacity activeOpacity={0.6} style={{...styles.btn, width: dimensions}} onPress={onSignIn}>
                        <Text style={{...styles.btnTitle, fontFamily:"RobotoRegular",}} >Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={{...styles.linkTitle, fontFamily:"RobotoRegular", marginBottom: isShowKeyboard ? -20 : 144}}>
                        Do you already have an account? Login
                        </Text>
                    </TouchableOpacity>
                </View>
        </ImageBackground>
    </View>
    </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    text:{
        marginTop: 32,
        marginBottom: 33,
        textAlign: "center",
        color: "#212121",
        fontSize: 30,

    },
    imageBackground:{
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-end",
        
    },
    form:{
        // flex: 1,
        backgroundColor:"#FFFFFF",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignItems: "center"
        // paddingBottom: 144,
        // marginBottom: 100,
    },
    input:{
        borderWidth: 1,
        borderRadius: 8,
        height: 50,
        // marginHorizontal: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 15,
        color: "#212121",
        backgroundColor:"#F6F6F6",
    },
    btn:{
        backgroundColor:"#FF6C00",
        height: 51,
        marginTop: 43,
        paddingVertical: 16,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 100,
        // marginHorizontal: 16,
        
    },
    btnTitle:{
        color: "#FFFFFF",
        fontSize: 16
    },
    linkTitle:{
        marginTop: 16,
        // marginBottom: 60,
        textAlign: "center",
        color: "#1B4371",
        
    },
    btnShowPassword:{
        position: "absolute",
        right: 32,
        bottom: 16,
        paddingRight: 5
    },
    titliHidePassord:{
        fontSize: 16,
        color: "#1B4371",
    }
})