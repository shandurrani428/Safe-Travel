import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import 'react-native-get-random-values';
import RtcEngine, {
  ChannelProfile,
  RtcLocalView,
  RtcRemoteView,
} from 'react-native-agora';
import { PermissionsAndroid } from 'react-native';
import { ClientRole } from "react-native-agora";
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';



const GoLive = ({ route }) => {

  const navigation = useNavigation();

  const permission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the cameras & mic');
      } else {
        console.log('Permission denied');
      }
    }
    catch (err) {
      console.warn(err);
    }
  }

  const isBroadcaster = route.params.type === 'create';
  const channelId = route.params.channel;

  const [joined, setJoined] = useState(false);
  const AgoraEngine = useRef();

  useEffect(() => {
    if (Platform.OS === 'android') permission();
    const uid = isBroadcaster ? 1 : 0;
    init().then(() =>
      AgoraEngine.current.joinChannel(null, channelId, null, uid),
    );
    return () => {
      AgoraEngine.current.destroy();
    };
  }, []);

  const init = async () => {
    AgoraEngine.current = await RtcEngine.create('a6d9f08630fd4254937925fd00edc535');
    AgoraEngine.current.enableVideo();

    AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
    if (isBroadcaster)
      AgoraEngine.current.setClientRole(ClientRole.Broadcaster);

    AgoraEngine.current.addListener(
      'JoinChannelSuccess',
      (channelId, uid, elapsed) => {
        console.log('JoinChannelSuccess', channelId, uid, elapsed);
        setJoined(true);
      },
    );
  };

  const onSwitchCamera = () => AgoraEngine.current.switchCamera();

  const endCall = () => {
      setJoined(false);
    console.log('Call End');
    navigation.goBack();
  }

  if(!joined)
  {
    return(
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <View style={{ height: '100%', width: '100%' }}>
        <ActivityIndicator
            size={60}
            color="#222"
            style={{ marginTop: '50%' }}
          />
          <Text style={{ color: 'black', fontSize: 18, marginTop: '20%', marginLeft: '20%' }}>
            Going Live please wait....
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  else if(isBroadcaster)
  {
    return(
      <SafeAreaView>
        <View style={{ height: '90%', width: '100%' }}>
          <RtcLocalView.SurfaceView
          style={{ height: '100%', width: '100%'}}
          channelId={channelId}
          />
        </View>
        <View style={{ height: '10%', width: '100%', backgroundColor: 'black' }}>
          <TouchableOpacity 
          onPress={onSwitchCamera}
          style={{ backgroundColor: '#0000ff', marginTop: '3%', marginLeft: '23%', height: 50, width: 90, borderRadius: 10, padding: 5}}>
            <Text style={{ textAlign: 'center', color: 'white'}}>Switch Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={endCall}
          style={{ backgroundColor: '#ff0000', marginTop: '-14%', marginLeft: '52%', height: 50, width: 90, borderRadius: 10, padding: 5}}>
            <Text style={{ textAlign: 'center', color: 'white'}}>End Streaming</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
  else{
    return(
      <SafeAreaView>
        <View style={{ height: '100%', width: '100%'}}>
          <RtcRemoteView.SurfaceView
          style={{ height: '100%', width: '100%'}}
          uid={1}
          channelId={channelId}/>
        </View>
      </SafeAreaView>
    )
  }

}

export default GoLive;

const styles = StyleSheet.create({})