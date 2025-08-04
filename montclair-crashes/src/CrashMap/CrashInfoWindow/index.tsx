import React from "react";
import { InfoWindow} from '@vis.gl/react-google-maps';
import { CrashData } from "@/types";
import FeedItem from "@/src/Feed/FeedItem";
import { Box } from "@mui/material";

export default function CrashInfoWindow({pin, markerRef, onClose}:{pin: CrashData, markerRef: google.maps.marker.AdvancedMarkerElement | null, onClose: () => void}){

    return (
        <InfoWindow anchor={markerRef} onClose={onClose}>
            <Box sx={{width: "calc(100% - 20px)"}}>
                <FeedItem pin={pin}/>
            </Box>
        </InfoWindow>
    )
}