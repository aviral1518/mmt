import React, { Component } from 'react';
import {Image, StyleSheet, TouchableOpacity, Text, ScrollView, View} from 'react-native';
import I18n from '../translations/i18n';
import LinearGradient from "react-native-linear-gradient";
import AppText from "../components/AppText";
import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";

// Enable fallbacks if you want `en-US`
// and `en-GB` to fallback to `en`
const language = [
  { lang: "English", code: "en" },
  { lang: "Hindi", code: "hi" },
  { lang: "French", code: "fr" },
  { lang: "Japanese", code: "ja" },
  { lang: "Spanish", code: "es" },
]

export default class extends Component {
  constructor() {
    super();
    this.state = {
      languages: [],
      value: false,
      langValue: "en",
      select: "Select Language",
    }
    this.onLanguage = this.onLanguage.bind(this);
  }
  componentDidMount() {
    //I18n.locale = "fr-CA";

    //*Change language of app according to mobile app*
    // console.log(this.state.languages)
    // getLanguages().then(languages => {
    //   console.log(languages)
    //   this.setState({ languages });
    // });
  }

  onSelectLanguage() {
    return (
      language.map((data, i) => {
        return (
          <View key={i} style={styles.dropDownView}>
            <LinearGradient
              colors={[Theme.gradient.start, Theme.gradient.end]}
              style={styles.buttonContainer}
            >
            <TouchableOpacity onPress={() => this.onSelectedLang(data)}>
              <Text style={styles.dropDownText}>{data.lang}</Text>
            </TouchableOpacity>
            </LinearGradient>
          </View>
        )
      })
    )
  }

  onSelectedLang(text) {
    this.setState({
      value: false,
      select: text.lang,
    }),
      I18n.locale = text.code;
  }
  onLanguage() {
    this.setState({
      value: true,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1, backgroundColor: "white", }}>
          <LinearGradient
            colors={[Theme.gradient.start, Theme.gradient.end]}
            style={styles.headerContainer}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}
                style={styles.headerIconContainer}
              >
                <Image
                  source={require("../assets/img/menu.png")}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
              <AppText style={styles.screenTitle}>{I18n.t('Settings')}</AppText>
            </View>
          </LinearGradient>
          <View>
          <AppText style={styles.text}>{I18n.t('hello world')}</AppText>
          <AppText style={styles.text}>{I18n.t('thank you')}</AppText>
          <AppText style={styles.text}>{I18n.t('Bye')}</AppText>
          <View style={styles.buttonsContainer}>
							<LinearGradient
								colors={[Theme.gradient.start, Theme.gradient.end]}
								style={styles.buttonContainer}
							>
            <TouchableOpacity 
              onPress={this.onLanguage}
              style={styles.buttonResponser}>
                <AppText style={styles.buttonLabel}>{this.state.select}</AppText>
            </TouchableOpacity>
            </LinearGradient>
            </View>
            <View>
              {(this.state.value) ? this.onSelectLanguage() : null}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: "flex-start",
    height: 90 * Layout.ratio,
    paddingHorizontal: 20,
    paddingTop: Layout.statusBarHeight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 30 * Layout.ratio,
    marginTop: 20 * Layout.ratio,
  },
  headerIconContainer: {
    height: 26 * Layout.ratio,
    width: 26 * Layout.ratio,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    height: 26 * Layout.ratio,
    width: 26 * Layout.ratio,
    resizeMode: "contain",
  },
  screenTitle: {
    fontSize: FontSize[30],
    fontWeight: "bold",
    color: Theme.bright,
    marginLeft: 16 * Layout.ratio,
    marginTop: -4,
  },
  text:{
    fontSize: FontSize[20],
    fontWeight: "bold",
    color: Theme.text,
    marginLeft: 140 * Layout.ratio,
    paddingTop:20
  },
  dropDownView: {
    padding: 7,
  },
  dropDownText: {
    //paddingTop: 2,
    color: Theme.bright,
    marginLeft: 180 * Layout.ratio,
  },
  buttonsContainer: {
		flexDirection: "row",
    alignItems: "center",
    padding:30
	},
	buttonContainer: {
		flex: 1,
		height: 35 * Layout.ratio,
		borderRadius: 35 / 2 * Layout.ratio,
	},
	buttonResponser: {
		height: "100%",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonLabel: {
		fontSize: FontSize[14],
		fontWeight: "bold",
		color: Theme.bright,
	},
})