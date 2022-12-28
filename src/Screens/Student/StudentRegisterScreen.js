import { StyleSheet, Text, TextInput, View, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShowError from '../../Components/ShowError';
import ShowSuccess from '../../Components/ShowSuccess';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from "@rneui/base";


const StudentRegisterScreen = () => {

    const navigation = useNavigation();

    const [indicator, setIndicator] = useState(false);

    const [userName, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [cPassword, setCpassword] = useState();

    const Register = () => {

        if (!userName) {
            ShowError('Username required');
            return false;
        }
        if (!email) {
            ShowError('Email required');
            return false;
        }
        if (!password) {
            ShowError('Password required');
            return false;
        }
        if (!cPassword) {
            ShowError('Confirm password required');
            return false;
        }
        if (password !== cPassword) {
            ShowError('Password not match');
            return false;
        }
        else {
            setIndicator(true);
            createUserWithEmailAndPassword(auth, email, password).then((cred) => {
                firestore().collection('Students').doc(cred.user.uid).set({
                    userName: userName,
                    email: email.trim(),
                    userType: 'student'
                })
                setIndicator(false);
                console.log('Register Successfully');
                ShowSuccess('Register Successfully');
                setUsername('');
                setEmail('');
                setPassword('');
                setCpassword('');
                navigation.navigate('Student Login');
            }).catch((error) => {
                console.log(error);
                alert(error);
                setIndicator(false);
            })
        }
    }

    return (
        <SafeAreaView>
            <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
                <ScrollView>
                    <Image
                        style={{ width: 100, height: 100, borderRadius: 100 / 2, marginLeft: '35%', marginTop: '5%' }}
                        source={require('../../../assets/studentlogo.jpg')}
                    />

                    <Text style={{
                        color: 'red', textAlign: 'center', fontWeight: 'bold', fontSize: 30, fontStyle: 'italic',
                        marginTop: '10%'
                    }}>Student Register</Text>

                    <TextInput
                        style={{ color: 'black', fontSize: 16, marginLeft: 35, marginTop: 30, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 30, width: '80%' }}
                        placeholder='Enter Username' value={userName} onChangeText={(e) => setUsername(e)} />

                    <TextInput
                        style={{ color: 'black', fontSize: 16, marginLeft: 35, marginTop: 30, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 30, width: '80%' }}
                        placeholder='Enter email' value={email} onChangeText={(e) => setEmail(e.trim())} />

                    <TextInput
                        secureTextEntry={true}
                        style={{ color: 'black', fontSize: 16, marginLeft: 35, marginTop: 30, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 30, width: '80%' }}
                        placeholder='Enter password' value={password} onChangeText={(e) => setPassword(e.trim())} />

                    <TextInput
                        secureTextEntry={true}
                        style={{ color: 'black', fontSize: 16, marginLeft: 35, marginTop: 30, textAlign: 'center', padding: 10, borderWidth: 1, borderRadius: 30, width: '80%' }}
                        placeholder='Enter confirm password' value={cPassword} onChangeText={(e) => setCpassword(e.trim())} />

                    <View style={{ width: '40%', marginLeft: '30%', marginTop: 30 }}>
                        <Button
                            title='Register'
                            onPress={Register}
                            radius='md'
                            type='solid'
                            size='md'>
                        </Button>
                    </View>

                    <ActivityIndicator style={{ padding: 15 }} size='large'
                        animating={indicator}>
                    </ActivityIndicator>

                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default StudentRegisterScreen;

const styles = StyleSheet.create({})