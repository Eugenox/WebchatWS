import "./main.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Typography, Box } from "@mui/material";
import ChannelsList from "../components/channels-list";

const theme = createTheme({
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: "'Press Start 2P', system-ui",
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontFamily: "Arial, sans-serif", 
          },
        },
      },
    },
  });

export default function Main() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" justifyContent="space-between" alignItems="center" p={50} sx={{
         background: "linear-gradient(34deg, rgba(20,112,23,1) 0%, rgba(17,97,47,1) 39%, rgba(42,124,78,1) 100%)",
         minHeight: "100vh", 
         display: "flex",
         flexDirection: "column",
         justifyContent: "center",
         alignItems: "center",
         textAlign: "center",
         p: 5,
         color: 'rgba(243, 239, 239, 0.93)'
      }}>
        <Typography variant="h4" gutterBottom>
          Welcome to WSChat!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Start a online talk with few clicks
        </Typography>
        <ChannelsList className="list" />
      </Box>
    </ThemeProvider>
  );
}
