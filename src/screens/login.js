import React, { useState } from "react";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import {
	ScrollView,
	View,
	Image,
	Alert,
	ActivityIndicator,
	StyleSheet
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import AppText from "../components/AppText";
import FormField from "../components/FormField";
import Button from "../components/Button";

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";

const HEIGHT = 220 * Layout.ratio;
const DIMENSION = 2000;

export default function login({ navigation }) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showLoading, setShowLoading] = useState(false);

	const login = async () => {
		if (email == '' || password == '') {
			Alert.alert("Error", "Email or password is empty.")
		}
		else {
			setShowLoading(true);
			try {
				const doLogin = await auth().signInWithEmailAndPassword(email, password);
				setShowLoading(false);
				if (doLogin.user) {
					navigation.navigate('home');
				}
			} catch (e) {
				setShowLoading(false);
				Alert.alert(
					e.message
				);
			}
		}
	};
	return (
		<SafeAreaInsetsContext.Consumer>
			{(insets) => (
				<ScrollView style={{ flex: 1, backgroundColor: Theme.bright, }}>
					<View style={styles.curvedHeaderContainer}>
						<LinearGradient
							colors={[Theme.gradient.start, Theme.gradient.end]}
							style={[styles.headerContainer, { paddingTop: insets.top, }]}
						>
							<Image source={require("../assets/img/logo.png")} style={styles.headerLogo} />
							<AppText style={styles.screenTitle}>Welcome</AppText>
						</LinearGradient>
					</View>
					<View style={[
						styles.formContainer,
						{
							paddingTop: HEIGHT + 26 * Layout.ratio,
							paddingBottom: insets.bottom + 20 * Layout.ratio,
						}
					]}>
						<FormField
							style={styles.formField}
							icon={
								<Image
									source={require("../assets/img/mail.png")}
									style={[styles.formFieldIcon, { width: 20 * Layout.ratio }]}
								/>
							}
							secureTextEntry={false}
							onChangeText={setEmail}
							value={email}
							placeholder="Email"
						/>
						<FormField
							style={styles.formField}
							icon={
								<Image
									source={require("../assets/img/password.png")}
									style={styles.formFieldIcon}
								/>
							}
							secureTextEntry={true}
							onChangeText={setPassword}
							value={password}
							placeholder="Password"
						/>
						<Button
							style={styles.submitButton}
							label="Login"
							onPress={() => login()}
						/>
						<View style={styles.horizontalBar} />
						<View style={styles.footerContainer}>
							<AppText style={styles.footerText}>
								Don't have an account?
								</AppText>
							<AppText
								style={styles.footerLink}
								onPress={() => { navigation.navigate('register') }}
							>
								Register here
								</AppText>
						</View>
						<View style={styles.footerContainer}>
							<AppText style={styles.footerText}>
								Forget your Password?
								</AppText>
							<AppText
								style={styles.footerLink}
								onPress={() => { navigation.navigate('reset') }}
							>
								Reset here
								</AppText>
						</View>
					</View>
					{showLoading &&
						<View style={styles.activity}>
							<ActivityIndicator size="large" color="#0000ff" />
						</View>
					}
				</ScrollView>
			)}
		</SafeAreaInsetsContext.Consumer>
	);
}

login.navigationOptions = ({ navigation }) => ({
	title: 'Login',
	headerShown: false,
});

const styles = StyleSheet.create({
	curvedHeaderContainer: {
		position: "absolute",
		alignItems: "center",
		height: DIMENSION,
		width: DIMENSION,
		borderRadius: DIMENSION / 2,
		top: -DIMENSION + HEIGHT,
		left: (Layout.window.width - DIMENSION) / 2,
		paddingTop: DIMENSION - HEIGHT,
		zIndex: 1,
	},
	headerContainer: {
		height: HEIGHT,
		width: Layout.window.width,
		alignItems: "center",
	},
	headerLogo: {
		height: 75 * Layout.ratio,
		width: 75 * Layout.ratio,
		resizeMode: "stretch",
		marginTop: 35 * Layout.ratio,
		marginBottom: 10 * Layout.ratio,
	},
	screenTitle: {
		fontSize: FontSize[30],
		fontWeight: "bold",
		color: Theme.bright,
	},

	formContainer: {
		flex: 1,
		alignItems: "center",
		backgroundColor: Theme.bright,
	},

	formField: {
		alignSelf: "stretch",
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 16 * Layout.ratio,
	},
	formFieldIcon: {
		width: 17 * Layout.ratio,
		resizeMode: "contain",
	},
	socialLoginRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	submitButton: {
		alignSelf: "stretch",
		marginTop: 10 * Layout.ratio,
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 16 * Layout.ratio,
	},

	horizontalBar: {
		alignSelf: "stretch",
		height: 1,
		marginHorizontal: 40 * Layout.ratio,
		marginBottom: 12 * Layout.ratio,
		backgroundColor: Theme.dim,
	},

	footerContainer: {
		flexDirection: "row",
		paddingBottom: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	footerText: {
		fontSize: FontSize[10],
		color: Theme.text,
	},
	footerLink: {
		marginLeft: 4 * Layout.ratio,
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: Theme.primary,
	},
	activity: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
});