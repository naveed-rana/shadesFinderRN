import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text,View,CameraRoll,ImageBackground } from 'react-native';
import ViewShot from "react-native-view-shot";
var SendIntentAndroid = require('react-native-send-intent');


export default class ShareScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        bgSource:this.props.navigation.getParam('src', 'NO-ID')
    };
  }

  componentDidMount = () => {

    this.refs.viewShot.capture().then(uri => {
      let saveResult = CameraRoll.saveToCameraRoll(uri, 'photo');
       console.log('saveedresult',saveResult);
      
        SendIntentAndroid.isAppInstalled('com.instagram.android')
        .then(function(isInstalled){
   
          if(!isInstalled){
            //Instagram has not install
            alert('please install instagram from playstore');
            return;
          }   
         CameraRoll.getPhotos({
                  first: 1,
                  assetType: 'Photos',
                })
                .then(r => {
                  let lastindex = r.edges[0].node.image.uri.slice(r.edges[0].node.image.uri.lastIndexOf("/")+1);
                  let firstIndex = r.edges[0].node.image.uri.slice(0,r.edges[0].node.image.uri.lastIndexOf("/")+1);
                  lastindex = parseInt(lastindex) + 1;
                 let imgURi = firstIndex+lastindex;
                 console.log('recent image',imgURi);
                 console.log('uriIndex from cam',r.edges[0].node.image.uri)
                  SendIntentAndroid.shareImageToInstagram("image/*",imgURi);
                })
                .catch((err) => {
                    console.log('eer',err);           
                });    
        });
   
      });
      this.props.navigation.goBack(); 
  };
  

  render() {
      const {bgSource} = this.state;
    return (
        <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
        <ImageBackground source={{uri:bgSource}} style={styles.backgroundImage} >
        <View style={ styles.swapContainer }>
       <Text style={{color:'#fff',fontWeight:'bold',fontSize:16}}>Foundation Shade Finder</Text>
       
       <Text  style={{marginLeft:10,backgroundColor:'red',color:'#fff',fontWeight:'bold',paddingHorizontal:12,borderRadius:2}}>A.I</Text> 
      </View>
  
        <View style={styles.containerItems}>
       <Text style={{color:'#3366BB',fontWeight:'bold'}}>www.foundationshadefinder.com</Text>
       <Text style={{color:'white'}}>Find Your Shade With Artificial Intelligence</Text>
       </View>
        </ImageBackground>
      </ViewShot>
    );
  }
}


const styles = StyleSheet.create({
   
     swapContainer: {
      position:'absolute',
      bottom:Dimensions.get('window').height - 60,
      zIndex: 1421,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent:'center',
      alignSelf: 'center',    
      
    },

    backgroundImage: {
      width: '100%', height: '100%'
    },
    containerItems:{
      flex: 1,
      justifyContent:'flex-end',
      alignItems: 'center',
    },
  
    text: {
      fontWeight:'bold',
      color:'white'
    },
  
  });
  