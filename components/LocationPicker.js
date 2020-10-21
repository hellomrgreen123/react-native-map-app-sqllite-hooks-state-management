import React, { useEffect, useState } from 'react'
import { View, Button, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import * as Location from 'expo-location'


import * as Permissions from 'expo-permissions'
import MapPreview from './MapPreview'

const LocationPicker = props => {

    const [pickedLocation, setPickedLocation] = useState()
    const [isFetching, setIsFetching] = useState(false)
    const mapPickedLocation = props.navigation.getParam('pickedLocation')
    const { onLocationPicked } = props


    useEffect(() => {
        if (mapPickedLocation) {
            setPickedLocation(mapPickedLocation)
            onLocationPicked(mapPickedLocation)
        }
    }, [mapPickedLocation, onLocationPicked]
    )
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant location permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const getLocationHandler = async () => {
        setIsFetching(true)
        const hasPermisssion = await verifyPermissions()

        if (!hasPermisssion) {
            return
        }
        try {
            const location = await Location.getCurrentPositionAsync({ timeInterval: 5000 })
            setPickedLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            })
            onLocationPicked({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            })
        }
        catch (err) {
            Alert.alert('Could not fetch location!', 'Please try again later or pick a location on the map', [{ text: 'Okay' }])
        }
        setIsFetching(false)
    }

    const pickOnMapHandler = () => {
        props.navigation.navigate('Map',{readOnly: false})
    }
    return <View style={styles.locationPicker}>
        <MapPreview style={styles.mapPreview} location={pickedLocation} onPress={pickOnMapHandler}>
            {isFetching ? <ActivityIndicator size="large" /> :
     <Text>
     no location chosen
    </Text>}
        </MapPreview>
        <View style={styles.buttons}>

            <Button title="get user location" color={Colors.primary}
                onPress={getLocationHandler}
            />
            <Button
                title="Pick on map" color={Colors.primary}
                onPress={pickOnMapHandler} />
        </View>
    </View>
}

const styles = StyleSheet.create({
    locationPicker: {
        marginBottom: 15,

    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 150,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    }
})

export default LocationPicker
