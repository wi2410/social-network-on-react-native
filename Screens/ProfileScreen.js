import React, { useState, useEffect } from "react";
import {Text, View, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, ImageBackground,} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { collection, query, onSnapshot, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { authSignOutUser } from "../redux/auth/authOperations";

import Message from "../assets/images/message.svg";
import Like from "../assets/images/like.svg";
import LocationIcon from "../assets/images/location.svg";
import Logout from "../assets/images/logout.svg";


const ProfileScreen = ({ navigation, onLayoutRootView }) => {
    const [userPosts, setUserPosts] = useState([]);

    const { userName, userId, userAvatar } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const signOut = () => {
        dispatch(authSignOutUser());
    };

    const getUserPosts = async () => {
        try {
          const ref = query(
            collection(db, "posts"),
            where("userId", "==", `${userId}`)
          );
          onSnapshot(ref, (snapDoc) => {
            setUserPosts(
              snapDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
          });
        } catch (error) {
          console.log("error-message.get-posts", error.message);
        }
      };
    
      useEffect(() => {
        getUserPosts();
      }, []);
    

      const addLike = async (postId, likesQuantity) => {
        try {
          const postDocRef = doc(db, "posts", postId);
          await updateDoc(postDocRef, {
            likesQuantity: likesQuantity + 1,
            likeStatus: true,
          });
        } catch (error) {
          console.log("error-message.add-like", error.message);
        }
      };
    
      const removeLike = async (postId, likesQuantity) => {
        try {
          const postDocRef = doc(db, "posts", postId);
          await updateDoc(postDocRef, {
            likesQuantity: likesQuantity - 1,
            likeStatus: false,
          });
        } catch (error) {
          console.log("error-message.add-like", error.message);
        }
      };

    const [dimensions, setDimensions] = useState(Dimensions.get('window').width - 16 * 2)

    useEffect(()=>{
        const onChange = () => {
            const width = Dimensions.get('window').width - 16 * 2;
            
            setDimensions(width);
        }
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => subscription.remove();
    },[])
    
    return (
        <View onLayout={onLayoutRootView} style={styles.container}>
            <ImageBackground
                style={{
                    ...styles.imageBG,
                    // width: dimensions,
                    // height: windowHeight,
                }}
                source={require("../assets/images/PhotoBG.jpg")}
            >
        <FlatList
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
                height: 340,
                // width: dimensions,
              }}
            >
              <Text style={{ ...styles.textUserName, fontSize: 16 }}>
                No posts yet
              </Text>
            </View>
          }
          ListHeaderComponent={
            <View
              style={{
                ...styles.headerWrapper,
                
                // width: dimensions,
              }}
            >
              <View
                style={{
                  ...styles.imageThumb,
                  left: (dimensions - 120) / 2,
                }}
              >
                <Image
                  style={styles.avatarImage}
                  source={{ uri: userAvatar }}
                />
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={signOut}
              >
                <Logout />
              </TouchableOpacity>
              <View
                style={{
                  ...styles.userTitleWrapper,
                  width: dimensions,
                }}
              >
                <Text
                  style={{ ...styles.userTitle, fontFamily: "RobotoMedium" }}
                >
                  {userName}
                </Text>
              </View>
            </View>
          }
          data={userPosts}
          renderItem={({ item }) => (
            <View
              style={{
                ...styles.cardContainer,
                // width: dimensions,
              }}
            >
              <Image
                source={{ uri: item.photo }}
                style={{
                  ...styles.cardImage,
                  width: dimensions,
                }}
              />
              <Text
                style={{
                  ...styles.cardTitle,
                  width: dimensions,
                  fontFamily: "RobotoMedium",
                }}
              >
                {item.title}
              </Text>
              <View
                style={{ ...styles.cardThumb, width: dimensions }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={styles.cardWrapper}
                    onPress={() =>
                      navigation.navigate("Comments", {
                        postId: item.id,
                        postPhoto: item.photo,
                        commentsQuantity: item.commentsQuantity,
                      })
                    }
                  >
                    <Message fill={item.commentsQuantity === 0 ? "#BDBDBD" : "#FF6C00"}/>
                    <Text style={styles.cardText}>{item.commentsQuantity}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress={ item.likeStatus ? () => removeLike(item.id, item.likesQuantity, item.likeStatus) : () => addLike(item.id, item.likesQuantity, item.likeStatus)}
                >
                  <View style={{ ...styles.cardWrapper, marginLeft: 24 }}>
                    <Like
                      fill={!item.likeStatus ? "#BDBDBD" : "#FF6C00"}
                    />
                    <Text style={styles.cardText}>{item.likesQuantity}</Text>
                  </View>
                </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.cardWrapper}
                  onPress={() =>
                    navigation.navigate("Map", { location: item.location })
                  }
                >
                  <LocationIcon />
                  <Text style={styles.cardText}>
                    {item.city}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            flexGrow: 1,
            // alignItems: "center",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            justifyContent:'flex-end',
          }}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    imageBG: {
        flex: 1,
        resizeMode: "cover",
        width: '100%',
        
      },
      headerWrapper: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignItems: "center",
        
      },
    
      imageThumb: {
        position: "absolute",
        top: -60,
        width: 120,
        height: 120,
        backgroundColor: "#F6F6F6",
        borderRadius: 16,
      },
      logoutButton: {
        position: "absolute",
        top: 22,
        right: 16,
      },
      avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 16,
        resizeMode: "cover",
      },
      userTitleWrapper: {
        alignItems: "center",
        marginTop: 92,
        marginBottom: 32,
      },
      userTitle: {
        textAlign: "center",
        fontSize: 30,
        lineHeight: 35,
        color: "#212121",
      },
      cardContainer: {
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      },
      cardImage: {
        height: 240,
        resizeMode: "cover",
        borderRadius: 8,
      },
      cardTitle: {
        marginTop: 8,
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
      },
      cardThumb: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        marginBottom: 35,
      },
      cardWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
      cardText: {
        marginLeft: 4,
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
      },
})

export default ProfileScreen;