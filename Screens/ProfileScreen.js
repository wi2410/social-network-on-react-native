import React from "react";
import {Text, View, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, ImageBackground,} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { db } from "../firebase/config";
import { authSignOutUser } from "../redux/auth/authOperations";

import Message from "../assets/images/message.svg";
import Like from "../assets/images/like.svg";
import LocationIcon from "../assets/images/location.svg";
import Logout from "../assets/images/logout.svg";


const ProfileScreen = () => {
    const [userPosts, setUserPosts] = useState([]);

    const { userName, userId, userAvatar } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const signOut = () => {
        dispatch(authSignOutUser());
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
        <View style={styles.container}>
            <Text>ProfileScreen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default ProfileScreen;