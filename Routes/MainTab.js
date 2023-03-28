import React from "react";
import { TouchableOpacity, View } from "react-native";

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import PostsScreen from '../Screens/PostsScreen';
import CreatePostsScreen from '../Screens/CreatePostsScreen';
import ProfileScreen from '../Screens/ProfileScreen';

import ArrowLeft from "../assets/images/arrowLeft.svg";
import Grid from "../assets/images/grid.svg";
import User from "../assets/images/user.svg";
import Plus from "../assets/images/plus.svg";
import Logout from "../assets/images/logout.svg";

const MainTab = createBottomTabNavigator();

export const MainTabMenu = ({navigation}) =>{
    return (<MainTab.Navigator
    screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { height: 80, justifyContent: "center" },
        headerTitleAlign: "center",
        headerStyle: { height: 95},
        headerShadowVisible: {
          elevation: 1,
          backgroundColor: "#FFFFFF",
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 0.5 },
          shadowOpacity: 0.3,
          shadowRadius: 27.18,
        },
        headerTitleStyle: {
          marginBottom: 11,
          fontSize: 17,
          lineHeight: 22,
          color: "#212121",
        },
        headerRightContainerStyle: { paddingRight: 16, paddingBottom: 9 },
        headerLeftContainerStyle: { paddingLeft: 16, paddingBottom: 9 },
      }}
    >
    <MainTab.Screen name='Posts' component={PostsScreen} 
        options={{
            headerShown: true,
            tabBarIcon: ({ focused, size, color }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: focused ? "#FF6C00" : "#FFFFFF",
                  width: 70,
                  height: 40,
                  borderRadius: 20,
                }}
              >
                <Grid
                  size={size}
                  color={color}
                  strokeOpacity={0.8}
                  stroke={focused ? "#FFFFFF" : "#212121"}
                />
              </View>
            ),
            headerRight: ({ focused, size, color }) => (
              <TouchableOpacity >
                <Logout size={size} color={color} />
              </TouchableOpacity>
            ),
          }}
    />
    <MainTab.Screen name='CreatePosts' component={CreatePostsScreen} 
        options={{
            headerShown: true,
            tabBarStyle: { display: "none" },
            tabBarIcon: ({ focused, size, color }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: focused ? "#FF6C00" : "#FFFFFF",
                  width: 70,
                  height: 40,
                  borderRadius: 20,
                }}
              >
                <Plus
                  size={size}
                  color={color}
                  fillOpacity={0.8}
                  fill={focused ? "#FFFFFF" : "#212121"}
                />
              </View>
            ),
            headerLeft: ({ focused, size, color }) => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft size={size} color={color} />
              </TouchableOpacity>
            ),
          }}
    />
    <MainTab.Screen name='Profile' component={ProfileScreen} 
        options={{
            headerShown: false,
            tabBarIcon: ({ focused, size, color }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: focused ? "#FF6C00" : "#FFFFFF",
                  width: 70,
                  height: 40,
                  borderRadius: 20,
                }}
              >
                <User
                  size={size}
                  color={color}
                  stroke={focused ? "#FFFFFF" : "#212121"}
                />
              </View>
            ),
          }}
    />
  </MainTab.Navigator>
    );
}
