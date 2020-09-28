import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Alert} from 'react-native';
import * as RootNavigation from './RootNavigation';

import {verify} from '../components/FormField';
import realmConnect from '../realm';

function enterUser(user, authenticateUser) {
  realmConnect((realm) => {
    realm.write(() => {
      realm.delete(realm.objects('User'));
      realm.create('User', {email: user.email, password: user.password});

      authenticateUser(user);

      RootNavigation.navigate('Drawer');
    });
  });
}

/*
 * Handles the sign-up process: Inserts user in the database and sets up the redux state for user
 * Returns error if any, otherwise null
 * */
async function signUp(data, authenticateUser) {
  let {
    signInMethod,
    avatarPath,
    name,
    phone,
    email,
    password,
    confirm_password,
  } = data;

  let res = verify.name(name);
  if (res.error) {
    Alert.alert('Invalid name', res.error);
    return res.error;
  }
  name = res.text;

  res = verify.phone(phone, signInMethod);
  if (res.error) {
    Alert.alert('Invalid phone', res.error);
    return res.error;
  }
  phone = res.text;

  res = verify.email(email);
  if (res.error) {
    Alert.alert('Invalid email', res.error);
    return res.error;
  }
  email = res.text;

  if (password !== confirm_password) {
    Alert.alert(
      "Passwords don't match",
      'Make sure to type your password ' + 'correctly in both of the fields.',
    );
    return true;
  }

  try {
    const documentSnapshot = await firestore()
      .collection('Users')
      .doc(email)
      .get();
    if (documentSnapshot.exists) {
      Alert.alert(
        'Email already exists',
        'Another user has already signed up using the same email address. Kindly use another one to continue.',
      );
      return true;
    }

    const nameWords = name.split(' ');
    let nameAbbr;
    if (nameWords.length >= 2) {
      nameAbbr = nameWords[0].charAt(0) + nameWords[1].charAt(0);
    } else {
      nameAbbr = nameWords[0].substring(0, 2);
    }

    await firestore().collection('Users').doc(email).set({
      signInMethod,
      name,
      nameAbbr,
      phone,
      email,
      password,
    });

    console.log('User added to firestore!');

    let avatarSource = '';

    if (avatarPath) {
      const reference = storage().ref(email);
      await reference.putFile(avatarPath);
      console.log('Avatar stored in cloud storage!');
      avatarSource = await reference.getDownloadURL();
      console.log('Avatar source:', avatarSource);
    }

    enterUser(
      {
        signInMethod,
        avatarSource,
        name,
        nameAbbr,
        phone,
        email,
        password,
      },
      authenticateUser,
    );

    return null;
  } catch (e) {
    Alert.alert(
      'Error on creation',
      'An unknown problem occurred while trying to create the account in database',
    );
    console.log(e);
  }

  return true;
}

/*
 * Handles the sign-in process: ISets up the redux state for user if successful,
 *                              otherwise creates new account if user used Social IDs
 * Returns error if any, otherwise null
 * */
async function signIn(data, authenticateUser) {
  let {signInMethod, name, nameAbbr, phone, email, password} = data;

  let res = verify.email(email);
  if (res.error) {
    Alert.alert('Invalid email', res.error);
    return res.error;
  }
  email = res.text;

  try {
    const documentSnapshot = await firestore()
      .collection('Users')
      .doc(email)
      .get();
    if (documentSnapshot.exists) {
      const data = documentSnapshot.data();

      signInMethod = data.signInMethod;
      name = data.name;
      nameAbbr = data.nameAbbr;
      phone = data.phone;

      if (signInMethod === 'EMAIL') {
        const actualPassword = data.password;
        if (password !== actualPassword) {
          Alert.alert(
            "Passwords don't match",
            'Check if the password is typed correctly.',
          );
          return true;
        }
      }

      let avatarSource = '';

      try {
        avatarSource = await storage().ref(email).getDownloadURL();
      } catch (ignore) {
        console.log('User has not set any avatar yet.');
      }

      enterUser(
        {
          signInMethod,
          avatarSource,
          name,
          nameAbbr,
          phone,
          email,
          password,
        },
        authenticateUser,
      );
    } else {
      if (signInMethod === 'EMAIL') {
        Alert.alert('User not found', 'Check if the email is typed correctly.');
        return true;
      } else {
        phone = '';
        password = '';
        const confirm_password = '';

        signUp(
          {
            signInMethod,
            name,
            phone,
            email,
            password,
            confirm_password,
          },
          authenticateUser,
        );
      }
    }

    return null;
  } catch (e) {
    Alert.alert(
      'Error while signing in',
      'An unknown problem occurred while trying to sign-in using the account',
    );
    console.log(e);
  }

  return true;
}

export {signUp, signIn};
