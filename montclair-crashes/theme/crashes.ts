import { createTheme, PaletteColorOptions, PaletteOptions, SimplePaletteColorOptions } from "@mui/material";

declare module '@mui/material/styles' {
    interface Palette {
        green: SimplePaletteColorOptions;
        minor: SimplePaletteColorOptions;
        severe: SimplePaletteColorOptions;
    }
    interface PaletteOptions {
        green: SimplePaletteColorOptions;
        minor: SimplePaletteColorOptions;
        severe: SimplePaletteColorOptions;
    }
    // allow configuration using `createTheme()`
    // interface PaletteOptions {
    //     green?: PaletteColorOptions;
    // }
  }

export const theme = createTheme({
    palette: {
        green: {
            light: "#59733f",
            main: "#26311b",
            dark: "#0d1009"
        },
        minor: {
            light: "#fef7e6",
            main: "#fab725",
            dark: "#644502"
        },
        severe: {
            light: "#ff4d4d",
            main: "#ff0000",
            dark: "#b30000"
        },
        grey: {
            300: "#cacecb",
            500: "#939995",
            700: "#636965"
        }
    },
    components: {
      MuiTypography: {
        styleOverrides: {
            h3: {
                fontFamily: '"Roboto Condensed", sans-serif',
                fontWeight: 700,
                color: '#26311b',
                textDecoration: 'none',
                textTransform: 'capitalize'   
            },
            h6: {
            fontFamily: '"Roboto Condensed", sans-serif',
              fontWeight: 400,
              color: 'white',
              textDecoration: 'none',
            },
            h5: {
                fontFamily: '"Roboto Condensed", sans-serif',
                fontWeight: 600,
            }
        },
      },
      MuiLink: {
        styleOverrides :{
            root: {
                textDecoration: 'none', 
                color: 'white', 
                fontFamily: '"Roboto Condensed", sans-serif'
            }
        }
      }
    },
  });