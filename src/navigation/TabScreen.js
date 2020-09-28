import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Ant from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import home from '../screens/home';
import mytrips from '../screens/mytrips';
import wallet from '../screens/wallet';
import offers from '../screens/offers';
import tripideas from '../screens/tripideas';

const Tab = createMaterialBottomTabNavigator();

export default function TabScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
    >
      <Tab.Screen
        name="Home"
        component={home}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#6600ff',
          tabBarIcon: ({ color }) => (
            <Ant name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Mytrips"
        component={mytrips}
        options={{
          tabBarLabel: 'My Trips',
          tabBarColor: '#9900cc',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="card-travel" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Offers"
        component={offers}
        options={{
          tabBarLabel: 'Offers',
          tabBarColor: '#663300',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="sale" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Tripideas"
        component={tripideas}
        options={{
          tabBarLabel: 'Trip Ideas',
          tabBarColor: '#d02860',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="tripadvisor" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={wallet}
        options={{
          tabBarLabel: 'Wallet',
          tabBarColor: '#990000',
          tabBarIcon: ({ color }) => (
            <Ant name="wallet" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
