import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {RegistrationScreen} from '../Screens/RegistrationScreen';
import {LoginScreen} from '../Screens/LoginScreen';
import Home from "../Screens/Home";
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

const useRoute = (isAuth) => {
    if(!isAuth){
      return (<AuthStack.Navigator>
      <AuthStack.Screen options={{headerShown: false}} name='Register' component={RegistrationScreen}/>
      <AuthStack.Screen options={{headerShown: false}} name='Login' component={LoginScreen}/>
    </AuthStack.Navigator>);
    }
    return (
      <MainStack.Navigator>
      <MainStack.Screen options={{ headerShown: false }}
        name="Home"
        component={Home}/>
    </MainStack.Navigator>
    );
  }

  export default useRoute;