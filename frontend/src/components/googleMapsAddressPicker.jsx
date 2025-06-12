import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  StandaloneSearchBox,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "300px",
};
const defaultCenter = {
  lat: 19.4326, // Default to Mexico City
  lng: -99.1332,
};

function GoogleMapsAddressPicker({ onAddressSelect, initialAddress }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_API_KEY",
    libraries,
  });

  const [marker, setMarker] = useState(null);
  const searchBoxRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isLoaded && initialAddress?.street && initialAddress?.city) {
      const addressString = `${initialAddress.number} ${initialAddress.street}, ${initialAddress.city}, ${initialAddress.postalCode || ''}`;
      geocodeAddressString(addressString);
    }
  }, [isLoaded, initialAddress]);

  const geocodeAddressString = (addressString) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: addressString }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          setMarker(location);
          if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(15);
          }
        } else {
          console.log("No results found for initial address");
        }
      } else {
        console.error("Geocoder failed for initial address due to: " + status);
      }
    });
  };

  const onLoadSearchBox = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setMarker(location);
    if (mapRef.current) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(15);
    }

    const addressComponents = place.address_components;
    const formattedAddress = extractAddressDetails(addressComponents);
    onAddressSelect(formattedAddress);
  };

  const onMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarker(location);
    geocodeLatLng(location);
  };

  const geocodeLatLng = (location) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const addressComponents = results[0].address_components;
          const formattedAddress = extractAddressDetails(addressComponents);
          onAddressSelect(formattedAddress);
        } else {
          console.log("No results found");
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  const extractAddressDetails = (components) => {
    console.log('components', components);

    let street = "";
    let number = "";
    let city = "";
    let postalCode = "";

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const types = component.types;

      if (types.includes("street_number")) {
        number = component.long_name;
      } else if (types.includes("route")) {
        street = component.long_name;
      } else if (types.includes("administrative_area_level_1") && types.includes("political")) {
        city = component.long_name;
      } else if (types.includes("postal_code")) {
        postalCode = component.long_name;
      }
    }
    return { street, number, city, postalCode };
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div>
      <StandaloneSearchBox
        onLoad={onLoadSearchBox}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Street and build number, city, postal code"
          className="border border-gray-300 rounded w-full px-2 py-1 mb-2"
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={marker || defaultCenter}
        zoom={marker ? 15 : 10}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
}

export default GoogleMapsAddressPicker;