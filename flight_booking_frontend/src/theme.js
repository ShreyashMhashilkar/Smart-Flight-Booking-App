import { createTheme } from "@mui/material/styles";

const PURPLE_MAIN = "#5D3FD3"; // a soft, rich purple
const PURPLE_LIGHT = "#9276E1"; // lighter purple
const ORANGE = "#FF8C42"; // warm amber/orange

const theme = createTheme({
  palette: {
    primary: {
      main: PURPLE_MAIN,
      light: PURPLE_LIGHT,
      contrastText: "#fff",
    },
    secondary: {
      main: "#fff",
      contrastText: PURPLE_MAIN,
    },
    warning: {
      main: ORANGE,
      contrastText: "#fff",
    },
    background: {
      default: "#f7f8fc",
      paper: "rgba(255,255,255,0.95)",
    },
    text: {
      primary: "#332D5C",
      secondary: PURPLE_MAIN,
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Inter','Roboto','Arial',sans-serif",
    h6: { fontWeight: 700 },
    h4: { fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          boxShadow: "0 8px 48px 0 #9e8cff33",
          background: "rgba(255,255,255,0.96)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px #5D3FD340",
          borderRadius: 16,
          fontWeight: 700,
        },
        containedPrimary: {
          background: `linear-gradient(90deg, ${PURPLE_MAIN} 0%, ${PURPLE_LIGHT} 100%) !important`,
        },
        containedWarning: {
          background: `linear-gradient(90deg, #ffbe75 0%, ${ORANGE} 100%) !important`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 8px 32px #9e8cff44",
          background: "rgba(255,255,255,0.97)",
          color: "#332D5C",
          transition: "all 0.25s ease"
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: "0.02em",
        },
      },
    },
  },
});

export default theme;
