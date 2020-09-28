import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Image, TouchableOpacity,StyleSheet,Alert } from "react-native";

import AppText from "../components/AppText";
import Layout from "../constants/Layout";
import FontSize from "../constants/FontSize";
import UserAvatar from "../components/UserAvatar";
import realmConnect from "../realm";
import bind from "../redux/bind";
import Theme from '../constants/Theme';
import TabScreen from './TabScreen';
import settings from '../screens/settings';
import support from "../screens/support";

const Drawer = createDrawerNavigator();

const CustomDrawerSidebar = bind((props) => {
	const {
		state,
		navigation,
		descriptors,
		progress,
		user,
		authenticateUser
	} = props;
	const { routes, index } = state;
	const routeName = routes[index].name;

	return (
		<View style={styles.drawerContainer}>
			<TouchableOpacity
				onPress={() => navigation.push("Profile")}
				style={styles.drawerHeader}
			>
				<View style={styles.headerLeft}>
					<UserAvatar
						style={styles.avatar}
						dimension={60 * Layout.ratio}
					/>
				</View>
				<View style={styles.headerRight}>
					<AppText
						style={styles.name}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						Hi, {user.name}
					</AppText>
					<AppText
						style={styles.email}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{user.email}
					</AppText>
				</View>
			</TouchableOpacity>

			<View style={styles.horizontalBar}/>

			<TouchableOpacity
				style={ styles.itemContainer}
				onPress={() => navigation.navigate("Mytrips")}
			>
				<View style={styles.itemIconContainer}>
					<Image
						source={
							require("../assets/img/trip.png")
						}
						style={[styles.itemIcon]}
					/>
				</View>
				<AppText style={styles.itemLabel}>View/Manage Trips</AppText>
			</TouchableOpacity>
			
			<View style={styles.horizontalBar}/>

			<TouchableOpacity
				style={ styles.itemContainer}
				onPress={() => navigation.jumpTo("Setting")}
			>
				<View style={styles.itemIconContainer}>
					<Image
						source={
							require("../assets/img/settings.png")
						}
						style={[styles.itemIcon]}
					/>
				</View>
				<AppText style={styles.itemLabel}>Settings</AppText>
			</TouchableOpacity>

			<View style={styles.horizontalBar}/>

			<TouchableOpacity
				style={ styles.itemContainer}
				onPress={() => navigation.jumpTo("Support")}
			>
				<View style={styles.itemIconContainer}>
					<Image
						source={
							require("../assets/img/support.png")
						}
						style={[styles.itemIcon]}
					/>
				</View>
				<AppText style={styles.itemLabel}>Help and Support</AppText>
			</TouchableOpacity>

			<View style={styles.horizontalBar}/>

			<TouchableOpacity
				style={styles.itemContainer}
				onPress={() => {
					const userEmail = user.email;
					realmConnect(realm => {
						realm.write(() => {
							realm.delete(realm.objects("User"));
						});
					});
					authenticateUser({
						signInMethod: "EMAIL",
						avatarSource: "",
						name: "",
						nameAbbr: "",
						phone: "",
						email: "",
						password: "",
					});
					Alert.alert("Logout","You've been Logout.");
					setTimeout(() => navigation.navigate("Authentication"), 500);
				}}
			>
				<View style={styles.itemIconContainer}>
					<Image
						source={require("../assets/img/logout.png")}
						style={[styles.itemIcon, styles.logoutIcon]}
					/>
				</View>
				<AppText style={styles.itemLabel}>Log out</AppText>
			</TouchableOpacity>
		</View>
	);
});

export default function DrawerScreen({ navigation, route }) {
	return (
		<Drawer.Navigator
			initialRouteName="Tab"
			backBehavior="initialRoute"
			drawerPosition="left"
			drawerType="front"
			lazy={true}
			hideStatusBar={false}
			drawerStyle={{
				width: "80%",
			}}
			drawerContent={(props) => <CustomDrawerSidebar {...props}/>}
		>
			<Drawer.Screen name="Tab" component={TabScreen}/>
			<Drawer.Screen name="Setting" component={settings}/>
			<Drawer.Screen name="Support" component={support}/>
		</Drawer.Navigator>
	);
}

const styles=StyleSheet.create({
	drawerContainer: {
		flex: 1,
		paddingVertical: 24 * Layout.ratio,
		paddingHorizontal: 20,
		backgroundColor: Theme.bright,
	},
	drawerHeader: {
		flexDirection: "row",
		marginBottom: 24 * Layout.ratio,
	},
	headerLeft: {
		alignSelf: "stretch",
		justifyContent: "flex-start",
	},
	avatar: {
		marginRight: 16 * Layout.ratio,
	},
	headerRight: {
		flex: 1,
		alignSelf: "stretch",
		justifyContent: "flex-start",
	},
	name: {
		fontSize: FontSize[22],
		fontWeight: "bold",
		color: Theme.text,
	},
	email: {
		fontSize: FontSize[13],
		color: Theme.text,
	},

	horizontalBar: {
		alignSelf: "stretch",
		height: 1,
		marginBottom: 20 * Layout.ratio,
		backgroundColor: Theme.dim,
	},

	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 50 * Layout.ratio,
		borderRadius: 5 * Layout.ratio,
		marginBottom: 8 * Layout.ratio,
	},
	itemContainerSelected: {
		backgroundColor: Theme.primary + "25",
	},
	itemIconContainer: {
		height: "100%",
		width: 60 * Layout.ratio,
		alignItems: "center",
		justifyContent: "center",
	},
	itemIcon: {
		width: 32 * Layout.ratio,
		resizeMode: "contain",
	},
	logoutIcon: {
		width: 38,
		marginLeft: 6,
	},
	itemLabel: {
		fontSize: FontSize[20],
		fontWeight: "bold",
		color: Theme.text,
	}
});