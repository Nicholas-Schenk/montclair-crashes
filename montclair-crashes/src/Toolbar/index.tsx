"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import Link from 'next/link';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme/crashes';

const pages = [{title: 'Home', val: "/"}, {title: 'Report a Crash', val: "/report"}];

function ResponsiveAppBar() {


  return (
    <ThemeProvider theme={theme}>
    <AppBar position="static" sx={{backgroundColor: "#26311b"}}>
      <Box sx={{px: 4}}>
        <Toolbar disableGutters>
          <CarCrashIcon sx={{ display: 'flex', mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: 'flex',
            }}
          >
            Montclair Crashes
          </Typography>

          <Box sx={{ justifyContent: 'right',  flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
                <Typography sx={{textDecoration: 'none', fontFamily: '"Roboto Condensed", sans-serif', color: 'white', px: 2}} component="a" href={page.val}>{page.title}</Typography>
            ))}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;