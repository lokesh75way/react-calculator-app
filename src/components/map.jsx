import React from 'react';
import { bool, func } from 'prop-types';
import { Button } from 'react-bootstrap';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';

const Map = compose(
  withProps({
    googleMapURL: process.env.REACT_APP_GOOGLE_KEY,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const { isMarkerShown, data, addedLocations, addLocation } = props;

  return (
    <>
      {data && data.length > 0 ? (
        <GoogleMap
          defaultZoom={15}
          defaultCenter={{ lat: data[0].lat, lng: data[0].long }}
        >
          {isMarkerShown &&
            data.map((location) => {
              const { id, name, max_dist, fee } = location;
              const isLocationSelected =
                addedLocations &&
                addedLocations.length > 0 &&
                addedLocations.some((loc) => loc.id === id);
              return (
                <div key={id}>
                  <InfoWindow
                    position={{
                      lat: location.lat,
                      lng: location.long,
                    }}
                  >
                    <div className="text-dark-blue px-1 pb-1">
                      <div className="font-weight-bold font-14 mb-1">
                        {name}
                      </div>
                      <div>
                        <span className="font-weight-normal">Max Units: </span>
                        <span className="font-weight-light">{max_dist}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-weight-normal">Fee: </span>
                        <span className="font-weight-light">{fee}</span>
                      </div>
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="success"
                          className={`p-0 px-4 font-12 ${
                            isLocationSelected && 'cursor-not-allowed'
                          }`}
                          onClick={() => addLocation(location)}
                          disabled={isLocationSelected}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </InfoWindow>
                  <Marker
                    position={{ lat: location.lat, lng: location.long }}
                  />
                </div>
              );
            })}
        </GoogleMap>
      ) : (
        <div className="text-white text-center mt-2">
          At least one location must be there
        </div>
      )}
    </>
  );
});

Map.defaultProps = {
  addLocation: () => {},
  isMarkerShown: false,
};

Map.propTypes = {
  addLocation: func,
  isMarkerShown: bool,
};

export default Map;
