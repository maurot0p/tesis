import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    View, StyleSheet, Image, TouchableOpacity, Dimensions, Text,
    Platform
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { NavigationActions } from 'react-navigation';
import * as ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
const axios = require("axios").default;
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: deviceWidth * 0.40,
        height: deviceWidth * 0.40,
        borderRadius: (deviceWidth * 0.40) / 2,
        top: deviceWidth * 0.05,
        shadowColor: '#181c17',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 30,
        shadowOpacity: 1,
        alignItems: "center"
    },
    cameraIcon: {
        width: deviceWidth * 0.20,
        height: deviceWidth * 0.20,
        top: deviceWidth * 0.10,
        opacity: 0.9
    },
    photo: {
        width: deviceWidth * 0.36,
        height: deviceWidth * 0.36,
        borderRadius: (deviceWidth * 0.36) / 2,
        top: deviceWidth * 0.02
    },
    buttonSmall: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        shadowColor: '#181c17',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 30,
        shadowOpacity: 1,
        alignItems: "center",
        width: deviceWidth * 0.23,
        height: deviceWidth * 0.23,
        borderRadius: (deviceWidth * 0.23) / 2,
        alignItems: "center",
        justifyContent: "center"
    },
    cameraIconSmall: {
        width: deviceWidth * 0.13,
        height: deviceWidth * 0.13,
        opacity: 0.9
    },
    photoSmall: {
        width: deviceWidth * 0.19,
        height: deviceWidth * 0.19,
        borderRadius: (deviceWidth * 0.19) / 2
    }
});


class CameraButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            imageSource: null,
            options: ['Take Photo', 'Choose from Library', 'Cancel'],
            test: '',
            ingredients: []
        }

        if (this.props.defaultImage !== undefined){
            this.state.directUrl = this.props.directUrl;
            if (this.props.directUrl){
              this.state.imageSource = {
                  uri: Config.IMAGE_URL+'/'+this.props.defaultImage+'.jpg'
              };
            }else{
              var response = this.props.defaultImage;
              var source = {
                  uri: Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri
              };
              this.state.imageSource = source;
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        // Check if ingredients state has changed
        if (this.state.ingredients !== prevState.ingredients) {
            // Do something with the updated ingredients state
            this.props.navigation.navigate('Ingredientes', { ingredients: this.state.ingredients });
        }
    }

    async extractData(file) {
        const apiKey = '8d2e6323-0c89-11ef-b268-763d7df91960';
        const modelId = '4b364195-6436-46c1-a8e7-e9998cfac73b'
          const authHeaderVal =
              "Basic " + Buffer.from(`${apiKey}:`, "utf-8").toString("base64");
          const fileurl = `urls=${file}`;
      
          try {
            const response = await axios.post(
                `https://app.nanonets.com/api/v2/OCR/Model/${modelId}/LabelFile?async=false`,
                fileurl,
                {
                    headers: {
                        "Authorization": authHeaderVal,
                        "Accept": "application/json"
                    }
                }
            );
            console.log(response.data.result[0].prediction[0].ocr_text)
            this.setState({ ingredients: [response.data.result[0].prediction[0].ocr_text] });
            return response.data.result[0].prediction[0].ocr_text;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
    showActionSheet() {
        this.ActionSheet.show();
    }
    uploadImageToStorage = (path, imageName) => {
        let reference = storage().ref(imageName);         // 2
        let task = reference.putFile(path);               // 3
      
        task.then(() => {   
          reference.getDownloadURL().then((url) => {
            const response = this.extractData(url)
            console.log(response.data)
          })
        }).catch((e) => console.log('uploading image error => ', e));
      }

    uploadPhoto(response) {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        }else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        }else{
            var source = {
                uri: Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri
            };
            this.uploadImageToStorage(source.uri, response.fileName)

            if (this.props.onImageUpload !== undefined){
                this.props.onImageUpload(response, this.state.directUrl);
            }

        }
    }


    takePhoto() {
        var options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchCamera(options, (response)  => {
            this.uploadPhoto(response.assets[0]);
        });
    }

    chooseFromLibrary() {
        var options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchImageLibrary(options, (response)  => {
            this.uploadPhoto(response.assets[0]);
        });
    }

    render() {
        if (this.state.imageSource == null){
            var image = <Image style={this.state.type == 'home' ? styles.cameraIcon : styles.cameraIconSmall}
              source={require('./assets/camera_icon.png')}
            />
        }else{
            var image = <Image style={this.state.type == 'home' ? styles.photo : styles.photoSmall}
              source={this.state.imageSource}
            />
        }


        return (
          <View>
              <TouchableOpacity
              onPress={this.showActionSheet.bind(this)}>
                  <View style={this.state.type == 'home' ? styles.button : styles.buttonSmall}>
                      {image}
                  </View>
              </TouchableOpacity>
              <ActionSheet
                  ref={o => this.ActionSheet = o}
                  title={'Upload an Photo'}
                  options={this.state.options}
                  cancelButtonIndex={this.state.options.length - 1}
                  destructiveButtonIndex={-1}
                  onPress={(index) => {
                      if (index == 0){
                          this.takePhoto();
                      }else if (index == 1) {
                          this.chooseFromLibrary();
                      }
                  }}
                />
          </View>
      );
  }
}


export default connect()(CameraButton);
