import { StyleSheet, Text, View, Image, Linking } from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import ShowSuccess from '../../Components/ShowSuccess';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/base';


const DriverManageCard = ({ route }) => {

    const navigation = useNavigation();

    
    const {userName} = route.params;
    const {email} = route.params;
    const {cnic} = route.params;
    const {license} = route.params;

    //Delete student by Email
    const deleteDriver = () => {
                firestore().collection('Drivers').where('email', '==', email).get().then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                        const id = doc.id;
                        console.log(id);
                        firestore().collection('Drivers').doc(id).delete();
                        ShowSuccess('Driver deleted successfully!');
                        navigation.goBack();
                    })
                })
    }

  return (
    <SafeAreaView style={{ backgroundColor: 'white'}}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'white'}}>
        
        <Image 
        style={{ height: 100, width: 100, borderRadius: 100/2, marginTop: '10%', marginLeft: '35%'}}
        source={require('../../../assets/driver.png')}/>
        
        <Text style={{ color: 'black', textAlign: 'center', marginTop: '5%', fontSize: 25}}>{userName}</Text>

        <Text style={{ color: 'black', marginLeft: '10%', marginTop: '15%', fontWeight: 'bold', fontSize: 20}}>Email: <Text style={{ color: 'black', fontWeight: '100', fontSize: 18}}>{email}</Text></Text>

        <Text style={{color: 'black', marginLeft: '10%', marginTop: '15%', fontWeight: 'bold', fontSize: 20}}>CNIC: <Text style={{ color: 'black', fontWeight: '100', fontSize: 18}}>{cnic}</Text></Text>
        
        <Text style={{color: 'black', marginLeft: '10%', marginTop: '15%', fontWeight: 'bold', fontSize: 20}}>License: <Text style={{ color: 'black', fontWeight: '100', fontSize: 18}}>{license}</Text></Text>

        <View style={{width: '50%', marginTop: '20%', marginLeft: '25%'}}>
          <Button
          size='md'
          type='solid'
          radius='md'
          title='Delete'
          onPress={() => { deleteDriver(email) }}></Button>
        </View>
      
      </View>
    </SafeAreaView>
  )
}

export default DriverManageCard;

const styles = StyleSheet.create({})