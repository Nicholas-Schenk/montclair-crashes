import React, { useCallback, useState } from "react";
import { AdvancedMarker, Pin, useAdvancedMarkerRef} from '@vis.gl/react-google-maps';
import CrashInfoWindow from "../CrashInfoWindow";
import { CrashData } from "@/types";

export default function CrashMarker({onDrag, pin, draggable}: {onDrag ?: (e: google.maps.MapMouseEvent) => void, pin: CrashData,  draggable: boolean}){
    const parser = new DOMParser();
    const svgString = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-240v-200 200ZM80-440l84-240q6-18 21.5-29t34.5-11h183q-3 20-3 40t3 40H234l-42 120h259q17 24 38 44.5t47 35.5H160v200h560v-163q21-3 41-9t39-15v307q0 17-11.5 28.5T760-80h-40q-17 0-28.5-11.5T680-120v-40H200v40q0 17-11.5 28.5T160-80h-40q-17 0-28.5-11.5T80-120v-320Zm540 160q25 0 42.5-17.5T680-340q0-25-17.5-42.5T620-400q-25 0-42.5 17.5T560-340q0 25 17.5 42.5T620-280Zm-360 0q25 0 42.5-17.5T320-340q0-25-17.5-42.5T260-400q-25 0-42.5 17.5T200-340q0 25 17.5 42.5T260-280Zm420-200q-83 0-141.5-58.5T480-680q0-82 58-141t142-59q83 0 141.5 58.5T880-680q0 83-58.5 141.5T680-480Zm-20-160h40v-160h-40v160Zm20 80q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6Z"/></svg>'
    const minorCrashSvgString = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M320-704 200-824l56-56 120 120-56 56Zm320 0-56-56 120-120 56 56-120 120Zm-200-56v-200h80v200h-80ZM160 0q-17 0-28.5-11.5T120-40v-320l84-240q6-18 21.5-29t34.5-11h440q19 0 34.5 11t21.5 29l84 240v320q0 17-11.5 28.5T800 0h-40q-17 0-28.5-11.5T720-40v-40H240v40q0 17-11.5 28.5T200 0h-40Zm72-440h496l-42-120H274l-42 120Zm68 240q25 0 42.5-17.5T360-260q0-25-17.5-42.5T300-320q-25 0-42.5 17.5T240-260q0 25 17.5 42.5T300-200Zm360 0q25 0 42.5-17.5T720-260q0-25-17.5-42.5T660-320q-25 0-42.5 17.5T600-260q0 25 17.5 42.5T660-200Zm-460 40h560v-200H200v200Zm0 0v-200 200Z"/></svg>'
    const pinSvg = parser.parseFromString(
        svgString,
        "image/svg+xml",
      ).documentElement;

      const minorSvg = parser.parseFromString(
        minorCrashSvgString,
        "image/svg+xml",
      ).documentElement;
    const [markerRef, marker] = useAdvancedMarkerRef();

    const [infoWindowShown, setInfoWindowShown] = useState(false);

    // clicking the marker will toggle the infowindow
    const handleMarkerClick = useCallback(() => {
      console.log("called")
      setInfoWindowShown(isShown => !isShown)
    }, []);
  
    // if the maps api closes the infowindow, we have to synchronize our state
    const handleClose = useCallback(() => setInfoWindowShown(false), []);
    
    return (
        <AdvancedMarker clickable={true} onClick={onDrag === undefined ? handleMarkerClick: undefined} ref={markerRef} onDragEnd={onDrag} draggable={draggable} key={pin.id} position={{lat: pin.position.latitude, lng: pin.position.longitude}}>
            <span onClick={onDrag === undefined ? handleMarkerClick: undefined}>
            <Pin background={pin.severity !== "s" ? "#fcba03" : undefined} borderColor={pin.severity !== "s" ? "goldenrod" : undefined} glyph={pin.severity === "s" ? pinSvg: minorSvg}/>
            </span>
            {
              infoWindowShown && <CrashInfoWindow pin={pin} markerRef={marker} onClose={handleClose} />
            }
        </AdvancedMarker>
    )
}