import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DefaultScreen = ({ navigation }) => {
    return (
        <View style={styles.defaultContainer}>
            <Text style={styles.defaultText}>No ingredients provided.</Text>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Home')}  // Adjust the navigation as needed
            />
        </View>
    );
};

const styles = StyleSheet.create({
    defaultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    defaultText: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 20,
    },
});

export default DefaultScreen;
