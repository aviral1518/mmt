import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions } from "react-native";

import register from "../screens/register";
import login from "../screens/login";
import reset from '../screens/reset';

const Tab = createMaterialTopTabNavigator();

export default function AuthenticationScreen({ navigation, route }) {
	return (
		<Tab.Navigator
			tabBarPosition="top"
			tabBarOptions={{
				showIcon: false,
				showLabel: false,
			}}
			tabBar={props => null}
			initialRouteName="Login"
			backBehavior="initialRoute"
			lazy={false}
			keyboardDismissMode="auto"
			swipeEnabled={false}
			initialLayout={{ width: Dimensions.get("window").width }}
		>
			<Tab.Screen name="Register" component={register}/>
			<Tab.Screen name="Login" component={login}/>
			<Tab.Screen name="Reset" component={reset}/>
		</Tab.Navigator>
	);
}

