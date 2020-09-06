import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import login from '../screens/login';
import register from '../screens/register';
import home from '../screens/home';
import reset from '../screens/reset';
import SplashScreen from "react-native-splash-screen";

const RootStack = createStackNavigator(
  {
    login: login,
    register: register,
    home: home,
    reset: reset,
  },
  {
    initialRouteName: 'login',
    defaultNavigationOptions: {
      headerShown:false,
    },
  },
);
SplashScreen.hide();
const RootContainer = createAppContainer(RootStack);

export default function App() {
  return (
    <RootContainer />
  )
}