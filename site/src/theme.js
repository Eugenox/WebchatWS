
import { createTheme } from '@mui/material/styles';

// export const theme = createTheme({
//   palette: {
//     primary: {
//       main:  "#9E1946",//'#1976d2', 
//     },
//     secondary: {
//       main: '#9c27b0', 
//     },
//     background: {
//       default: '#f5f5f5', 
//       main: "#93E5AB" //
//     },
//   },
//   typography: {
//     fontFamily: 'Roboto, Arial, sans-serif',
//     h1: {
//       fontSize: '2.5rem',
//       fontWeight: 700,
//     },
//     body1: {
//       fontSize: '1rem',
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '8px',
//         },
//       },
//     },
//   },
// });

export const theme = createTheme({
  palette: {
    primary: { main: "#388E3C" },
    background: { default: "#E8F5E9", paper: "#FFFFFF" },
    text: { primary: "#2E7D32", secondary: "#4CAF50" },
    divider: "#C8E6C9",
  },
});
