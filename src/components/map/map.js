import React, { useState, useEffect, useCallback, useRef } from "react";
// import ReactMapGL, {Marker} from 'react-map-gl';
import GoogleMapReact from 'google-map-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { REACT_APP_MAP_TOKEN } from '../../config';
import supercluster from 'points-cluster';

const MapComponent = props => { 
    const [selected, updateSelected] = useState(props.selected);
    const state = props.state;
    const [view, updateView] = useState(props.view);

    const [mapState, updateMapState] = useState({});
    const [batchMarkers, updateBatchMarkers] = useState([]);
    const [bottleMarkers, updateBottleMarkers] = useState([]);
    const [packageMarkers, updatePackageMarkers] = useState([]);
    const [reactMap, updateReactMap] = useState(null);
    const [map, updateMap] = useState(null);
    const [maps, updateMaps] = useState(null);
    const [places, updatePlaces] = useState([])
    const [clusters, updateClusters] = useState([]);

    useEffect(() => {
        updateMapState(props.state);
        updateSelected(props.selected);
        
        setTimeout(() => {
            if(selected && view.distribution){
                let markerArr = [];
                let length = selected.length - 1;
                selected.forEach((item, i) => {
                    let obj = {};

                    if(item.status) {
                        obj = item.status.EventLocation;
                        if(item.status.EventType === 'NEW') obj.color = "blue";
                        if(item.status.EventType === 'RECEIVED') obj.color = "green";
                        if(item.status.EventType === 'DISTRIBUTED') obj.color = "yellow";
                        obj.data = item;
                        obj.key = i;
                        markerArr.push(obj)
                    }   
    
                    if(length === i) return updateMarkers(markerArr);
                })
            } else if (selected && view.consumer) {
                console.log(selected)
                let markerArr = [];
                let length = selected.length - 1;
                selected.forEach((item, i) => {
                    if(item.AuthenticateResult) {
                        let obj = item.Location;
                    
                        if(item.AuthenticateResult === 'FAIL') obj.color = "rgb(228, 32, 19)";
                        else {
                            if(item.BottleSCEventStatus === "WineReceivedByDistributorEvent") {
                                obj.color = "green";
                            } else if(item.BottleSCEventStatus === "UnregisteredBottleEvent") {
                                obj.color = "orange";
                            } else {
                                obj.color = "yellow";
                            }
                        }
                        obj.data = item;
                        obj.key = i;
                        markerArr.push(obj)
                    }

                    if(length === i) return updateMarkers(markerArr);
                })
            } 
            if(selected && !selected.length) {
                updateMarkers([]);
            }

        }, 200)
        

        function updateMarkers(markers) {
            updatePlaces(markers);
            if(markers.length && map && maps){ 
                boundStart(map, maps, markers);
            } else {
                updateClusters([]);
            }
        }
        
    }, [props, state, selected, map, maps, view])

    const apiIsLoaded = (map, maps, places) => {
        updateMap(map);
        updateMaps(maps);
    };

    const boundStart = (map, maps, places) => {
        updateMap(map);
        updateMaps(maps);
        // Get bounds by our places
        const bounds = getMapBounds(map, maps, places);
        // Fit map to bounds
        map.fitBounds(bounds);
        var zoom = map.getZoom();
        map.setZoom(zoom > 0 ? 0 : zoom);
        // Bind the resize listener
        bindResizeListener(map, maps, bounds);
    };
    
    const bindResizeListener = (map, maps, bounds) => {
        maps.event.addDomListenerOnce(map, 'idle', () => {
            maps.event.addDomListener(window, 'resize', () => {
            map.fitBounds(bounds);
            var zoom = map.getZoom();
            map.setZoom(zoom > 0 ? 0 : zoom);
            });
        });
    };

    const getMapBounds = (map, maps, places) => {
        const bounds = new maps.LatLngBounds();

        const clusters = getClusters(places, map.getCenter(), map.getZoom(), map).map(({ wx, wy, numPoints, points }) => ({
            lat: wy,
            lng: wx,
            numPoints,
            id: `${numPoints}_${points[0].id}`,
            points,
        }));

        updateClusters(clusters);
      
        places.forEach((place) => {
          bounds.extend(new maps.LatLng(
            place.Latitude,
            place.Longitude,
          ));
        });
        return bounds;
    };

    const selectMarker = e => {
        if(e) props.mapClick(e);
    }

    const getClusters = (props, center, zoom, map) => {
        const markerArr = [];
        props.forEach(item => {
            const obj = {};
            obj.lat = item.Latitude;
            obj.lng = item.Longitude;
            obj.data = item.data;
            obj.color = item.color;
            markerArr.push(obj);
        })
        const clusters = supercluster(markerArr, {
          minZoom: 0,
          maxZoom: 16,
          radius: 5,
        });
        // console.log(zoom)
        // console.log(map)
        // let nef = map.getBounds().getNorthEast();
        // let swf = map.getBounds().getSouthWest();


        // const ne = {
        //     lat: nef.lat(),
        //     lng: nef.lng()
        // }

        // const sw = {
        //     lat: swf.lat(),
        //     lng: swf.lng()
        // }

        // const editedBounds = {
        //     ne: ne,
        //     sw: sw,
        // }

        // console.log(editedBounds)
        // const k = { 
        //     bounds: { 
        //         nw: { lat: 85, lng: -180 }, 
        //         se: { lat: -85, lng: 180 } 
        //     }, 
        //     zoom: zoom
        // }
    
        return clusters({bounds: { nw: { lat: 85, lng: -180 }, se: { lat: -85, lng: 180 } }, zoom: zoom})
    };
    
    const CustomMarker = ({ color, data }) => <div onClick={() => selectMarker(data)} style={{height: "20px", width: "20px", backgroundColor: `${color}`}}></div>;
    const CustomCluster = ({ points, numPoints , data}) => points.map((item, i) => 
            <div>
                { i === 0 && <div style={{position: "absolute", fontSize: '18px', fontWeight: 800, zIndex: 10, color: "#000", top: "-22px", marginLeft: "5px"}}>{numPoints} </div>}
                <div style={{position: "absolute", margin: i < 5 ? `${2 * i}px` : ''}}>
                    <CustomMarker 
                        lat={item.lat}
                        lng={item.lng}
                        key={i + item.lat}
                        color={item.color}
                        data={item.data}
                        >
                    </CustomMarker>
                </div>
            </div>)
    
    return (
        <div className="container">
            <div style={{ height: mapState.height, width: '100%'}}>
                <GoogleMapReact
                ref={(ref) => { updateReactMap(ref) }}
                zoom={1}
                defaultCenter={{ lat: mapState.latitude, lng: mapState.longitude }}
                bootstrapURLKeys={{ key: REACT_APP_MAP_TOKEN }}
                onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, places)}
                yesIWantToUseGoogleMapApiInternals={true}
                minZoom={1}
                >  
                 {clusters.map((item, i) => {
                    if (item.numPoints === 1) {
                      return (
                        <CustomMarker
                            lat={item.points[0].lat}
                            lng={item.points[0].lng}
                            key={i}
                            color={item.points[0].color}
                            data={item.points[0].data}
                        />
                      );
                    } else {
                        return (
                            <CustomCluster
                                lat={item.lat}
                                lng={item.lng}
                                points={item.points}
                                numPoints={item.numPoints}
                                data={item.data}
                                key={i + item.lat}
                            />
                        );
                    }
        
                    })}
                </GoogleMapReact>
            </div>
        </div>
    );
}

export default MapComponent;
