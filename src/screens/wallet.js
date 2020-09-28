import React from 'react';
import LinearGradient from "react-native-linear-gradient";
import AppText from "../components/AppText";
import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";
import {
    View,
    Text,
    ScrollView,
    Image,
    useWindowDimensions,
    StyleSheet,
    TouchableOpacity
  } from 'react-native';

const wallet=({navigation})=>{
    const width = useWindowDimensions().width;
    const height = width * 0.6;

    return(
            <View style={styles.container}>
              <LinearGradient
                colors={[Theme.gradient.start, Theme.gradient.end]}
                style={styles.headerContainer}
              >
                <View style={styles.header}>
                <TouchableOpacity
                      onPress={() => navigation.navigate('Home')}
                      style={styles.headerIconContainer}
                    >
                      <Image
                        source={require("../assets/img/back.png")}
                        style={styles.headerIcon}
                      />
                    </TouchableOpacity>
                  <AppText style={styles.screenTitle}> My Wallet </AppText>
                </View>
              </LinearGradient>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1
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
      marginTop: 15 * Layout.ratio,
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
    myLogoutContainer: {
      marginLeft: "auto",
    },
    screenTitle: {
      fontSize: FontSize[20],
      fontWeight: "bold",
      color: Theme.bright,
      marginLeft: 16 * Layout.ratio,
      marginTop: -4,
    },
    pagination: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: -15,
      alignSelf: 'center',
    },
    dot: {
      color: '#888',
      fontSize: 50,
    },
    activeDot: {
      color: '#FFF',
      fontSize: 50,
    },
  });
  

export default wallet;