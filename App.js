import React, {Component} from 'react';
import Home from './src/setup';
import {  PermissionsAndroid } from 'react-native';
import SplashScreen from './src/splashScreen';
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      splash:true
    }
  }
  

  componentDidMount() {
    setTimeout(() => {
      this.setState({splash:false});
    }, 2000);
    this.requestPermission();
  }

  async requestPermission() {
    let per = [];
    per.push(PermissionsAndroid.PERMISSIONS.CAMERA);
    per.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    try {
      const granted = await PermissionsAndroid.requestMultiple(per)
        .then((res) => {
          console.log("Result" + res);

        }).catch(err => console.log(err));

    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    const {splash} = this.state;
    return (
     splash ?
     <SplashScreen />
     :
     <Home/> 
    );
  }
}
