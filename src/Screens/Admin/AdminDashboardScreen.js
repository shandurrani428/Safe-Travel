import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../config';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from '@rneui/base';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';


const AdminDashboardScreen = () => {


  const navigation = useNavigation();

  const [notification, setNotification] = useState([]);

  useEffect(() => {

    const list = [];
    firestore().collection('Drivers').where('status', '==', false).get().then((snapShot) => {
      snapShot.docs.forEach(doc => {
        list.push(doc.data());
      })
      setNotification([...list]);
    })
  }, [notification])

  const Logout = () => {

    signOut(auth).then(() => {
      navigation.navigate('Admin Login');
      navigation.goBack();
      console.log('Logout Successfully');
      console.log(auth);
      removeData();
    }).catch(error => {
      console.log(error);
    });
  }

  ///Remove admin id from AsyncStorage
  const removeData = async () => {

    try {
      const value = await AsyncStorage.removeItem('admin');
      console.log('User successfully remove from storage');
      console.log(value);
    } catch (e) {
      console.log('Failed to remove the user from storage');
    }
  }

  return (
    <SafeAreaView>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
        <ScrollView>

          <Header
            leftComponent={
              <Image source={require('../../../assets/user.png')}
                style={{ width: 35, height: 35, borderRadius: 35 / 2, }}>
                </Image>
            }
            centerComponent={
              <Text style={{ color: 'white', marginTop: 10, fontWeight: 'bold', fontSize: 18 }}>Admin</Text>
            }
            rightComponent={
              <TouchableOpacity onPress={() => { Logout() }}>
                <Image source={require('../../../assets/logout.png')}
                  style={{ width: 30, height: 30, borderRadius: 30 / 2 }} />
              </TouchableOpacity>
            }
          />


          <View style={{ height: 150, width: '45%', backgroundColor: 'lightblue', marginTop: 80, marginLeft: 10, borderRadius: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Students Manage') }}>
              <Image
                style={{ width: 80, height: 80, borderRadius: 80 / 2, resizeMode: 'contain', marginLeft: 45, marginTop: 15 }}
                source={require("../../../assets/studentlogo.jpg")}
              />
              <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Student's Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 150, width: '45%', backgroundColor: 'pink', marginLeft: 190, marginTop: -150, borderRadius: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Students Requests') }}>
              <Image
                style={{ width: 80, height: 80, borderRadius: 80 / 2, resizeMode: 'contain', marginLeft: 45, marginTop: 15 }}
                source={require("../../../assets/requestlogo.jpg")}
              />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Student Request's</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 150, width: '45%', backgroundColor: '#ADFF2F', marginLeft: 10, marginTop: 80, borderRadius: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Drivers Manage') }}>
              <Image
                style={{ width: 80, height: 80, borderRadius: 80 / 2, resizeMode: 'contain', marginLeft: 45, marginTop: 15 }}
                source={require("../../../assets/driver.png")}
              />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Driver's Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 150, width: '45%', backgroundColor: '#00FF7F', marginLeft: 190, marginTop: -150, borderRadius: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Drivers Requests') }}>
            {
              notification.length > 0 ?
              <Image
              style={{ width: 20, height: 20, borderRadius: 20/2, resizeMode: 'contain', marginLeft: 5,}}
              source={require("../../../assets/notification.jpg")}/>
              : <Text></Text>
             }
              <Image
                style={{ width: 80, height: 80, borderRadius: 80 / 2, resizeMode: 'contain', marginLeft: 45, marginTop: -3 }}
                source={require("../../../assets/requestlogo.jpg")}
              />
              <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Driver Request's</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </View>
    </SafeAreaView>
  )
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({});
