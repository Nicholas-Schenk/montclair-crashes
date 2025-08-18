"use client"
import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { CrashData } from "@/types";
import { CarCrash, MinorCrash } from "@mui/icons-material";
import Link from "next/link";

export default function FeedItem({pin}: {pin : CrashData}){

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const date_str = date.toLocaleString('default', {month: 'short', day: 'numeric', year: 'numeric'})
        if(date_str === "Invalid Date"){
            return dateString
        } else {
            return date_str
        }
    }
    const theme = useTheme()

    const severityColorMap: {[key: string]: string | undefined} = {
        "f": "red",
        "s": "#fcba03",
        "m": "#FF8C00",
        "p": "#90EE90"
      }

    return (
        <Stack sx={{ backgroundColor: 'white', border: `2px solid ${severityColorMap[pin.severity]}`, borderRadius: "4px", width: "calc(100% - 4px)x", p: 1}}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" sx={{color: theme.palette.green.main}}>{pin.placeDescription}</Typography>
                    {pin.severity === "s" || pin.severity === "f" ? <CarCrash sx={{color: severityColorMap[pin.severity]}}/> : <MinorCrash sx={{color: severityColorMap[pin.severity]}}/>}
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