"use client"
import { Box, Grid, IconButton, Stack, ThemeProvider, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CrashMap from "./CrashMap";
import { CrashData } from "@/types";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, orderBy, query, getDocs, where } from "firebase/firestore";
import Feed from "./Feed";
import {theme} from "../theme/crashes"
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import Filters from "./Filters";
import { SEVERITY_MAPPING, SOURCES } from "@/constants";



export default function App(){

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey!,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain!,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId!,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket!,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_messagingSenderId!,
        appId: process.env.NEXT_PUBLIC_FIREBASE_appId!
    }
    
    const app = initializeApp(firebaseConfig);
    
    const db = getFirestore("montclair-crashes");
    const [pins, setPins] = useState<CrashData[]>()

    const crashesRef = collection(db, "crashes")

    const [source, setSource] = useState<string[]>(SOURCES)
    const [severity, setSeverity] = useState<string[]>(Object.entries(SEVERITY_MAPPING).map((sev) => sev[0]))
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

    useEffect(() => {
        getDocs(query(crashesRef, orderBy("date", "desc"))).then((querySnapshot) => {
            const results: CrashData[] = []
            querySnapshot.forEach((doc) => {
                results.push({...doc.data(), id: doc.id} as CrashData)
            })
            setPins(results)
        });
    }, [])

    useEffect(() => {
        const mappedSeverity = severity.length === 0 ? Object.entries(SEVERITY_MAPPING).map((sev) => sev[0]) : severity.map((sev) => SEVERITY_MAPPING[sev])
        getDocs(query(crashesRef, where("source", "in", source.length === 0 ? SOURCES : source), where("severity", "in", mappedSeverity), orderBy("date", "desc"))).then((querySnapshot) => {
            const results: CrashData[] = []
            querySnapshot.forEach((doc) => {
                results.push({...doc.data(), id: doc.id} as CrashData)
            })
            setPins(results)
        });
    }, [source, severity])


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
            <Stack direction='row' justifyContent={'space-between'}>
                <Typography 
                    variant="h3">
                        Feed
                </Typography>
                <Stack direction='row'>
                    <Tooltip title="Sort">
                        <IconButton>
                            <SortIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Filter">
                        <IconButton onClick={() => setFiltersOpen(true)}>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
                <Feed pins={pins}/>
            </Grid>
        </Grid>
        <Filters open={filtersOpen} setOpen={setFiltersOpen} source={source} setSource={setSource} severity={severity} setSeverity={setSeverity}/>
        </ThemeProvider>
    )
}