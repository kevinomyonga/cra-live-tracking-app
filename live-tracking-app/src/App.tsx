// import "./styles.css";
import "./App.css";
import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Location } from "./location";
import axios from "axios";

type DriverNode = {
  id: string;
  name: string;
  field_address: {
    locality: string;
    postal_code: string;
    address_line1: string;
    address_line2: string;
    latitude: number;
    longitude: number;
  };
};

type Post = {
  id: string;
  title: string;
  body: string;
};

const baseURL = "https://jsonplaceholder.typicode.com/posts/";

function App() {
  const [posts, setPosts] = React.useState<Post[]>([]);

  const [drivers, setDrivers] = React.useState<DriverNode[]>([]);

  const mapRef = React.useRef<any>(null);

  const center = {
    lat: -1.25874,
    lng: 36.80705,
  };

  const [selectedDriver, setSelectedDriver] = React.useState<
    DriverNode | undefined | null
  >(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
  });
  const onLoad = React.useCallback(
    (mapInstance: { fitBounds: (arg0: google.maps.LatLngBounds) => void }) => {
      const bounds = new google.maps.LatLngBounds();
      drivers.forEach((driver) => {
        bounds.extend(
          new google.maps.LatLng(
            driver.field_address.latitude,
            driver.field_address.longitude
          )
        );
      });
      mapRef.current = mapInstance;
      mapInstance.fitBounds(bounds);
    },
    [drivers]
  );
  const onClickMarker = (driverId: string) => {
    setSelectedDriver(drivers.find((driver) => driver.id === driverId));
  };

  const [position, setPosition] = React.useState<Location>({
    lat: -1.283,
    lng: 36.886,
  });

  const [position1, setPosition1] = React.useState<Location>({
    lat: -1.2981809300176104,
    lng: 36.81389269181993,
  });

  const [position2, setPosition2] = React.useState<Location>({
    lat: -1.2838383570574217,
    lng: 36.88646040405273,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log("This will be called every 2 seconds");

      var drivers = [
        {
          id: "1",
          name: "Driver 1 - John Doe",
          field_address: {
            locality: "Gent",
            postal_code: "9000",
            address_line1: "Veldstraat 1",
            address_line2: "a",
            latitude: position1.lat,
            longitude: position1.lng,
            // latitude: -1.2981809300176104,
            // longitude: 36.81389269181993,
          },
        },
        {
          id: "2",
          name: "Driver 2 - Jason Bourne",
          field_address: {
            locality: "Brussel",
            postal_code: "1000",
            address_line1: "Nieuwstraat 1",
            address_line2: "a",
            latitude: position.lat,
            longitude: position.lng,
            // latitude: -1.3929266969102616,
            // longitude: 36.73953800728193,
          },
        },
        {
          id: "3",
          name: "Driver 3 - Max Payne",
          field_address: {
            locality: "Antwerpen",
            postal_code: "2000",
            address_line1: "Meir 1",
            address_line2: "a",
            latitude: position2.lat,
            longitude: position2.lng,
            // latitude: -1.2838383570574217,
            // longitude: 36.88646040405273,
          },
        },
      ];

      setDrivers(drivers);

      if (drivers.length > 0) {
        //debugger;
        // let position = {marker.field_address.latitude, marker.field_address.longitude};
        // position.lat = position.lat - 0.005;
        // position.lng = position.lng - 0.005;
        // marker.field_address.latitude = position;

        var markerPosition = position;
        markerPosition.lat = position.lat - 0.00005;
        markerPosition.lng = position.lng - 0.00005;

        var markerPosition1 = position1;
        markerPosition1.lat = position1.lat + 0.00005;
        markerPosition1.lng = position1.lng + 0.00005;

        var markerPosition2 = position2;
        markerPosition2.lat = position2.lat + 0.0;
        markerPosition2.lng = position2.lng + 0.00005;

        setPosition(markerPosition);
        setPosition1(markerPosition1);
        setPosition2(markerPosition2);
      }
    }, 2000);

    // Load data from API
    axios.get(baseURL).then((response) => {
      setPosts(response.data);
    });

    return () => clearInterval(interval);
  }, [position, drivers]);

  return (
    <div className="App">
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "60%" }}>
          {isLoaded && (
            <>
              <GoogleMap
                mapContainerClassName="c-office-overview__map"
                onLoad={onLoad}
              >
                {drivers.map((driver) => (
                  //   <Marker
                  //     key={driver.id}
                  //     onClick={() => onClickMarker(driver.id)}
                  //     position={position}
                  //   />
                  // ))}
                  <Marker
                    key={driver.id}
                    onClick={() => onClickMarker(driver.id)}
                    position={{
                      lat: driver.field_address.latitude,
                      lng: driver.field_address.longitude,
                    }}
                  />
                ))}
                {selectedDriver && (
                  <InfoWindow
                    position={{
                      lat: selectedDriver.field_address.latitude,
                      lng: selectedDriver.field_address.longitude,
                    }}
                    onCloseClick={() => setSelectedDriver(null)}
                  >
                    <p>{selectedDriver.name}</p>
                  </InfoWindow>
                )}
              </GoogleMap>
            </>
          )}
        </div>
        <div style={{ width: "40%", overflow: "auto", height: "100vh" }}>
          <h1>Drivers List</h1>
          {posts.map((post) => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
