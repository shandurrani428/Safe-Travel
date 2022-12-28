import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import { Button } from "@rneui/base";
import ShowSuccess from '../../Components/ShowSuccess';


const RideRequest = ({ route }) => {

  const driverId = route.params;

  const [data, setData] = useState([]);


  useEffect(() => {

    let isMounted = true;

      const list = [];
      firestore().collection('Booking').where('driverId', '==', driverId).where('rideStatus', '==', false).get().then((snapShot) => {
        snapShot.docs.forEach(doc => {
          list.push(doc.data());
        })
        if(isMounted)
        {
          setData([...list]);
        }
      });
      return () => { isMounted = false }
  }, [data])

  /////Accept Ride request of student

  const acceptRide = (studentId) => {

    firestore().collection('Booking').where('studentId', '==', studentId).get().then((snapShot) => {
      snapShot.docs.forEach(doc => {
        const id = doc.id;
        firestore().collection('Booking').doc(id).update({
          rideStatus: true
        }).then(() => {
          ShowSuccess('Request Accepted');
        });
      })
    }).catch(error => { console.log(error) });
  }


  return (
    <SafeAreaView style={{ backgroundColor: 'lightgrey' }}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'lightgrey', padding: 20 }}>
        <ScrollView>
          {
            data.map((val) => {
              return (
                <View key={val.studentId}>
                  <TouchableOpacity style={{ backgroundColor: 'white', height: 170, borderRadius: 30, }}>
                    <Text style={{ color: 'black', textAlign: 'center', marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>{val.studentName}</Text>
                    <Text style={{ color: 'black', marginLeft: 10, marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>Pickup: <Text style={{ fontWeight: '100', fontSize: 12 }}>{val.pickupAddress}</Text></Text>
                    <Text style={{ color: 'black', marginLeft: 10, marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>Dropoff: <Text style={{ fontWeight: '100', fontSize: 12 }}>{val.destAddress}</Text></Text>
                    <View style={{ width: '30%', marginLeft: '35%', marginTop: 10 }}>
                      <Button
                        onPress={() => { acceptRide(val.studentId) }}
                        title='Accept'
                        size='md'
                        color='secondary'
                        radius='md'></Button>
                    </View>
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

export default RideRequest;

const styles = StyleSheet.create({})