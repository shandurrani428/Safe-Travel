import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/base';
import firestore from '@react-native-firebase/firestore';
import ShowSuccess from '../../Components/ShowSuccess';
import { useNavigation } from '@react-navigation/native';



const ManageVehicle = ({ route }) => {

  const navigation = useNavigation();

  const {regisNo} = route.params;
  const {vehicleType} = route.params;
  const {vehicleColor} = route.params;
  const {vehicleAc} = route.params;
  const {seatCapacity} = route.params;

  const deleteVehicle = () => {

    firestore().collection('Vehicle').where('regisNo', '==', regisNo).get().then((snapShot) => {
      snapShot.docs.forEach(doc => {
        const id = doc.id;
        firestore().collection('Vehicle').doc(id).delete();
        ShowSuccess('Vehicle removed successfully ');
        navigation.goBack();
      })
    })
  }


  return (
    <SafeAreaView style={{ backgroundColor: 'white'}}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'white'}}>

      <Image 
        style={{ height: 100, width: 100, borderRadius: 100/2, marginTop: '10%', marginLeft: '35%'}}
        source={require('../../../assets/car1.jpg')}/>

        <Text style={{ color: 'black', textAlign: 'center', marginTop: '5%', fontSize: 20}}>{regisNo}</Text>

        <Text style={{ color: 'black', marginLeft: '10%', marginTop: '15%', fontWeight: 'bold', fontSize: 20}}>Type: <Text style={{ fontWeight: '100', fontSize: 18}}>{vehicleType}</Text></Text>

         <Text style={{ color: 'black', marginLeft: '10%', marginTop: '15%', fontWeight: 'bold', fontSize: 20}}>Color: <Text style={{ fontWeight: '100', fontSize: 18}}>{vehicleColor}</Text></Text> 

         <Text style={{ color: 'black', marginLeft: '10%', marginTop: '15%', fontWeight: 'bold', fontSize: 20}}>Ac/Non-Ac: <Text style={{ fontWeight: '100', fontSize: 18}}>{vehicleAc}</Text></Text>        

         <Text style={{ color: 'black', marginLeft: '10%', marginTop: '15%', fontWeight: 'bold', fontSize: 20}}>Seat's Capacity: <Text style={{ fontWeight: '100', fontSize: 18}}>{seatCapacity}</Text></Text> 

         <View style={{width: '50%', marginTop: '20%', marginLeft: '25%'}}>
          <Button
          color='error'
          size='md'
          type='solid'
          radius='md'
          title='Remove'
          onPress={() => {deleteVehicle()}}
          ></Button>
        </View>

      </View>
    </SafeAreaView>
  )
}

export default ManageVehicle;

const styles = StyleSheet.create({})