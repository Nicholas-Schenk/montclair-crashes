"use client"
import { Box, Grid, ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import CrashMap from "./CrashMap";
import { CrashData } from "@/types";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import Feed from "./Feed";
import {theme} from "../theme/crashes"

export default function App(){

    const firebaseConfig = {
        apiKey: process.env.FIREBASE_apiKey!,
        authDomain: process.env.FIREBASE_authDomain!,
        projectId: process.env.FIREBASE_projectId!,
        storageBucket: process.env.FIREBASE_storageBucket!,
        messagingSenderId: process.env.FIREBASE_messagingSenderId!,
        appId: process.env.FIREBASE_appId!
    }
    
    const app = initializeApp(firebaseConfig);
    
    const db = getFirestore("montclair-crashes");
    const [pins, setPins] = useState<CrashData[]>()
    
    getDocs(collection(db, "crashes")).then((querySnapshot) => {
        const results: CrashData[] = []
        querySnapshot.forEach((doc) => {
            results.push({...doc.data(), id: doc.id} as CrashData)
        })
        setPins(results)
    });


    return (
        <ThemeProvider theme={theme}>
        <Grid container spacing={2} sx={{padding: 2, height: "calc(100vh - 136px)"}} >
            <Grid size={{xs: 12, md: 6}} sx={{height: "100%"}}>
                <Typography 
                    variant="h3">
                        Crash Map
                </Typography>
                <Box sx={{height: { xs: "calc(100% - 56px)", s: "100%", md: "100%", lg: "100%", xl: "100%"}, width: "100%", pt: 2}}>
                    <CrashMap pins={pins}/>
                </Box>
            </Grid>
            <Grid size={{xs: 12, md: 6}} sx={{height: "100%"}}>
                <Typography 
                    variant="h3">
                        Feed
                </Typography>
                <Feed pins={pins}/>
            </Grid>
        </Grid>
        </ThemeProvider>
    )
}