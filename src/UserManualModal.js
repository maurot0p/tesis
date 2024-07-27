import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Modal } from 'react-native';

const UserManualModal = ({ visible, onClose }) => (
  <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
  >
    <View style={styles.modalView}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.stepTitle}>Paso 1: Iniciar la aplicación</Text>
        <Text style={styles.stepDetail}>• Toque el ícono de Comida Fácil.</Text>

        <Text style={styles.stepTitle}>Paso 2: Navegar por el menú</Text>
        <Text style={styles.stepDetail}>• Al iniciar la aplicación, verá un menú con opciones como "Inicio" y "Recetas".</Text>
        <Text style={styles.stepDetail}>• Acceda a estas opciones deslizando o tocando el menú del cajón.</Text>

        <Text style={styles.stepTitle}>Paso 3: Capturar una foto de los ingredientes</Text>
        <Text style={styles.stepDetail}>• Desde la pantalla de inicio, toque el botón para tomar una foto.</Text>
        <Text style={styles.stepDetail}>• Esto abrirá la cámara de su dispositivo.</Text>
        <Text style={styles.stepDetail}>• Capture una foto clara de sus ingredientes.</Text>
        <Text style={styles.stepDetail}>• La foto se cargará y procesará automáticamente para extraer los ingredientes.</Text>

        <Text style={styles.stepTitle}>Paso 3.1: Cargar una foto desde la galería</Text>
        <Text style={styles.stepDetail}>• Alternativamente, desde la pantalla de inicio, toque el botón para elegir de la biblioteca.</Text>
        <Text style={styles.stepDetail}>• Esto abrirá la biblioteca de fotos de su dispositivo.</Text>
        <Text style={styles.stepDetail}>• Seleccione la foto de sus ingredientes.</Text>
        <Text style={styles.stepDetail}>• La foto seleccionada será cargada y procesada para extraer los ingredientes.</Text>

        <Text style={styles.stepTitle}>Paso 4: Procesar ingredientes y generar recetas</Text>
        <Text style={styles.stepDetail}>• Después de subir la foto por cualquiera de los métodos, la aplicación procesará los ingredientes y generará recetas.</Text>
        <Text style={styles.stepDetail}>• Navegue a la pantalla "Recetas" desde el menú del cajón para ver las recetas generadas.</Text>

        <Text style={styles.stepTitle}>Paso 5: Ver y guardar recetas</Text>
        <Text style={styles.stepDetail}>• En la pantalla Recetas, verá una lista de recetas generadas según los ingredientes proporcionados.</Text>
        <Text style={styles.stepDetail}>• Cada receta incluirá el título y los pasos de preparación detallados.</Text>
        <Text style={styles.stepDetail}>• Puede guardar las recetas que desee seleccionando la opción de guardar.</Text>
        <Text style={styles.stepDetail}>• Acceda a las recetas guardadas en cualquier momento desde la pantalla Recetas guardadas.</Text>
      </ScrollView>
      <Button title="Close" onPress={onClose} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepDetail: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default UserManualModal;
