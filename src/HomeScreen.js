import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import CameraButton from './CameraButton';

let deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    searchBox: {
        flex: 5,
        backgroundColor: '#FFFFFF',
    },
    searchContent: {
        flex: 1,
    },
    space: {
        flex: 1,
    },
    searchText: {
        flex: 1,
    },
    text1: {
        textAlign: "center",
        color: '#000000',
        fontSize: 23,
    },
    text2: {
        paddingTop: 10,
        textAlign: "center",
        color: '#000000',
        fontSize: 15,
    },
    buttonWrap: {
        flex: 2,
        alignItems: "center",
    },
});

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.searchBox}>
                <View style={styles.searchContent}>
                    <View style={styles.space}></View>
                    <View style={styles.searchText}>
                        <Text style={styles.text1}>
                            Toma foto de ingredientes
                        </Text>
                        <Text style={styles.text2}>
                            Porfavor sube una foto de tu lista de ingredientes disponibles.
                        </Text>
                    </View>
                    <View style={styles.buttonWrap}>
                        <CameraButton type="home" navigation={navigation} />
                    </View>
                    <View style={styles.space}></View>
                </View>
            </View>
        </View>
    );
}

export default connect()(HomeScreen);
