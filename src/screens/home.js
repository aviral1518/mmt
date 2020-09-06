import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import AppText from "../components/AppText";
import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";
import auth from '@react-native-firebase/auth';

export default function home({ navigation }) {

  const width = useWindowDimensions().width;
  const height = width * 0.6;

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [active, setActive] = useState(0);

  const images = [
    {
      location: 'New Delhi',
      image: 'https://www.expat.com/upload/guide/1572954339-new-delhi-labour-market-news_item_slider-t1572954339.jpg'
    },
    {
      location: 'Mumbai',
      image: 'https://resize.indiatvnews.com/en/resize/newbucket/715_-/2020/06/mumbai-1591772538.jpg',
    },
    {
      location: 'Bangalore',
      image: 'https://static.toiimg.com/photo/54559212.cms.cms'
    },
    {
      location: 'Chennai',
      image: 'https://www.thehindu.com/news/cities/chennai/jmq8pb/article31937892.ece/ALTERNATES/LANDSCAPE_615/Chennaisecondlockdown'
    },
    {
      location: 'Hyderabad',
      image: 'https://www.indiaeducation.net/imagesvr_ce/260/Hyderabad.jpg'
    },
    {
      location: 'Kolkata',
      image: 'https://img.traveltriangle.com/blog/wp-content/uploads/2017/12/best-things-to-do-in-kolkata-cover-e1586430911433.jpg'
    },
  ];

  const change = ({ nativeEvent }) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return navigation.navigate('login');
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.gradient.start, Theme.gradient.end]}
        style={styles.headerContainer}
      >
        <View style={styles.header}>
          <AppText style={styles.screenTitle}> Hello, {user.email} </AppText>
          <TouchableOpacity
            style={[styles.headerIconContainer, styles.myLogoutContainer]}
            onPress={() => { auth().signOut() }}
          >
            <Image
              source={require("../assets/img/logout.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={change}
        showHorizontalScrollIndicator={false}
        style={{ width, height }}>
        {images.map((item, index) => (
          <Image
            key={index}
            source={{ uri: item.image }}
            style={{ width, height, resizeMode: 'cover' }}
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((item, index) => (
          <Text key={index} style={index == active ? styles.activeDot : styles.dot}>
            •
          </Text>
        ))}
      </View>
    </View>
  );
}

home.navigationOptions = ({ navigation }) => ({
  title: 'Home',
  headerShown: false,
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    justifyContent: "flex-start",
    height: 70 * Layout.ratio,
    paddingHorizontal: 20,
    paddingTop: Layout.statusBarHeight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 10 * Layout.ratio,
    marginTop: 10 * Layout.ratio,
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
    fontSize: FontSize[10],
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
