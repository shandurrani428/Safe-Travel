import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../config';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from '@rneui/base';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';


const DriverDashboardScreen = () => {

  const navigation = useNavigation();

  const [notification, setNotification] = useState([]);


  useEffect(() => {

    getData();
  }, [notification])

  ///Get driver id from AsyncStorage
  const [driverId, setDriverId] = useState();
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('driver');
      setDriverId(value);

      const list = [];
      firestore().collection('Booking').where('driverId', '==', value)
        .where('rideStatus', '==', false).get().then((snapShot) => {
          snapShot.docs.forEach(doc => {
            list.push(doc.data());
          })
          setNotification([...list]);
        })
    } catch (e) {
      console.log('Failed to fetch the user from storage');
    }
  }

  const [userName, setUserName] = useState();
  const getName = () => {
    const list2 = [];
    firestore().collection('Drivers').doc(driverId).get().then(doc => {
      list2.push(doc.data());
      list2.map((val) => { setUserName(val.userName) });
    })
  }

  const Logout = () => {

    signOut(auth).then(() => {
      navigation.navigate('Driver Login');
      console.log('Logout Successfully');
      console.log(auth);
      navigation.goBack();
      removeData();
    }).catch(error => {
      console.log(error);
    });
  }

  ///Remove driver id from AsyncStorage
  const removeData = async () => {

    try {
      const value = await AsyncStorage.removeItem('driver');
      console.log('User successfully remove from storage');
      console.log(value);
    } catch (e) {
      console.log('Failed to remove the user from storage');
    }
  }


  return (
    <SafeAreaView>
      {
        getName()
      }
      <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
        <ScrollView>

          <Header
            leftComponent={
              <Image source={require('../../../assets/user.png')}
                style={{ width: 35, height: 35, borderRadius: 35 / 2, }} />
            }
            centerComponent={
              <Text style={{ color: 'white', marginTop: 10, fontWeight: 'bold', fontSize: 18 }}>{userName}</Text>
            }
            rightComponent={
              <TouchableOpacity onPress={() => { Logout() }}>
                <Image source={require('../../../assets/logout.png')}
                  style={{ width: 30, height: 30, borderRadius: 30 / 2 }} />
              </TouchableOpacity>
            }
          ></Header>


          <View style={{ height: 150, width: '45%', backgroundColor: 'lightblue', marginTop: 80, marginLeft: 10, borderRadius: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Rides List', driverId) }}>
              <Image
                style={{ width: 80, height: 80, borderRadius: 80 / 2, resizeMode: 'contain', marginLeft: 45, marginTop: 15 }}
                source={require("../../../assets/studentlogo.jpg")}
              />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Total Booking's</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 150, width: '45%', backgroundColor: 'pink', marginLeft: 190, marginTop: -150, borderRadius: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Ride Request', driverId) }}>
              {
                notification.length > 0 ?
                  <Image
                    style={{ width: 20, height: 20, borderRadius: 20 / 2, resizeMode: 'contain', marginLeft: 5, }}
                    source={require("../../../assets/notification.jpg")} />
                  : <Text></Text>
              }
              <Image
                style={{ width: 80, height: 80, borderRadius: 80 / 2, resizeMode: 'contain', marginLeft: 45, marginTop: -3 }}
                source={require("../../../assets/riderlogo.png")}
              />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Ride Request's</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 150, width: '45%', backgroundColor: '#ADFF2F', marginLeft: 10, marginTop: 80, borderRadius: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Add Vehicle', driverId) }}>
              <Image
                style={{ width: 80, height: 80, borderRadius: 80 / 2, resizeMode: 'contain', marginLeft: 45, marginTop: 15 }}
                source={require("../../../assets/car1.jpg")}
              />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Add Vechile</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 150, width: '45%', backgroundColor: '#00FF7F', marginLeft: 190, marginTop: -150, borderRadius: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Live Tracking', driverId) }}>
              <Image
                style={{ width: 80, height: 80, borderRadius: 80 / 2, resizeMode: 'contain', marginLeft: 45, marginTop: 15 }}
                source={require("../../../assets/greenIndicator.png")}
              />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Start Ride</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </View>
    </SafeAreaView>
  )
}

export default DriverDashboardScreen;

const styles = StyleSheet.create({})