import React from "react";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import {
	StyleSheet,
	ScrollView,
	View,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	Alert
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AppText from "../components/AppText";
import ImagePicker from "react-native-image-picker";
import FormField from "../components/FormField";
import Button from "../components/Button";
import auth from '@react-native-firebase/auth';
import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";
import bind from "../redux/bind";
import { signUp } from "../helpers/authentication";

class register extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			avatarSource: "",
			avatarPath: '',
			name: "",
			phone: "",
			email: "",
			password: "",
			confirm_password: "",
			processing: false,
		};

		this.handleImageUpload = this.handleImageUpload.bind(this);
	}

	handleImageUpload() {
		ImagePicker.showImagePicker({
			title: "Select Avatar",
			tintColor: Theme.text,
			storageOptions: {
				privateDirectory: true, // Used the Storage/android/data directory to private store images
			},
		}, (response) => {
			console.log("Response = ", response);

			if (response.didCancel) {
				console.log("User cancelled image picker");
			}
			else if (response.error) {
				console.log("ImagePicker Error: ", response.error);
				Alert.alert("Error", "Failed to pick image.");
			}
			else {
				this.setState({
					avatarPath: response.path,
            		avatarSource: response.uri,
				});
			}
		});
	}

	async handleRegister() {
		const {
			authenticateUser,
		} = this.props;

		const signInMethod = "EMAIL";

		const data = {
			...this.state,
			signInMethod,
		};

		this.setState({ processing: true });
		auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
        await signUp(data, authenticateUser, this.props.navigation);
		this.setState({ processing: false });
	}

	render(){
		return (
			<SafeAreaInsetsContext.Consumer>
				{(insets) => (
					<ScrollView style={{ flex: 1, backgroundColor: Theme.bright, }}>
						<LinearGradient
							colors={[Theme.gradient.start, Theme.gradient.end]}
							style={[styles.headerContainer, { paddingTop: insets.top, }]}
						>
							<AppText style={styles.screenTitle}>Register</AppText>
						</LinearGradient>
						<View style={[styles.formContainer, { paddingBottom: insets.bottom + 20 * Layout.ratio }]}>
							<View style={styles.avatarContainer}>
								{this.state.avatarSource ?
									<Image
										source={{ uri: this.state.avatarSource}}
										style={styles.avatar}
									/> :
									<Image
										source={require("../assets/img/avatar-placeholder.png")}
										style={styles.defaultAvatar}
									/>
								}
								<TouchableOpacity
									style={styles.uploadButton}
									onPress={() => this.handleImageUpload()}
								>
									<AppText style={styles.uploadText}>Add Photo</AppText>
								</TouchableOpacity>
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
								onChangeText={(text) => this.setState({ name: text })}
								value={this.state.name}
								placeholder="Full Name"
							/>
							<FormField
								style={styles.formField}
								icon={
									<Image
										source={require("../assets/img/phone.png")}
										style={styles.formFieldIcon}
									/>
								}
								keyboardType="number-pad"
								secureTextEntry={false}
								onChangeText={(text) => this.setState({ phone: text })}
								value={this.state.phone}
								placeholder="Phone no."
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
							<FormField
								style={styles.formField}
								icon={
									<Image
										source={require("../assets/img/password.png")}
										style={styles.formFieldIcon}
									/>
								}
								secureTextEntry={true}
								onChangeText={(text) => this.setState({ confirm_password: text })}
								value={this.state.confirm_password}
								placeholder="Confirm password"
							/>
							<Button
								style={styles.submitButton}
								label="Register"
								onPress={() => this.handleRegister()}
							/>
							<View style={styles.horizontalBar} />
							<View style={styles.footerContainer}>
								<AppText style={styles.footerText}>
									Already a member?
								</AppText>
								<AppText
									style={styles.footerLink}
									onPress={() => { this.props.navigation.jumpTo('Login') }}
								>
									Login here
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
	headerContainer: {
		alignItems: "center",
		height: 210 * Layout.ratio,
	},
	screenTitle: {
		marginTop: 30 * Layout.ratio,
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
		paddingBottom: 5 * Layout.ratio,
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
		//position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
});

export default bind(register);