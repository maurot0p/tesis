import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DefaultScreen = ({ navigation }) => {
    return (
        <View style={styles.defaultContainer}>
            <Text style={styles.defaultText}>No ingredients provided.</Text>
            <Button
                title="Ir a procesar ingredientes"
                onPress={() => navigation.navigate('Procesar ingredientes')}  // Adjust the navigation as needed
            />
        </View>
    );
};

const styles = StyleSheet.create({
    defaultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultText: {
        fontSize: 18,
        color: '#000000',
        marginBottom: 20,
    },
});

export default DefaultScreen;
