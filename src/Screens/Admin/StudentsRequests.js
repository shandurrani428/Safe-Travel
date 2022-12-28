import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';


const StudentsRequests = () => {


  const navigation = useNavigation();

  const [data, setData] = useState([]);

  return (
    <View>
      <Text>StudentsRequests</Text>
    </View>
  )
}

export default StudentsRequests

const styles = StyleSheet.create({})