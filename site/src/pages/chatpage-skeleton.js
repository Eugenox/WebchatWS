import {
    Skeleton,
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    breadcrumbsClasses,
    IconButton,
    Drawer,
    Box,
  } from "@mui/material";
import Grid from "@mui/material/Grid2";
import MenuIcon from "@mui/icons-material/Menu";

export default function ChatSkeleton() {
  return (
    <>
      <AppBar position="static" sx={{ paddingBottom: 4 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { xs: "block", sm: "none" }, mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Skeleton variant="text" width={200} height={32} sx={{ flexGrow: 1 }} />

          <Skeleton variant="circular" width={24} height={24} />
        </Toolbar>
      </AppBar>


      <Box sx={{ padding: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={150} />
      </Box>

      <Grid container spacing={1}>

        <Grid item xs={12} sm={8} md={8}>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Grid>

 
        <Grid item xs={0} sm={2} md={2} sx={{ display: { xs: "none", sm: "block" } }}>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Grid>
      </Grid>


      <Grid item xs={12} sm={8} md={8}>
        <Skeleton variant="rectangular" width="100%" height={50} />
      </Grid>

      <Drawer anchor="left" open={false} sx={{ display: { xs: "block", sm: "none" } }}>
        <Box sx={{ width: 250, padding: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      </Drawer>
    </>
  );
}
