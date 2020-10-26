import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useStore } from '../hooks/store'
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { insertPlace } from '../helpers/db'
import variables from '../env'
import LocationPicker from '../components/LocationPicker'
import ImagePicker from '../components/ImageSelector'
import Colors from '../constants/Colors';
import * as FileSystem from 'expo-file-system';
const NewPlaceScreen = props => {
  const [titleValue, setTitleValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState()
  const [selectedImage, setSelectedImage] = useState()
  const [state, dispatch] = useStore()
  const imageRef = useRef()
  imageRef.current = selectedImage


  const addPlace = async () => {
    if(!selectedLocation){
      alert('Please select a location before saving')
      return
    }
    if(!titleValue){
      alert('Please select a title before saving')
      return
    }
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.lat
      },${selectedLocation.lng}&key=${variables.googleApiKey}`
    );
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error('Something went wrong!');
    }

    const address = resData.results[0].formatted_address;

    await moveImageHandler()

    try {
      const dbResult = await insertPlace(
        titleValue,
        imageRef.current,
        selectedLocation.lat,
        selectedLocation.lng,
        address
      );
      const placeData = {
        id: dbResult.insertId,
        title: titleValue,
        image: imageRef.current,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        },
        address: address
      }
      dispatch('ADD_PLACE', placeData)
      props.navigation.goBack();
    } catch (err) {
      console.log(err);
      alert('There was an error', err)
      props.navigation.goBack();
      throw err;
    }

  }

  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  }
    ;

  const moveImageHandler = async () => {
    try {
      const fileName = selectedImage.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;
      if (selectedImage != newPath) {
        await FileSystem.moveAsync({
          from: selectedImage,
          to: newPath
        })
      }
      setSelectedImage(newPath);
    } catch (err) {
      console.log(err);
      alert('There was an error', err)
      throw err;
    }

  }

  const locationPickedHandler = useCallback(location => {
    setSelectedLocation(location);
  }, []);

  const titleChangeHandler = text => {
    if (text !== '') { setTitleValue(text); }
    else {
      alert('Please enter a title')
    }
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        <ImagePicker onImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={props.navigation}
          onLocationPicked={locationPickedHandler}
        />
        <Button title="Save Place" color={Colors.primary} onPress={() => { addPlace() }} />
      </View>
    </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = {
  headerTitle: 'Add Place'
};

const styles = StyleSheet.create({
  form: {
    margin: 30
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2
  }
});

export default NewPlaceScreen;
