import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
const axios = require("axios").default;
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Platform
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Camera, CameraType } from 'react-native-camera-kit';


async function extractData(file) {
  const apiKey = '8d2e6323-0c89-11ef-b268-763d7df91960';
  const modelId = '4b364195-6436-46c1-a8e7-e9998cfac73b'
	const authHeaderVal =
		"Basic " + Buffer.from(`${apiKey}:`, "utf-8").toString("base64");
	const fileurl = `urls=${file}`;

	const data = await axios
		.post(
			`https://app.nanonets.com/api/v2/OCR/Model/${modelId}/LabelFile`,
			fileurl,
			{
				headers: {
					"Authorization": authHeaderVal,
					"Accept": "application/json"
				}
			}
		)
		.then((res) => res.data)
		.catch((err) => console.error(err));

	return data;
}

const uploadAsFile = async (photo) => {
   await fetch(photo.uri)
    .then((response) => response.blob())
    .then((myBlob) => {
      const objectURL = URL.createObjectURL(myBlob);
      photo.src = objectURL
    });
  const extracted = await extractData(photo.src);


  
}

const uploadImageToStorage = (path, imageName) => {
  let reference = storage().ref(imageName);         // 2
  let task = reference.putFile(path);               // 3

  task.then(() => {   
    reference.getDownloadURL().then((url) => {
      const response = extractData(url)
      console.log(response.data)
    })
  }).catch((e) => console.log('uploading image error => ', e));
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [photo, setPhoto] = useState(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(()=> {
    if (photo !== null) {
    // uploadAsFileToFirebase(photo?.uri);
    }

  },[photo])

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
       <Button
    onPress={() =>
      launchImageLibrary(
       {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
       },
        response => {
           // setPhoto(response.assets[0]);
           uploadImageToStorage(response.assets[0].uri, response.assets[0].fileName)
          },
        )
     }
       title="Select Image"
/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
