import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import ShowError from '../../Components/ShowError';
import ShowSuccess from '../../Components/ShowSuccess';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/base';



const DriverRequestCard = ({ route }) => {

  const navigation = useNavigation();

  const { userName } = route.params;
  const { email } = route.params;
  const { cnic } = route.params;
  const { license } = route.params;

  //Accept Request of Driver
  const requestAccept = (cnic) => {
    const check = [];
    firestore().collection('Drivers').where('cnic', '==', cnic).get().then((snapShot) => {
      snapShot.docs.forEach(doc => {
        check.push(doc.data());
        const ab = doc.id;
        console.log(ab);
        firestore().collection('Drivers').doc(ab).update({ status: true }).then(() => {
          ShowSuccess("Request Accepted");
          console.log(check);
        })
      })
    })
  }
  // Reject Request of Driver
  const requestReject = (cnic) => {

    const check = [];
    firestore().collection('Drivers').where('cnic', '==', cnic).get().then((snapShot) => {
      snapShot.docs.forEach(doc => {
        check.push(doc.data());
        const ab = doc.id;
        console.log(ab);
        firestore().collection('Drivers').doc(ab).update({ status: false })
        ShowError("Request Rejected");
        console.log(check);
      })
    })
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>

          <Image style={styles.Image} source={require('../../..//assets/requestlogo.jpg')} />

          <Text style={{ color: 'black', textAlign: 'center', marginTop: '5%', fontSize: 25 }}>{userName}</Text>

          <Text style={{ color: 'black', marginLeft: '10%', marginTop: '10%', fontWeight: 'bold', fontSize: 20 }}>Email: <Text style={{ fontWeight: '100', fontSize: 18, color: 'black' }}>{email}</Text></Text>

          <Text style={{ color: 'black', marginLeft: '10%', marginTop: '10%', fontWeight: 'bold', fontSize: 20 }}>CNIC: <Text style={{ fontWeight: '100', fontSize: 18, color: 'black' }}>{cnic}</Text></Text>

          <Text style={{ color: 'black', marginLeft: '10%', marginTop: '10%', fontWeight: 'bold', fontSize: 20 }}>License: <Text style={{ fontWeight: '100', fontSize: 18, color: 'black' }}>{license}</Text></Text>

          <View style={{ width: '50%', marginLeft: '25%', marginTop: '10%' }}>
            <Button
            color='primary'
              size='md'
              radius='md'
              title='Verify License'
              onPress={() => Linking.openURL('https://dlims.punjab.gov.pk/verify/')}></Button>
          </View>

          <View style={{ width: '50%', marginLeft: '25%', marginTop: '5%' }}>
            <Button
            color='secondary'
              size='md'
              radius='md'
              title='Verify CNIC'
              onPress={() => navigation.navigate('Cnic Verify', { cnic })}></Button>
          </View>

          <View style={{ width: '50%', marginLeft: '25%', marginTop: '5%' }}>
            <Button
            color='success'
              size='md'
              radius='md'
              title='Accept Request'
              onPress={() => { requestAccept(cnic) }}></Button>
          </View>

          <View style={{ width: '50%', marginLeft: '25%', marginTop: '5%' }}>
            <Button
            color='error'
              size='md'
              radius='md'
              title='Reject Request'
              onPress={() => { requestReject(cnic) }}></Button>
          </View>

        </View>
    </SafeAreaView>
  )
}

export default DriverRequestCard;

const styles = StyleSheet.create({
  Image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    marginTop: '15%',
    marginLeft: '35%'
  },
  text: {
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 17,
  },
  licenseBtn: {
    marginLeft: '25%',
    width: '50%',
    borderRadius: 25,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    backgroundColor: '#00FFFF',
  },
  cnicBtn: {
    marginLeft: '25%',
    width: '50%',
    borderRadius: 25,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: '#7FFFD4',
  },
  acceptBtn: {
    marginLeft: '25%',
    width: '50%',
    borderRadius: 25,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: 'lightgreen',
  },
  rejectBtn: {
    marginLeft: '25%',
    width: '50%',
    borderRadius: 25,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: 'red',
  },
})