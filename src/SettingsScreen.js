import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import UserManualModal from './UserManualModal'; // Import the UserManualModal component

const SettingsScreen = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [manualVisible, setManualVisible] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        const id = await DeviceInfo.getUniqueId();
        await AsyncStorage.setItem('device_id', id);
        setDeviceId(id);
      } catch (error) {
        console.error('Error fetching device ID:', error);
      }
    };

    fetchDeviceId();
    
    AsyncStorage.getItem('firstLaunch').then(value => {
      if (value === null) {
        AsyncStorage.setItem('firstLaunch', 'false');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  const handleCloseManual = () => setManualVisible(false);

  const UserManualPopup = () => (
    <UserManualModal visible={isFirstLaunch} onClose={() => setIsFirstLaunch(false)} />
  );

  const deleteAllRecipes = async () => {
    try {
      await axios.post('https://anchovy-aware-abnormally.ngrok-free.app/delete-recipes/', { device_id: deviceId });
      Alert.alert('Success', 'All recipes have been deleted.');
    } catch (error) {
      console.error('Error deleting recipes:', error);
      Alert.alert('Error', 'Failed to delete recipes.');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Borrar todas las recetas',
      '¿Estás seguro de que deseas eliminar todas las recetas? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: deleteAllRecipes },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {isFirstLaunch && <UserManualPopup />}
      <Button title="Manual de usuario" onPress={() => setManualVisible(true)} />
      <UserManualModal visible={manualVisible} onClose={handleCloseManual} />
      <View style={styles.dangerZone}>
        <Button title="Borrar todas las recetas" color="#FF3B30" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  dangerZone: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
  },
});

export default SettingsScreen;
