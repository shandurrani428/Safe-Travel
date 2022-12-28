import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';



const HomeScreen = () => {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
            <View style={{ padding: 20 }}>
                <Image
                    style={{ height: 100, width: 100, resizeMode: 'contain' }}
                    source={require('../../../assets/check.jpg')}
                />
            </View>

            <View style={{ height: 150, width: '45%', backgroundColor: 'lightblue', marginTop: 50, marginLeft: 10, borderRadius: 20 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Student Login') }}>
                    <Image
                        style={{ width: 90, height: 90, borderRadius: 90 / 2, resizeMode: 'contain', marginLeft: 35, marginTop: 18 }}
                        source={{ uri: "https://img.freepik.com/free-vector/schoolmates-going-school-couple-pupils-uniform-holding-hands-happy-dark-skin-pupils_71593-1119.jpg?size=626&ext=jpg&ga=GA1.2.2099941854.1654368439" }}
                    />
                    <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20, color: 'black' }}>Student</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 150, width: '45%', backgroundColor: 'pink', marginLeft: 190, marginTop: -150, borderRadius: 20 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Driver Login') }}>
                    <Image
                        style={{ width: 90, height: 90, borderRadius: 90 / 2, resizeMode: 'contain', marginLeft: 35, marginTop: 18 }}
                        source={{ uri: "https://i.ytimg.com/vi/iT_kxtlTB24/maxresdefault.jpg" }}
                    />
                    <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 20, color: 'black' }}>Driver</Text>
                </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
                <Text style={{ color: 'black', fontSize: 15, textAlign: 'center', marginTop: 50, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                    Travel Safe and Enjoy your Ride!</Text>
            </View>
            <TouchableOpacity
            style={{ backgroundColor: '#6495ed', width: '30%', height: '5%', marginLeft: '35%', marginTop: '45%', borderRadius: 10}}
            onPress={() => {navigation.navigate('Admin Login')}}>
                <Text style={{ textAlign: 'center', padding: 6, color: 'white'}}>Admin</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({})