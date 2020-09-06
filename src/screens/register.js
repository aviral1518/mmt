import React, { useState } from "react";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import {
	StyleSheet,
	ScrollView,
	View,
	Image,
	ActivityIndicator,
	Alert
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AppText from "../components/AppText";
import FormField from "../components/FormField";
import Button from "../components/Button";

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";
import auth from '@react-native-firebase/auth';

export default function register({ navigation }) {

	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [showLoading, setShowLoading] = useState(false);
	const [confirm_password, setConfirm_password] = useState('');

	const register = async () => {
		if (email == '' || name == '' || password == '' || confirm_password == "") {
			Alert.alert('Error', "You've miseed something. Please check. ")
		}
		else if (password != confirm_password) {
			Alert.alert("Error", "Password don't match. Please Try Again ");
		}
		else {
			setShowLoading(true);
			try {
				const doRegister = await auth().createUserWithEmailAndPassword(email, password);
				setShowLoading(false);
				if (doRegister.user) {
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
					<LinearGradient
						colors={[Theme.gradient.start, Theme.gradient.end]}
						style={[styles.headerContainer, { paddingTop: insets.top, }]}
					>
						<AppText style={styles.screenTitle}>Join us!</AppText>
					</LinearGradient>
					<View style={[styles.formContainer, { paddingBottom: insets.bottom + 20 * Layout.ratio }]}>
						<View style={styles.avatarContainer}>
							<Image
								source={require("../assets/img/avatar-placeholder.png")}
								style={styles.defaultAvatar}
							/>
						</View>
						<FormField
							style={styles.formField}
							icon={
								<Image
									source={require("../assets/img/avatar-placeholder.png")}
									style={styles.formFieldIcon}
								/>
							}
							secureTextEntry={false}
							onChangeText={setName}
							value={name}
							placeholder="Full Name"
						/>
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
						<FormField
							style={styles.formField}
							icon={
								<Image
									source={require("../assets/img/password.png")}
									style={styles.formFieldIcon}
								/>
							}
							secureTextEntry={true}
							onChangeText={setConfirm_password}
							value={confirm_password}
							placeholder="Confirm password"
						/>
						<Button
							style={styles.submitButton}
							label="Register"
							onPress={() => register()}
						/>
						<View style={styles.horizontalBar} />
						<View style={styles.footerContainer}>
							<AppText style={styles.footerText}>
								Already a member?
								</AppText>
							<AppText
								style={styles.footerLink}
								onPress={() => { navigation.navigate('login') }}
							>
								Login here
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

register.navigationOptions = ({ navigation }) => ({
	title: 'Register',
	headerShown: false,
});

const styles = StyleSheet.create({
	headerContainer: {
		alignItems: "center",
		height: 190 * Layout.ratio,
	},
	screenTitle: {
		marginTop: 40 * Layout.ratio,
		fontSize: FontSize[30],
		fontWeight: "bold",
		color: Theme.bright,
	},

	formContainer: {
		flex: 1,
		alignItems: "center",
		backgroundColor: Theme.bright,
		marginTop: -16 * Layout.ratio,
		borderTopLeftRadius: 16 * Layout.ratio,
		borderTopRightRadius: 16 * Layout.ratio,
		elevation: 4,
	},

	avatarContainer: {
		height: 130 * Layout.ratio,
		width: 130 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 130 / 2 * Layout.ratio,
		elevation: 4,
		marginTop: -130 / 2 * Layout.ratio,
		marginBottom: 26 * Layout.ratio,
		backgroundColor: Theme.bright,
		overflow: "hidden",
	},
	avatar: {
		height: "100%",
		width: "100%",
		resizeMode: "cover",
	},
	defaultAvatar: {
		height: "90%",
		width: "90%",
		marginTop: "10%",
		resizeMode: "contain",
	},
	uploadButton: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		paddingBottom: 4 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, .7)",
	},
	uploadText: {
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: Theme.bright,
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
	submitButton: {
		alignSelf: "stretch",
		marginTop: 10 * Layout.ratio,
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 16 * Layout.ratio,
	},

	horizontalBar: {
		alignSelf: "stretch",
		height: 1,
		marginHorizontal: 45 * Layout.ratio,
		marginBottom: 12 * Layout.ratio,
		backgroundColor: Theme.dim,
	},

	footerContainer: {
		flexDirection: "row",
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
	footerChevron: {
		marginTop: 2.4,
		marginLeft: 1.5,
		height: 10 * Layout.ratio,
		width: 10 * 500 / 700 * Layout.ratio,
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