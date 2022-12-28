import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShowError from '../../Components/ShowError';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { auth } from '../../../config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import ShowSuccess from '../../Components/ShowSuccess';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from "@rneui/base";
import DriverDashboardScreen from './DriverDashboardScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DriverLoginScreen = () => {

    const navigation = useNavigation();

    const [driverId, setDriverId] = useState();

    const [indicator, setIndicator] = useState(false);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    

    useEffect(() => {

        getData();
    }, [])

    const Login = () => {

        if (!email) {
            ShowError('Email required');
            return false;
        }
        if (!password) {
            ShowError('Password required');
            return false;
        }
        else {
            setIndicator(true);
            const id = [];
            const data = [];

            firestore().collection('Drivers').where('email', '==', email.trim()).get().then((snapShot => {
                snapShot.docs.forEach(doc => {
                    id.push(doc.id);
                    data.push(doc.data());
                    var status = null;
                    data.map((val) => { status = val.status});

                    console.log(id);
                    console.log(status);
                    if (id.length > 0) {
                        if (status == true) {
                            signInWithEmailAndPassword(auth, email, password).then((res) => {
                                setIndicator(false);
                                saveData();
                                setEmail('');
                                setPassword('');
                            }).catch((error) => {
                                alert(error);
                                setIndicator(false);
                            });
                        }
                        else {
                            setIndicator(false);
                            ShowError('Your Account is not Activated yet');
                            console.log('Your Account is not Activated yet');
                        }
                    }
                    else {
                        setIndicator(false);
                        ShowError('Invalid Credentials');
                        console.log('Invalid Credentials');
                    }
                })
            }));
        }
    }

    ///Save driver id to AsyncStorage
    const saveData = async () => {
        try {
            const id = auth.currentUser.uid;
            await AsyncStorage.setItem('driver', id);
            navigation.navigate('Driver Dashboard');
            ShowSuccess('Login Successfully');
            console.log('User successfully saved');
        } catch (e) {
            console.log('Failed to save the user to the storage');
        }
    }

    ///Get driver id from AsyncStorage
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('driver');
            console.log(value);
            setDriverId(value);
        } catch (e) {
            console.log('Failed to fetch the user from storage');
        }
    }


    if (!driverId) {
        return (
            <SafeAreaView>
                <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <ScrollView>
                        <Image
                            style={{ width: 100, height: 100, borderRadius: 100 / 2, marginLeft: '35%', marginTop: '20%' }}
                            source={require('../../../assets/driver.png')}
                        />

                        <Text style={{
                            color: '#FF8C00', textAlign: 'center', fontWeight: 'bold', fontSize: 30, fontStyle: 'italic',
                            marginTop: '10%'
                        }}>Driver</Text>

                        <TextInput
                            style={{ color: 'black', fontSize: 16, marginLeft: 35, marginTop: 30, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 30, width: '80%' }}
                            placeholder='Enter email' value={email} onChangeText={(e) => setEmail(e.trim())} />

                        <TextInput
                            secureTextEntry={true}
                            style={{ color: 'black', fontSize: 16, marginLeft: 35, marginTop: 30, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 30, width: '80%' }}
                            placeholder='Enter password' value={password} onChangeText={(e) => setPassword(e.trim())} />

                        <View style={{ width: '40%', marginLeft: '30%', marginTop: 30 }}>
                            <Button
                                title='Login'
                                onPress={Login}
                                radius='md'
                                type='solid'
                                size='md'>
                            </Button>
                        </View>

                        <TouchableOpacity onPress={() => { navigation.navigate('Driver Register') }}>
                            <Text style={{ color: 'black', textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' }}>Don't have an account ?</Text>
                        </TouchableOpacity>

                        <ActivityIndicator style={{ padding: 30 }} size='large'
                            animating={indicator}>
                        </ActivityIndicator>

                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
    else {
        return (
            <DriverDashboardScreen />
        )
    }
}

export default DriverLoginScreen;

const styles = StyleSheet.create({})