import React from "react";
import {Text, View, StyleSheet} from "react-native"


const CreatePostsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>CreatePostsScreen</Text>
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

export default CreatePostsScreen;