import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';


const StudentsManage = () => {

  const navigation = useNavigation();

  const [data, setData] = useState([]);

  ////Getting students list
  useEffect(() => {

    let isMounted = true;

    const list = [];
    firestore().collection('Students').get().then((snapShot) => {
      snapShot.docs.forEach(doc => {
        list.push(doc.data());
      })
      if (isMounted) {
        setData([...list]);
      }
    });
    return () => { isMounted = false }
  }, [data])

  return (
    <SafeAreaView style={{ backgroundColor: 'lightgrey' }}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'lightgrey', padding: 20 }}>
      <Searchbar
      style={{marginBottom: 20}}
            placeholder="Search"
          />
        <ScrollView>
          {
            data.map((val) => {
              return (
                <View key={val.email}>
                  <TouchableOpacity style={{ backgroundColor: 'white', height: 150, borderRadius: 30, }}
                    onPress={() => navigation.navigate('Student Manage Card', { userName: val.userName, email: val.email })}>
                    <Image source={require('../../../assets/studentlogo.jpg')} style={{ width: 90, height: 90, borderRadius: 90 / 2, marginLeft: '35%', marginTop: 10 }} />
                    <Text style={{ color: 'black', textAlign: 'center', marginTop: 25, fontWeight: 'bold', fontSize: 16 }}>{val.userName}</Text>
                  </TouchableOpacity>
                  <Text></Text>
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default StudentsManage

const styles = StyleSheet.create({})