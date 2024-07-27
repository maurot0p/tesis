import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    View, StyleSheet, Image, TouchableOpacity, Dimensions, Text,
    Platform, ActivityIndicator
} from 'react-native';
import { generateResponse } from './services/ChatGPTService';
import ActionSheet from 'react-native-actionsheet';
import { NavigationActions } from 'react-navigation';
import * as ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
const axios = require("axios").default;
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import { Buffer } from "buffer";

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

function extractJsonObjects(text) {
    const jsonObjects = [];
    const regex = /\{[^}]+\}/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      try {
        const jsonObject = JSON.parse(match[0]);
        jsonObjects.push(jsonObject);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    }
    return jsonObjects;
  }

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
        alignItems: "center",
        justifyContent: "center"
    },
    cameraIcon: {
        width: deviceWidth * 0.20,
        height: deviceWidth * 0.20,
        opacity: 0.9,
    },
    photo: {
        width: deviceWidth * 0.36,
        height: deviceWidth * 0.36,
        borderRadius: (deviceWidth * 0.36) / 2,
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
    },
    processButton: {
        backgroundColor: '#FFD369',
        padding: 10,
        borderRadius: 5,
        marginTop: 80,
        alignItems: 'center'
    },
    processButtonText: {
        color: 'black',
        fontSize: 16
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
            ingredients: [],
            isUploading: false
        };

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

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.ingredients !== prevState.ingredients) {
            this.setState({ isUploading: true });
    
            try {
                const response = await axios.post('http://localhost:8000/get-recipes/', {
                    ingredients: this.state.ingredients,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
    
                const data = response.data;
                console.log(data.recipes);
                this.props.navigation.navigate('Recipes', { recipes: data.recipes });
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                this.setState({ isUploading: false });
            }
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
            this.setState({ isUploading: false });
            return null;
        }
    }

    showActionSheet() {
        this.ActionSheet.show();
    }

    uploadImageToStorage = (path, imageName) => {
        this.setState({ isUploading: true });
        let reference = storage().ref(imageName);
        let task = reference.putFile(path);

        task.then(() => {   
            reference.getDownloadURL().then((url) => {
                this.extractData(url);
            })
        }).catch((e) => {
            console.log('uploading image error => ', e);
            this.setState({ isUploading: false });
        });
    }

    uploadPhoto(response) {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            var source = {
                uri: Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri
            };
            this.setState({ imageSource: source });
        }
    }

    takePhoto() {
        var options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchCamera(options, (response) => {
            if (response && response.assets && response.assets.length > 0) {
                this.uploadPhoto(response.assets[0]);
            } else {
                // Handle the case when the user cancels the photo selection
                console.log('User cancelled photo selection');
            }
        });
    }

    chooseFromLibrary() {
        var options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response && response.assets && response.assets.length > 0) {
                this.uploadPhoto(response.assets[0]);
            } else {
                // Handle the case when the user cancels the photo selection
                console.log('User cancelled photo selection');
            }
        });
    }

    processIngredients = () => {
        if (this.state.imageSource) {
            const fileName = this.state.imageSource.uri.split('/').pop();
            this.uploadImageToStorage(this.state.imageSource.uri, fileName);
        }
    }

    render() {
        const { isUploading, imageSource } = this.state;

        return (
            <View>
                <TouchableOpacity
                    onPress={this.showActionSheet.bind(this)}>
                    <View style={this.state.type == 'home' ? styles.button : styles.buttonSmall}>
                        {imageSource == null ? (
                            <Image style={this.state.type == 'home' ? styles.cameraIcon : styles.cameraIconSmall}
                                source={require('./assets/whiteicon.png')}
                            />
                        ) : (
                            <Image style={this.state.type == 'home' ? styles.photo : styles.photoSmall}
                                source={imageSource}
                            />
                        )}
                    </View>
                </TouchableOpacity>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Upload a Photo'}
                    options={this.state.options}
                    cancelButtonIndex={this.state.options.length - 1}
                    destructiveButtonIndex={-1}
                    onPress={(index) => {
                        if (index == 0) {
                            this.takePhoto();
                        } else if (index == 1) {
                            this.chooseFromLibrary();
                        }
                    }}
                />
                {imageSource && !isUploading && (
                    <TouchableOpacity style={styles.processButton} onPress={this.processIngredients}>
                        <Text style={styles.processButtonText}>Procesar Ingredientes</Text>
                    </TouchableOpacity>
                )}
                {isUploading && (
                    <ActivityIndicator size="large" color="#0000ff" />
                )}
            </View>
        );
    }
}

export default connect()(CameraButton);
