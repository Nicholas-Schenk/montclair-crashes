import { Box } from "@mui/material";
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { APIProvider, Map, MapCameraChangedEvent, useMapsLibrary} from '@vis.gl/react-google-maps';
import CrashMarker from "../CrashMap/CrashMarker";
import { CrashPosition } from "@/types";
import { v4 } from "uuid";

export default function MapView({onDrag, setPlaceDescription}: {setPlaceDescription: Dispatch<SetStateAction<string | undefined>>, onDrag: (e: google.maps.MapMouseEvent) => void}){

    const [localPos, setLocalPos] = useState<CrashPosition>({latitude: 40.82427348619662, longitude: -74.21232593307967});

    const geocodingLib = useMapsLibrary('geocoding');
    const geocoder = useMemo(
        () => geocodingLib && new geocodingLib.Geocoder(),
        [geocodingLib]
    );

    const onPinDrag = useCallback((e: google.maps.MapMouseEvent) => {
        console.log("called")
        geocoder?.geocode({location: e.latLng}).then((geocoderRes) => {
            if(geocoderRes.results.length > 0 && geocoderRes.results[0].address_components.length >= 2){
                const result = geocoderRes.results[0]
                setPlaceDescription(`Near ${result.address_components[0].short_name} ${result.address_components[1].short_name}`)
            }
            onDrag(e)
            if(e.latLng){
                setLocalPos({latitude: e.latLng.lat(), longitude: e.latLng.lng()})
            }
        })
    }, [geocoder, onDrag])


    return (
        <Box sx={{backgroundColor: "red", height: "600px", width: "500px"}}>
            <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY!}>
                <Map 
                    mapId={"montclair-crashes"} 
                    defaultZoom={13}
                    defaultCenter={ {lat: 40.82427348619662, lng: -74.21232593307967}}
                    onCameraChanged={ (ev: MapCameraChangedEvent) =>
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }>
                    <CrashMarker onDrag={onPinDrag} key={"crash-marker"} pin={{id: v4(), severity: "s", position: localPos, date: "", description: "", placeDescription: ""}} draggable={true}/>
                </Map>
            </APIProvider>
        </Box>
    )
}