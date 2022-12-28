import { StyleSheet, View, TextInput, Text } from 'react-native';
import React from 'react';
import SendSMS from 'react-native-sms';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from "@rneui/base";



const CnicVerify = ({route}) => {

  
    const {cnic} = route.params;

    const smsSend  = () => {

          SendSMS.send({
            body: cnic,
            recipients: ['8300'],
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
        }, (completed, cancelled, error) => {
            console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
        });
    }
  return (
    <SafeAreaView style={{ height: '100%', width: '100%', backgroundColor: 'white'}}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'white'}}>
        <Text style={{ textAlign: 'center', marginBottom: '-30%', marginTop: '40%', fontWeight: 'bold', fontSize: 30, color: 'black'}}>Verify CNIC</Text>
        <TextInput placeholder={cnic} value={cnic} style={{ marginLeft: '10%',width: '80%', textAlign: 'center', marginTop: '50%', borderRadius: 20, borderWidth: 1, backgroundColor: 'lightgray', color: 'black'}}/>
      <View style={{ width: '40%', marginLeft: '30%', marginTop: '10%'}}>
        <Button
        onPress={smsSend}
        radius='md'
        title='Send SMS'></Button>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default CnicVerify;

const styles = StyleSheet.create({});
