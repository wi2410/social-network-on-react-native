import React, { useEffect, useCallback } from 'react';
import {Provider} from 'react-redux';
import { Main } from "./components/Main";
import { store } from "./redux/store";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoBold: require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
    RobotoRegular: require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
    RobotoMedium: require("./assets/fonts/Roboto/Roboto-Medium.ttf"),
  });

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
    <Provider store={store}>
      <Main onLayout={onLayoutRootView}/>
    </Provider>
  );
}
