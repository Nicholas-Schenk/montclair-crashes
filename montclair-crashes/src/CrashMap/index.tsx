import { Box } from "@mui/material";
import React from "react";
import { APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
import CrashMarker from "./CrashMarker";
import { CrashData } from "@/types";

export default function CrashMap({pins}: {pins?: CrashData[]}){
    return (
        <Box sx={{backgroundColor: "red", height: "100%", width: "100%"}}>
          <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY!}>
            <Map 
              mapId={"montclair-crashes"} 
              
              defaultZoom={13}
              defaultCenter={ {lat: 40.82427348619662, lng: -74.21232593307967}}
              onCameraChanged={ (ev: MapCameraChangedEvent) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
              }>
                {pins?.map((pin) => <CrashMarker key={pin.id + "marker"} pin={pin} draggable={false}/>)}
            </Map>
          </APIProvider>
        </Box>
    )
}