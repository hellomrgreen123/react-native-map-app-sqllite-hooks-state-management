import React from 'react';
import { init } from './helpers/db';
import PlacesNavigator from './navigation/PlacesNavigator';
import configureStore from './hooks/stores/placesStore'

configureStore()

init().then(()=>{
  console.log('Initialized database')
}).catch(err=>{
  console.log('Initializing db failed.')
  console.log(err)
})
export default function App() {
  return <PlacesNavigator />;
}
