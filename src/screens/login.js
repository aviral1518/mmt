import React from "react";
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
import AppText from "../components/AppText";
import FormField from "../components/FormField";
import Button from "../components/Button";

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";
import bind from "../redux/bind";
import { signIn } from "../helpers/authentication";

const HEIGHT = 220 * Layout.ratio;
const DIMENSION = 2000;

class login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			processing: false,
		};
	}

	async handleLogin(info) {
		const {
			authenticateUser,
		} = this.props;

		const data = {
			...this.state,
			...info,
		};

		this.setState({ processing: true });
		await signIn(data, authenticateUser, this.props.navigation);
		this.setState({ processing: false });
	}

	render() {
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
								onChangeText={(text) => this.setState({ email: text })}
								value={this.state.email}
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
								onChangeText={(text) => this.setState({ password: text })}
								value={this.state.password}
								placeholder="Password"
							/>
							<Button
								style={styles.submitButton}
								label="Login"
								onPress={() => this.handleLogin({ signInMethod: "EMAIL" })}
							/>
							<View style={styles.horizontalBar} />
							<View style={styles.footerContainer}>
								<AppText style={styles.footerText}>
									Don't have an account?
									</AppText>
								<AppText
									style={styles.footerLink}
									onPress={() => { this.props.navigation.jumpTo('Register') }}
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
									onPress={() => { this.props.navigation.jumpTo('Reset') }}
								>
									Reset here
								</AppText>
							</View>
						</View>
						{this.state.processing &&
							<View style={styles.activity}>
								<ActivityIndicator size="large" color="#0000ff" />
							</View>
						}
					</ScrollView>
				)}
			</SafeAreaInsetsContext.Consumer>
		);
	}
}

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
		//position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
});

export default bind(login);