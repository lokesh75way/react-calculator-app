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
    googleMapURL: process.env.REACT_APP_GOOGLE_MAP_URL,
    loadingElement: <div className="h-100" />,
    containerElement: <div className="map-container-element" />,
    mapElement: <div className="h-100" />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const {
    isMarkerShown,
    data,
    addedLocations,
    addLocation,
    closeMap,
    formattedLocations,
  } = props;

  return (
    <>
      {data && data.length > 0 ? (
        <GoogleMap
          defaultZoom={15}
          defaultCenter={{ lat: data[0].lat, lng: data[0].long }}
        >
          {isMarkerShown &&
            data.map((location) => {
              const { id } = location;
              const filteredLocations = formattedLocations.filter(
                (locData) =>
                  Object.keys(locData).toString() ===
                  `${location.lat}-${location.long}`
              );
              return (
                <div key={id}>
                  <InfoWindow
                    position={{
                      lat: location.lat,
                      lng: location.long,
                    }}
                  >
                    <div className="text-dark-blue px-1 pb-1">
                      {filteredLocations.map((locLatLong, index) => {
                        return (
                          <div key={index}>
                            {Object.values(locLatLong).map(
                              (dataValue, index) => {
                                return (
                                  <div key={index}>
                                    {dataValue.map((displayData, index) => {
                                      const isLocationSelected =
                                        addedLocations &&
                                        addedLocations.length > 0 &&
                                        addedLocations.some(
                                          (loc) => loc.id === displayData.id
                                        );
                                      return (
                                        <div key={index}>
                                          <div className="font-weight-bold font-14 mb-1">
                                            {displayData.name}
                                          </div>
                                          <div>
                                            <span className="font-weight-normal">
                                              Max Units:{' '}
                                            </span>
                                            <span className="font-weight-light">
                                              {displayData.max_dist}
                                            </span>
                                          </div>
                                          <div className="mb-2">
                                            <span className="font-weight-normal">
                                              Fee:{' '}
                                            </span>
                                            <span className="font-weight-light">
                                              {displayData.fee}
                                            </span>
                                          </div>
                                          <div className="d-flex justify-content-end">
                                            <Button
                                              variant="success"
                                              className={`p-0 px-4 font-12 ${
                                                isLocationSelected &&
                                                'cursor-not-allowed'
                                              }`}
                                              onClick={() =>
                                                addLocation(displayData)
                                              }
                                              disabled={isLocationSelected}
                                            >
                                              Add
                                            </Button>
                                          </div>
                                          {index !== dataValue.length - 1 && (
                                            <hr className="mb-2" />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </InfoWindow>
                  <Marker
                    position={{ lat: location.lat, lng: location.long }}
                  />
                </div>
              );
            })}
          <div className="map-go-back">
            <Button
              variant="success"
              className="px-4"
              size="sm"
              onClick={closeMap}
            >
              Go Back
            </Button>
          </div>
        </GoogleMap>
      ) : (
        <div className="text-white text-center mt-2">
          Sorry, Locations not found
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
