import { initStore } from "../store"
import Place from '../../Models/place'


const configurePlacesStore = () => {
  const actions = {
    ADD_PLACE: (state, placeData) => {
      const newPlace = new Place(placeData.id.toString(), placeData.title, placeData.image,placeData.location.lat,placeData.location.lng,placeData.address)
      return { places: state.places.concat(newPlace) }
    },

    SET_PLACES:(state,dbResult)=>{
  
      
        return  {places:dbResult.map(place=>{
          
             return new Place(place.id.toString(), place.title, place.imageUri,place.lat,place.lng,place.address)
            })
          }
    

  }}
  initStore(actions, {
    places: [],
  });
};
export default configurePlacesStore;
