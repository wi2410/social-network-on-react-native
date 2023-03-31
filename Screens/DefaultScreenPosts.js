import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, } from "react-native";


import {
  collection,
  query,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

import Message from "../assets/images/message.svg";
import Like from "../assets/images/like.svg";
import LocationIcon from "../assets/images/location.svg";


const DefaultScreenPosts = ({route, navigation, onLayoutRootView}) => {
    
    
    const { userName, email, userAvatar } = useSelector((state) => state.auth);

    const [posts, setPosts] = useState([]);

    const [dimensions, setDimensions] = useState(Dimensions.get('window').width - 16 * 2)

    useEffect(()=>{
        const onChange = () => {
            const width = Dimensions.get('window').width - 16 * 2;
            
            setDimensions(width);
        }
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => subscription.remove();
    },[])

    const getAllPosts = async () => {
      try {
        const ref = query(collection(db, "posts"));
        onSnapshot(ref, (snapDoc) => {
          setPosts(snapDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
      } catch (error) {
        console.log("error.message", error.message);
      }
    }
    useEffect(()=> {
      getAllPosts();
    },[]);

    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
           <FlatList
           ListHeaderComponent={
            <View style={styles.userSection}>
              <Image
                style={styles.avatarImage}
                source={{ uri: userAvatar }}
              />
              <View style={styles.userInfo}>
                <Text
                  style={{ ...styles.textUserName, fontFamily: "RobotoBold" }}
                >
                  {userName}
                </Text>
                <Text style={{ ...styles.textUserEmail, fontFamily: "RobotoRegular" }}>
                {email}
                </Text>
              </View>
            </View>
          } 
            data={posts} 
            keyExtractor={(item, indx)=> indx.toString()} 
            renderItem={({item})=> (
                <View style={styles.postContainer}>
                    <Image 
                        source={{uri: item.photo}} 
                        style={{width: "100%", height: 240, borderRadius: 8, }}/>
                        <Text style={{ ...styles.postTitle, fontFamily: "RobotoMedium" }}>
                            {item.title}
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
                                onPress={() => navigation.navigate("Comments", {
                                  postId: item.id,
                                  postPhoto: item.photo,
                                  commentsQuantity: item.commentsQuantity,
                                })}
                                >
                                <Message fill={item.commentsQuantity === 0 ? "#BDBDBD" : "#FF6C00"} />
                                <Text style={styles.postText}>{item.commentsQuantity}</Text>
                                </TouchableOpacity>
                                <View style={{ ...styles.wrapper, marginLeft: 24 }}>
                                    <Like fill={!item.likeStatus ? "#BDBDBD" : "#FF6C00"}/>
                                    <Text style={styles.postText}>{item.likesQuantity}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.wrapper} onPress={() => navigation.navigate('Map', { location: item.location })}>
                                <LocationIcon />
                                <Text style={styles.postText}>{item.city}</Text>
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