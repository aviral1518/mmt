import "react-native-gesture-handler";
import React from "react";
import SplashScreen from "react-native-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {navigationRef,isReadyRef,executeQueue} from '../helpers/RootNavigation';
import AuthenticationScreen from "../navigation/AuthenticationScreen";
import DrawerScreen from "../navigation/DrawerScreen";
import ProfileScreen from "../screens/ProfileScreen";

import realmConnect from "../realm";
import bind from "../redux/bind";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "../redux/reducers";
import { signIn } from "../helpers/authentication";

const store = createStore(reducer);
const Stack = createStackNavigator();

/*
 * Using this component allows us to check if the user has already logged-in, if he has then we hide the
 * authentication screens, so when he presses back button from Dashboard, the app exits instead of taking him
 * back to the authentication screens
 * */
class Screens extends React.Component {
  constructor(props) {
		super(props);

		this.state = {
			realm: null,
		};
	}

	componentDidMount() {
		const {
			authenticateUser
		} = this.props;

		try {
			realmConnect(realm => {
				realm.write(() => {
					let userCheck = realm.objects("User");
					if (userCheck.length) {
						const user = userCheck[0];
						signIn({
							email: user.email,
							password: user.password,
						}, 
						authenticateUser,
						);
					}
					setTimeout(() => SplashScreen.hide(), 500);
				});
				this.setState({ realm });
			});
			SplashScreen.hide();
		}
		catch (e) {
			console.log("Error while checking existing logged-in account:", e);
		}
	}

	render() {
		const { email } = this.props.user;
		return (
			<SafeAreaProvider>
				<StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
				<NavigationContainer
          			ref={navigationRef}
         		 	onReady={() => {
            		isReadyRef.current = true;
            		executeQueue();
          		}}>
					<Stack.Navigator
						initialRouteName={email ? "Drawer" : "Authentication"}
						screenOptions={{
							headerShown: false,
						}}
					>
						{
							!email &&
							<Stack.Screen name="Authentication" component={AuthenticationScreen}/>
						}
						<Stack.Screen name="Drawer" component={DrawerScreen}/>
						<Stack.Screen name="Profile" component={ProfileScreen}/>
					</Stack.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		);
	}
}

Screens = bind(Screens);


class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Provider store={store}>
				<Screens navigation={this.props.navigation}/>
			</Provider>
		);
	}
}

export default App;