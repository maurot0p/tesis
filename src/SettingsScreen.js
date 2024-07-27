import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserManualModal from './UserManualModal'; // Import the UserManualModal component

const SettingsScreen = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [manualVisible, setManualVisible] = useState(false);

  useEffect(() => {
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

  return (
    <ScrollView style={styles.container}>
      {isFirstLaunch && <UserManualPopup />}
      <Button title="View User Manual" onPress={() => setManualVisible(true)} />
      <UserManualModal visible={manualVisible} onClose={handleCloseManual} />
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
});

export default SettingsScreen;
