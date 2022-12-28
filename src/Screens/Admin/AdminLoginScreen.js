import { StyleSheet, Text, TextInput, View, Image, ActivityIndicator } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminDashboardScreen from './AdminDashboardScreen';



const AdminLoginScreen = () => {


    const navigation = useNavigation();

    const [adminId, setAdminId] = useState();

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
            const data = [];
            firestore().collection('Admin').where('email', '==', email).get().then((snapShot => {
                snapShot.docs.forEach(doc => {
                    data.push(doc.id);
                })
                if (data.length > 0) {
                    signInWithEmailAndPassword(auth, email, password).then(() => {
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
                    ShowError('Invalid Credentials');
                    console.log('Invalid Credentials');
                }
            }));
        }
    }

    ///Save admin id to AsyncStorage
    const saveData = async () => {
        try {
            const id = auth.currentUser.uid;
            await AsyncStorage.setItem('admin', id);
            navigation.navigate('Admin Dashboard');
            ShowSuccess('Login Successfully');
            console.log('User successfully saved');
        } catch (e) {
            console.log('Failed to save the user to the storage');
        }
    }

    ///Get admin id from AsyncStorage
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('admin');
            console.log(value);
            setAdminId(value);
        } catch (e) {
            console.log('Failed to fetch the user from storage');
        }
    }


    if (!adminId) {
        return (
            <SafeAreaView>
                <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <ScrollView>
                        <Image
                            style={{ width: 100, height: 100, borderRadius: 100 / 2, marginLeft: '35%', marginTop: '20%' }}
                            source={require('../../../assets/adminlogo.jpg')}
                        />

                        <Text style={{
                            color: 'red', textAlign: 'center', fontWeight: 'bold', fontSize: 30, fontStyle: 'italic',
                            marginTop: '10%'
                        }}>Admin</Text>

                        <TextInput
                            style={{color: 'black', fontSize: 16, marginLeft: 35, marginTop: 30, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 30, width: '80%' }}
                            placeholder='Enter email' value={email} onChangeText={(e) => setEmail(e.trim())} />

                        <TextInput
                            secureTextEntry={true}
                            style={{ color: 'black', fontSize: 16, marginLeft: 35, marginTop: 30, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 30, width: '80%' }}
                            placeholder='Enter password' value={password} onChangeText={(e) => setPassword(e.trim())} />

                        <View style={{ width: '40%', marginLeft: '30%', marginTop: 30 }}>
                            <Button
                                title='Login'
                                onPress={() => { Login() }}
                                radius='md'
                                type='solid'
                                size='md'
                            >
                            </Button>
                        </View>

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
            <AdminDashboardScreen />
        )
    }
}

export default AdminLoginScreen;

const styles = StyleSheet.create({})