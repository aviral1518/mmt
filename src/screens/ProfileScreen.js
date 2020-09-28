import React from "react";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import {
	ScrollView,
	View,
	Image,
	Alert,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from '@react-native-firebase/storage';
import AppText from "../components/AppText";
import FormField from "../components/FormField";
import Button from "../components/Button";
import UserAvatar from "../components/UserAvatar";

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";

const HEIGHT = 300 * Layout.ratio;
const DIMENSION = 2000;

class ProfileScreen extends React.Component {
	constructor(props) {
		super(props);

		const {
			user,
		} = this.props;

		this.state = {
			realm: null,
			avatarSource: user.avatarSource,
			avatarPath: '',
            name: user.name,
			phone: user.phone,
			email: user.email,
			password: user.password,
            processing: false,
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
	}

	async handleUpdate() {
		const {
			user, authenticateUser,
		} = this.props;

		try {
            this.setState({ processing: true });
            await firestore()
                .collection("Users")
                .doc(user.email)
                .update({
                    name: this.state.name,
                    phone: this.state.phone,
				});
				
				let {avatarSource, avatarPath} = this.state;

				if (avatarPath) {
					const reference = storage().ref(user.email);
					await reference.putFile(avatarPath);
					console.log('Avatar stored in cloud storage!');
					avatarSource = await reference.getDownloadURL();
					console.log('Avatar source:', avatarSource);
				  }

            authenticateUser({
                ...user,
                avatarSource,
                name: this.state.name,
                phone: this.state.phone,
            });

            this.setState({ processing: false });
            Alert.alert("Success", "Profile information updated successfully!");
		}
		catch (e) {
			Alert.alert("Error while updating profile",
				"An unknown problem occurred while trying to update profile information");
			console.log(e);
            this.setState({ processing: false });
        }
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

	render() {
		const {
			user
		} = this.props;
		return (
			<SafeAreaInsetsContext.Consumer>
				{(insets) => (
					<ScrollView style={{ flex: 1, backgroundColor: Theme.bright, }}>
						<View style={styles.curvedHeaderContainer}>
							<LinearGradient
								colors={[Theme.gradient.start, Theme.gradient.end]}
								style={[styles.headerContainer, { paddingTop: insets.top, }]}
							>
								<TouchableOpacity
									style={styles.backButton}
									onPress={() => this.props.navigation.goBack()}
								>
									<Image source={require("../assets/img/back.png")} style={styles.backIcon}/>
								</TouchableOpacity>
								<View style={styles.avatarContainer}>
									<UserAvatar
										avatarSource={this.state.avatarSource}
										style={styles.avatar}
										dimension={130 * Layout.ratio}
									/>
                                    {
                                        user.signInMethod === "EMAIL" &&
										<TouchableOpacity
											style={styles.uploadButton}
											onPress={() => this.handleImageUpload()}
										>
											<AppText style={styles.uploadText}>Change</AppText>
										</TouchableOpacity>
                                    }
								</View>
								<AppText style={styles.name}>{this.state.name}</AppText>
								<AppText style={styles.email}>{this.state.email}</AppText>
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
										source={require("../assets/img/avatar-placeholder.png")}
										style={[styles.formFieldIcon, { width: 20 * Layout.ratio }]}
									/>
								}
								secureTextEntry={false}
								onChangeText={(text) => this.setState({ name: text })}
								value={this.state.name}
								placeholder="Full Name"
								editable={false}
								toggleToEdit={user.signInMethod === "EMAIL"}
							/>
							<FormField
								style={styles.formField}
								icon={
									<Image
										source={require("../assets/img/phone.png")}
										style={[styles.formFieldIcon, { width: 20 * Layout.ratio }]}
									/>
								}
								secureTextEntry={false}
								onChangeText={(text) => this.setState({ phone: text })}
								value={this.state.phone}
								keyboardType="number-pad"
								placeholder="Phone no."
								editable={false}
								toggleToEdit={user.signInMethod === "EMAIL"}
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
								editable={false}
							/>
							{
								user.signInMethod === "EMAIL" &&
								<Button
									style={styles.submitButton}
									label="Update"
									onPress={() => this.handleUpdate()}
									processing={this.state.processing}
								/>
							}
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

const styles=StyleSheet.create({
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
	},
	backButton: {
		alignSelf: "flex-start",
		marginTop: 20 * Layout.ratio,
		marginLeft: 20 * Layout.ratio,
	},
	backIcon: {
		height: 20 * Layout.ratio,
		width: 24 * Layout.ratio,
	},

	avatarContainer: {
		alignSelf: "center",
		height: 130 * Layout.ratio,
		width: 130 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 130 / 2 * Layout.ratio,
		elevation: 4,
		marginBottom: 16 * Layout.ratio,
		backgroundColor: Theme.primary,
		overflow: "hidden",
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

	name: {
		alignSelf: "center",
		fontSize: FontSize[22],
		color: Theme.bright,
		marginBottom: 5 * Layout.ratio,
	},
	email: {
		alignSelf: "center",
		fontSize: FontSize[16],
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
		backgroundColor: Theme.medium,
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
	activity: {
		//position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	footerLink: {
		marginLeft: 4 * Layout.ratio,
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: Theme.primary,
	},
});

export default bind(ProfileScreen);