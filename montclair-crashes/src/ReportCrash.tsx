"use client"
import { Stack, Box, FormControl, Typography, TextField, Button, Tabs, Tab, ThemeProvider } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MapsAutocomplete from "./ReportForm/MapsAutoComplete";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapView from "./ReportForm/MapView";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { CrashPosition } from "@/types";
import { initializeApp } from "firebase/app";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { v4 } from "uuid";
import { redirect } from "next/navigation";
import { theme } from "@/theme/crashes";

export default function ReportCrash(){
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_apiKey!,
            authDomain: process.env.FIREBASE_authDomain!,
            projectId: process.env.FIREBASE_projectId!,
            storageBucket: process.env.FIREBASE_storageBucket!,
            messagingSenderId: process.env.FIREBASE_messagingSenderId!,
            appId: process.env.FIREBASE_appId!
        };
    
    const app = initializeApp(firebaseConfig);
    
    const db = getFirestore("montclair-crashes");
    
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const [tab, setTab] = useState(0);

    const [date, setDate] = useState<PickerValue>();
    const [location, setLocation] = useState<CrashPosition>();
    const [description, setDescription] = useState<string>();
    const [placeDescription, setPlaceDescription] = useState<string>();
    const [link, setLink] = useState<string>();
    const [source, setSource] = useState<string | undefined>("Eyewitness");


    const submitCrash = useCallback(() => {
        setDoc(doc(db, "crashes", v4()), {
            newsLink: link || '', 
            source: source,
            placeDescription: placeDescription,
            position: location,
            severity: "s",
            description: description,
            date: date?.toISOString()
        }).then(() => {
            redirect("/")
        })
    }, [date, location, db, description])


    return (
        <ThemeProvider theme={theme}>
        <Box>
        <Stack spacing={2} sx={{width : "500px", ml: "calc(50% - 250px)", p: 2}}>
            <Box>
                <Typography  variant="h3">Report a Crash</Typography>
            </Box>
        <FormControl sx={{width: "500px"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker onChange = {setDate} label={"Date of Crash *"}/>
            </LocalizationProvider>
        </FormControl>
        <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY!}>
            <Tabs value={tab} onChange={(event, val) => setTab(val)} sx={{ "& .MuiTab-root" : {fontFamily: "monospace"}, "& .Mui-selected" : {color: '#26311b'}, "& .MuiTabs-indicator" : {backgroundColor: '#26311b'} }}>
                <Tab id={"tab1"} label="Search" />
                <Tab id={"tab2"} label="Map View"/>
            </Tabs>

            {tab === 0 && <MapsAutocomplete onPlaceSelect={(place) => {
                    console.log(place)
                    if(place?.geometry?.location?.lat() && place?.geometry?.location?.lng()){
                        setLocation({latitude: place?.geometry?.location?.lat(), longitude: place?.geometry?.location?.lng()})
                    }
                    if(place?.name){
                        setPlaceDescription(place?.name)
                    } 
                }}/>}
            {tab === 1 && <MapView setPlaceDescription = {setPlaceDescription} onDrag = {(e) => {
                    if(e.latLng){
                        setLocation({latitude: e.latLng?.lat(), longitude: e.latLng?.lng()})
                    }
                }} />}
        </APIProvider>
        <FormControl sx={{width: "500px"}} required={true}>
            <TextField onChange={(e) => setDescription(e.target.value)} label={"Description"} required={true}/>
        </FormControl>
        
        <TextField onChange={(e) => setLink(e.target.value)} label={"News Coverage Link or Social Media Post"}></TextField>
        <TextField value={source} onChange={(e) => setSource(e.target.value)} label={"Source"}></TextField>
        <input
      ref={uploadInputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={() => {}}
    />
    <Button
        endIcon={<FileUploadIcon />}
      onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
      variant="contained" sx={{backgroundColor: "#26311b"}}>
      Upload an Image
    </Button>

    <Button
      onClick={submitCrash}
      variant="contained" sx={{backgroundColor: "#26311b"}}>
      Submit
    </Button>
        </Stack>
        </Box>
        </ThemeProvider>
    )
}