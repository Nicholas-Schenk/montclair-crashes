"use client"
import { SEVERITY_MAPPING, SOURCES } from "@/constants";
import { Box, Button, Checkbox, Drawer, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";

type FiltersProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    source: string[];
    setSource: Dispatch<SetStateAction<string[]>>;
    severity: string[];
    setSeverity: Dispatch<SetStateAction<string[]>>
    
}

export default function Filters({open, setOpen, source, setSource, severity, setSeverity}: FiltersProps){

    const [localSource, setLocalSource] = useState<string[]>(source)
    const [localSeverity, setLocalSeverity] = useState<string[]>(severity)

    const handleSourceChange = (event: SelectChangeEvent<string[]>) => {
        const {
          target: { value },
        } = event;
        setLocalSource(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const handleSeverityChange = (event: SelectChangeEvent<string[]>) => {
        const {
          target: { value },
        } = event;
        console.log(value)
        setLocalSeverity(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const handleApply = () => {
        setSeverity(localSeverity)
        setSource(localSource)
        setOpen(false)
    }

    return (
        <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
            <Box sx={{width: '500px', padding: 2}}>
                <Typography variant="h5">Filters</Typography>
                <Stack spacing={2} sx={{pt:2}}>
                    <Box>
                        <InputLabel id="source-select-label">Source</InputLabel>
                        <Select
                            fullWidth
                            id="source-select"
                            labelId="source-select-label"
                            multiple
                            value={localSource}
                            onChange={handleSourceChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {SOURCES.map((sourceVal) => (
                              <MenuItem key={sourceVal} value={sourceVal}>
                                <Checkbox checked={localSource.includes(sourceVal)} />
                                <ListItemText primary={sourceVal} />
                              </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box>
                        <InputLabel id="severity-select-label">Severity</InputLabel>
                        <Select
                            fullWidth
                            id="severity-select"
                            labelId="severity-select-label"
                            multiple
                            value={localSeverity}
                            onChange={handleSeverityChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {Object.entries(SEVERITY_MAPPING).map((display) => {
                              return (<MenuItem key={display[0]} value={display[0]}>
                                <Checkbox checked={localSeverity.includes(display[0])} />
                                <ListItemText primary={display[0]} />
                              </MenuItem>)
})}
                        </Select>
                    </Box>
                </Stack>
            </Box>
            <Box sx={{width:'calc(100% - 32px)', p:2}} position={'absolute'} bottom={10}>
                <Stack sx={{width:'100%'}} direction={'row'} justifyContent={'space-evenly'} alignContent={'center'}>
                    <Button variant="outlined" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleApply}>
                        Apply
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    )
}