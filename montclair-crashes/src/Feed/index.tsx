"use client"
import { Stack } from "@mui/material";
import React from "react";
import { CrashData } from "@/types";
import FeedItem from "./FeedItem";

export default function Feed({pins}: {pins ?: CrashData[]}){
    return (
        <Stack spacing={2} sx={{overflowY: 'auto', overflowX: 'visible', width: "calc(100% - 16px)", height: 'calc(100% - 36px)', pt: 2}}>
            {pins?.map((pin) => <FeedItem pin={pin}/>)}
        </Stack>
    )
}