import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Image, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import { Buffer } from "buffer";
import { connect } from 'react-redux';
import {
    MagicModalPortal,
    magicModal,
    useMagicModal,
    MagicModalHideReason
} from "react-native-magic-modal";
let deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        width: deviceWidth * 0.40,
        height: deviceWidth * 0.40,
        borderRadius: (deviceWidth * 0.40) / 2,
        alignItems: "center",
        justifyContent: "center",
        overflow: 'hidden',
    },
    iconStyle: {
        fontSize: deviceWidth * 0.20,
        color: 'black',
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: (deviceWidth * 0.40) / 2,
        resizeMode: 'cover',
        position: 'absolute',
    },
    processButtonContainer: {
        marginTop: 40,
        alignSelf: 'center',
    },
    processButton: {
        backgroundColor: '#007AFF',
        borderRadius: 25,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    processButtonTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: to add a background overlay
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: deviceWidth * 0.8, // 80% of screen width
        maxWidth: 400,
    },
    icon: {
        marginBottom: 20,
    },
    spinner: {
        marginBottom: 20,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

const ProcessingModal = () => {
    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Icon name="cutlery" size={50} color="#007AFF" style={styles.icon} />
                <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
                <Text style={styles.modalText}>Procesando Ingredientes...</Text>
            </View>
        </View>
    );
};

const CameraButton = ({ navigation }) => {
    const [imageSource, setImageSource] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [modalId, setModalId] = useState(null);
    const actionSheetRef = useRef();

    useEffect(() => {
        if (ingredients.length > 0) {
            axios.post('https://anchovy-aware-abnormally.ngrok-free.app/get-recipes/', {
                ingredients: ingredients,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                const data = response.data;
                console.log(data);
                navigation.navigate('Nuestras recomendaciones', { recipes: data.recipes });
            }).catch(error => {
                console.error('Error fetching recipes:', error);
            }).finally(() => {
                setIsUploading(false);
            });
        }
    }, [ingredients]);

    const extractData = async (file) => {
        const apiKey = '8d2e6323-0c89-11ef-b268-763d7df91960';
        const modelId = '4b364195-6436-46c1-a8e7-e9998cfac73b';
        const authHeaderVal = "Basic " + Buffer.from(`${apiKey}:`, "utf-8").toString("base64");
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
            console.log(response.data.result[0].prediction[0].ocr_text);
            setIngredients([response.data.result[0].prediction[0].ocr_text]);
            return response.data.result[0].prediction[0].ocr_text;
        } catch (err) {
            console.error(err);
            setIsUploading(false);
            return null;
        }
    };

    const showActionSheet = () => {
        actionSheetRef.current.show();
    };

    const uploadImageToStorage = (path, imageName) => {
        let reference = storage().ref(imageName);
        let task = reference.putFile(path);

        task.then(() => {
            reference.getDownloadURL().then((url) => {
                extractData(url);
            });
        }).catch((e) => {
            console.log('uploading image error => ', e);
            setIsUploading(false);
        });
    };

    const uploadPhoto = (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const source = {
                uri: Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri
            };
            setImageSource(source);
        }
    };

    useEffect(() => {
        if (isUploading) {
            const id = magicModal.show(() => <ProcessingModal />);
            setModalId(id);
        }
        else if (!isUploading && modalId) {
            magicModal.hide(modalId);   
        }
    }, [isUploading]);

    const takePhoto = () => {
        var options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchCamera(options, (response) => {
            if (response && response.assets && response.assets.length > 0) {
                uploadPhoto(response.assets[0]);
            } else {
                console.log('User cancelled photo selection');
            }
        });
    };

    const chooseFromLibrary = () => {
        var options = {
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response && response.assets && response.assets.length > 0) {
                uploadPhoto(response.assets[0]);
            } else {
                console.log('User cancelled photo selection');
            }
        });
    };

    const processIngredients = () => {
        if (imageSource) {
            setIsUploading(true);
            // const fileName = imageSource.uri.split('/').pop();
            // uploadImageToStorage(imageSource.uri, fileName);
            setIngredients(['jjagjagj']);
        }
    };

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={showActionSheet}>
                <View style={styles.button}>
                    {imageSource == null ? (
                        <Icon name="camera" style={styles.iconStyle} />
                    ) : (
                        <Image style={styles.photo} source={imageSource} />
                    )}
                </View>
            </TouchableOpacity>
            <ActionSheet
                ref={actionSheetRef}
                title={'Upload a Photo'}
                options={['Take Photo', 'Choose from Library', 'Cancel']}
                cancelButtonIndex={2}
                destructiveButtonIndex={-1}
                onPress={(index) => {
                    if (index === 0) {
                        takePhoto();
                    } else if (index === 1) {
                        chooseFromLibrary();
                    }
                }}
            />
            {imageSource && !isUploading && (
                <Button
                    icon={<Icon name="cutlery" size={15} color="white" paddingHorizontal={5} paddingVertical={5} />}
                    buttonStyle={styles.processButton}
                    containerStyle={styles.processButtonContainer}
                    titleStyle={styles.processButtonTitle}
                    title="Procesar Ingredientes"
                    onPress={processIngredients}
                />
            )}
            <MagicModalPortal />
        </View>
    );
};

export default connect()(CameraButton);
