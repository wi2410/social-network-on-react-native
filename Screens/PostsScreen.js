import React from "react";
import {} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import DefaultScreenPosts from "./DefaultScreenPosts";
import CommentsScreen from "./CommentsScreen";
import MapScreen from "./MapScreen";

const NestsedScreen = createStackNavigator();

const PostsScreen = () => {
    return(
        <NestsedScreen.Navigator>
        <NestsedScreen.Screen options={{headerShown: false}} name='PostScreen' component={DefaultScreenPosts} />
        <NestsedScreen.Screen name='Comments' component={CommentsScreen} />
        <NestsedScreen.Screen name='Map' component={MapScreen} />
    </NestsedScreen.Navigator>
    );
}

export default PostsScreen;