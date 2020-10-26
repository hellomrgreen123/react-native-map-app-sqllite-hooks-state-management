import React, { useEffect } from 'react';
import { StyleSheet, Platform, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useStore } from '../hooks/store';
import {fetchPlaces} from '../helpers/db'
import HeaderButton from '../components/HeaderButton';
import PlaceItem from '../components/PlaceItem'
const PlacesListScreen = props => {
  const [state, dispatch] = useStore()

  const loadPlaces = async () => {
    try {
      const dbResult = await fetchPlaces();
      dispatch('SET_PLACES', dbResult.rows._array);
     
    } catch (err) {
      throw err;
    }
  };
  useEffect(() => {
    loadPlaces();
  }, []);
  return (
    <FlatList
      data={state.places}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <PlaceItem
          image={itemData.item.imageUri}
          title={itemData.item.title}
          address={itemData.item.address}
          onSelect={() => {
            props.navigation.navigate('PlaceDetail', {
              placeTitle: itemData.item.title,
              placeId: itemData.item.id
            });
          }}
        />
      )}
    />
  );
};

PlacesListScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Places',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add Place"
          iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
          onPress={() => {
            navData.navigation.navigate('NewPlace');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({});

export default PlacesListScreen;

