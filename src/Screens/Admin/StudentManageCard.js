import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import ShowSuccess from '../../Components/ShowSuccess';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@rneui/base';

const StudentManageCard = ({ route }) => {

    const navigation = useNavigation();
  
    const {userName} = route.params;
    const {email} = route.params;

    //Delete student by Email
    const deleteStudent = () => {
                firestore().collection('Students').where('email', '==', email).get().then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                        const id = doc.id;
                        console.log(id);
                        firestore().collection('Students').doc(id).delete();
                        ShowSuccess('Student deleted successfully!');
                        navigation.goBack();
                    })
                })
    }

  return (
    <SafeAreaView style={{ backgroundColor: 'white'}}>
    <View style={{ height: '100%', width: '100%', backgroundColor: 'white'}}>
      
      <Image 
      style={{ height: 100, width: 100, borderRadius: 100/2, marginTop: '10%', marginLeft: '35%'}}
      source={require('../../../assets/studentlogo.jpg')}/>
      
      <Text style={{ color: 'black', marginTop: '5%', fontSize: 20, textAlign: 'center'}}>{userName}</Text>

      <Text style={{ color: 'black', marginLeft: '10%', marginTop: '15%', fontWeight: 'bold', fontSize: 20}}>Email: <Text style={{ fontWeight: '100', fontSize: 18}}>{email}</Text></Text>

      <View style={{width: '50%', marginTop: '20%', marginLeft: '25%'}}>
        <Button
        size='md'
        type='solid'
        radius='md'
        title='Delete'
        onPress={() => { deleteStudent(email) }}></Button>
      </View>
    
    </View>
  </SafeAreaView>
  )
}

export default StudentManageCard;

const styles = StyleSheet.create({})