import React, { useState, useEffect, useCallback } from "react";
import {Text, View, StyleSheet, TextInput, Dimensions, FlatList, Image, TouchableOpacity, Keyboard, Alert} from "react-native";

import { useSelector } from "react-redux";

import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

import SendBtn from "../assets/images/send.svg";


const CommentsScreen = ({ route }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window').width - 16 * 2)

    useEffect(()=>{
        const onChange = () => {
            const width = Dimensions.get('window').width - 16 * 2;
            
            setDimensions(width);
        }
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => subscription.remove();
    },[])

    const [allComments, setAllComments] = useState([]);

    const [comment, setComment] = useState("");

    const commentHandler = (comment) => setComment(comment);

    const { postId, postPhoto, commentsQuantity } = route.params;

    const { userName, userAvatar } = useSelector((state) => state.auth);

    const uploadCommentToServer = async () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    try {
      const postDocRef = await doc(db, "posts", postId);
      await addDoc(collection(postDocRef, "comments"), {
        comment,
        userName,
        date,
        time,
        commentAvatar: userAvatar,
      });
      await updateDoc(postDocRef, { commentsQuantity: commentsQuantity + 1 });
    } catch (error) {
      console.log("error-message", error.message);
    }
  };

  const onSendComment = () => {
    if (!comment.trim()) {
      Alert.alert(`Enter your comment, please`);
      return;
    }
    uploadCommentToServer();
    Keyboard.dismiss();
    Alert.alert(`Your comment has been sent!`);
    setComment("");
  };

  const getAllComments = async () => {
    try {
      const postDocRef = await doc(db, "posts", postId);
      onSnapshot(collection(postDocRef, "comments"), (snapDoc) => {
        setAllComments(snapDoc.docs.map((doc) => ({ ...doc.data() })));
      });
    } catch (error) {
      console.log("error-message", error.message);
    }
  };

  useEffect(() => {
    getAllComments();
  }, []);

    return (
        <View style={{backgroundColor: "#FFFFFF", alignItems: "center", flex: 1}}>
                <View style={{ width: dimensions}}>
                <FlatList
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{ ...styles.container, width: dimensions }}>
                    <Image style={styles.commentImage} source={{ uri: postPhoto }} />
                    </View>
                }
                ListFooterComponent={
                    <View style={{ width: "100%", marginBottom: 32 }}>
                    <TextInput
                        value={comment}
                        style={styles.input}
                        placeholder="Leave a comment"
                        cursorColor={"#BDBDBD"}
                        placeholderTextColor={"#BDBDBD"}
                        onChangeText={commentHandler}
                    ></TextInput>
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={onSendComment}
                    >
                        <SendBtn style={{ width: 34, height: 34 }} />
                    </TouchableOpacity>
                    </View>
                }
                contentContainerStyle={{ width: dimensions }}
                data={allComments}
                renderItem={({ item }) => (
                    <View
                    style={{
                        ...styles.commentWrapper,
                        width: dimensions,
                    }}
                    >
                    <Image
                        source={{ uri: item.commentAvatar }}
                        style={styles.commentAvatarImage}
                    />
                    <View
                        style={{
                        ...styles.textWrapper,
                        width: dimensions,
                        }}
                    >
                        <Text style={styles.commentText}>{item.comment}</Text>
                        <Text style={styles.commentDate}>
                        {item.date} | {item.time}
                        </Text>
                    </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      marginTop: 32,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
    },
    commentImage: {
      height: 240,
      width: "100%",
      marginBottom: 31,
      borderRadius: 8,
    },
    commentWrapper: {
      flexDirection: "row",
      marginBottom: 24,
    },
    textWrapper: {
      padding: 16,
      backgroundColor: "#00000008",
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
    },
  
    commentAvatarImage: {
      width: 28,
      height: 28,
      marginRight: 16,
      borderRadius: 16,
      resizeMode: "cover",
    },
    commentText: {
      fontSize: 13,
      lineHeight: 18,
      color: "#212121",
    },
    commentDate: {
      marginTop: 8,
      fontSize: 10,
      lineHeight: 12,
      color: "#BDBDBD",
    },
    input: {
        // position: 'absolute',
        // bottom: 16,
      marginTop: 7,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 15,
      width: "100%",
      height: 50,
      backgroundColor: "#F6F6F6",
      borderWidth: 1,
      borderColor: "#E8E8E8",
      borderRadius: 100,
    },
    sendButton: {
      position: "absolute",
      top: 15,
      right: 8,
    },
  });

export default CommentsScreen;