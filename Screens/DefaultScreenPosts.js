import React, { useEffect, useState, useCallback } from "react";
import {Text, View, StyleSheet, FlatList, Image, TouchableOpacity} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import Message from "../assets/images/message.svg";
import Like from "../assets/images/like.svg";
import LocationIcon from "../assets/images/location.svg";


const DefaultScreenPosts = ({route, navigation}) => {
    const [fontsLoaded] = useFonts({
        RobotoBold: require("../assets/fonts/Roboto/Roboto-Bold.ttf"),
        RobotoRegular: require("../assets/fonts/Roboto/Roboto-Regular.ttf"),
        RobotoMedium: require("../assets/fonts/Roboto/Roboto-Medium.ttf"),
      });

    const [posts, setPosts] = useState([]);
    useEffect(()=> {
        if(route.params){
            setPosts(prevState => [...prevState, route.params])
        }
    },[route.params]);
    console.log('posts', posts);

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
        <View onLayout={onLayoutRootView} style={styles.container}>
           <FlatList
           ListHeaderComponent={
            <View style={styles.userSection}>
              <Image
                style={styles.avatarImage}
                source={require("../assets/images/userAvatar.jpg")}
              />
              <View style={styles.userInfo}>
                <Text
                  style={{ ...styles.textUserName, fontFamily: "RobotoBold" }}
                >
                  Natali Romanova
                </Text>
                <Text style={{ ...styles.textUserEmail, fontFamily: "RobotoRegular" }}>
                  email@example.com
                </Text>
              </View>
            </View>
          } 
            data={posts} 
            keyExtractor={(item, indx)=> indx.toString()} 
            renderItem={({item})=> (
                <View style={styles.postContainer}>
                    <Image 
                        source={{uri: item.newPost.imagePost}} 
                        style={{width: "100%", height: 240, borderRadius: 8, }}/>
                        <Text style={{ ...styles.postTitle, fontFamily: "RobotoMedium" }}>
                            {item.newPost.title}
                        </Text>
                        <View style={styles.postThumb}>
                            <View
                                style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                }}
                            >
                                <TouchableOpacity
                                style={styles.wrapper}
                                onPress={() => navigation.navigate("Comments")}
                                >
                                <Message />
                                <Text style={styles.postText}>{item.newPost.comments}</Text>
                                </TouchableOpacity>
                                <View style={{ ...styles.wrapper, marginLeft: 24 }}>
                                    <Like />
                                    <Text style={styles.postText}>{item.newPost.likes}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.wrapper} onPress={() => navigation.navigate('Map')}>
                                <LocationIcon />
                                <Text style={styles.postText}>{item.newPost.location}</Text>
                            </TouchableOpacity>
                        </View>
                </View>
            )}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        backgroundColor: '#fff',   
    },
    postContainer: {
        marginBottom: 16, 
        justifyContent: 'center', 
        marginHorizontal: 16
    },
    userSection: {
        marginVertical: 32,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginHorizontal: 16
      },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 16,
        resizeMode: "cover",
    },
    userInfo: {
        marginLeft: 8,
    },
    textUserName: {
        color: "#212121",
        fontSize: 13,
        lineHeight: 15,
    },
    textUserEmail: {
        color: "#212121",
        opacity: 0.8,
        fontSize: 11,
        lineHeight: 13,
    },
    postTitle: {
        marginTop: 8,
        fontSize: 16,
        color: "#212121",
    },
    postThumb: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        marginBottom: 35,
    },
    wrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    postText: {
        marginLeft: 4,
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
      },
})

export default DefaultScreenPosts;