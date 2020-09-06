import React from "react";
import {
	View,
	TextInput,
	Image,
	TouchableOpacity,
	StyleSheet
} from "react-native";

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";

class FormField extends React.Component {
	constructor(props) {
		super(props);

		const editable = this.props.editable !== false;
		this.state = {
			editable,
		};
	}

	render() {
		const {
			style,
			icon,
			secureTextEntry = false,
			keyboardType = "default",
			onChangeText,
			value = "",
			placeholder = "",
			toggleToEdit = false,
			theme,
		} = this.props;

		return (
			<View style={[styles.container, style]}>
				<View style={styles.iconContainer}>{icon}</View>
				<TextInput
					style={styles.field}
					keyboardType={keyboardType}
					returnKeyType="done"
					selectionColor={Theme.text + "99"}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={Theme.text}
					value={value}
					secureTextEntry={secureTextEntry}
					underlineColorAndroid="transparent"
					allowFontScaling={false}
					disableFullscreenUI={true}
					editable={this.state.editable}
					onBlur={() => {
						if (toggleToEdit && this.state.editable) this.setState({editable: false,});
					}}
				/>
				{
					toggleToEdit && !this.state.editable &&
					<TouchableOpacity
						onPress={() => this.setState({editable: true,})}
						style={styles.editButton}
					>
						<Image
							source={require("../assets/img/edit.png")}
							style={styles.editIcon}
						/>
					</TouchableOpacity>
				}
			</View>
		);
	}
}

const styles=StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		height: 50 * Layout.ratio,
		borderRadius: 25 * Layout.ratio,
		paddingRight: 16 * Layout.ratio,
		backgroundColor: Theme.medium,
	},
	iconContainer: {
		height: 50 * Layout.ratio,
		width: 40 * Layout.ratio,
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: 10 * Layout.ratio,
	},
	field: {
		fontSize: FontSize[14],
		color: Theme.text,
	},
	editButton: {
		position: "absolute",
		right: 10 * Layout.ratio,
		top: 0,
		height: 50 * Layout.ratio,
		width: 30 * Layout.ratio,
		alignItems: "center",
		justifyContent: "center",
	},
	editIcon: {
		height: 40 * Layout.ratio,
		width: 17 * Layout.ratio,
		resizeMode: "contain",
	},
});

export default FormField;