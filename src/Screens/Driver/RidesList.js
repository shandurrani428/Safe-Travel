import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';



const RidesList = ({ route }) => {

  const driverId = route.params;


  const [data, setData] = useState([]);
  const [Pickup, setPickup] = useState();

  ////Getting students list
  useEffect(() => {

    let isMounted = true;

    const list = [];
    firestore().collection('Booking').where('driverId', '==', driverId).where('rideStatus', '==', true).get().then((snapShot) => {
      snapShot.docs.forEach(doc => {
        list.push(doc.data());
        list.map((val) => { setPickup(val.pickupCords) });
      })
      if(isMounted)
      {
        setData([...list]);
      }
    });
    return () => { isMounted = false }
  }, [data])



  return (
    <SafeAreaView style={{ backgroundColor: 'lightgrey' }}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'lightgrey', padding: 20 }}>
        <ScrollView>
          {
            data.map((val) => {
              return (
                <View key={val.studentId}>
                  <TouchableOpacity style={{ backgroundColor: 'white', height: 150, borderRadius: 30, }}>
                    <Text style={{ color: 'black', textAlign: 'center', marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>{val.studentName}</Text>
                    <Text style={{ color: 'black', marginLeft: 10, marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>Pickup: <Text style={{ fontWeight: '100', fontSize: 12 }}>{val.pickupAddress}</Text></Text>
                    <Text style={{ color: 'black', marginLeft: 10, marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>Drop-off: <Text style={{ fontWeight: '100', fontSize: 12 }}>{val.destAddress}</Text></Text>
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

export default RidesList;

const styles = StyleSheet.create({})