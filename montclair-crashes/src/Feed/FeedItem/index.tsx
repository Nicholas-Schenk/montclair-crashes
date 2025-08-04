"use client"
import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { CrashData } from "@/types";
import { CarCrash, MinorCrash } from "@mui/icons-material";
import Link from "next/link";

export default function FeedItem({pin}: {pin : CrashData}){

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('default', {month: 'short', day: 'numeric', year: 'numeric'})
    }
    const theme = useTheme()

    return (
        <Stack sx={{ backgroundColor: 'white', border: `2px solid ${pin.severity === "severe" ? theme.palette.severe.main: theme.palette.minor.main}`, borderRadius: "4px", width: "calc(100% - 4px)x", p: 1}}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" sx={{color: theme.palette.green.main}}>{pin.placeDescription}</Typography>
                    {pin.severity === "severe" ? <CarCrash /> : <MinorCrash sx={{color: theme.palette.minor.main}}/>}
                </Stack>
                <Typography sx={{ pt: 1, fontWeight: 500, color: theme.palette.grey[500]}}>{formatDate(pin.date)}</Typography>
            </Stack>
            <Typography sx={{py: 0.75, px: 1}}>{pin.description}</Typography>
            <Stack justifyContent={'space-between'} direction={'row'} sx={{pt: 1}}>
                <Typography sx={{fontStyle: 'italic', color: theme.palette.grey[500]}}>Source: {pin.source || "Eyewitness"}</Typography>
                <Typography sx={{fontStyle: 'italic', color: theme.palette.grey[500]}}>{pin.newsLink && <Link href={pin.newsLink}>More Details</Link>}</Typography>
            </Stack>
        </Stack>
    )
}