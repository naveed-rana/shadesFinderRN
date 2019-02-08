import React, { Component } from 'react';
import { View, Image } from 'react-native';
import img from './res/logo.png';

export default class SplashScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:'#fff'
        }}>
        
        <Image source={img} style={{ height: 270, width: 270 }} />
        
      </View>
    );
  }
}
