import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import connection from '../config.json'
import Chat from "../components/chat/chat";

import TextInput from "../components/chat/text-input";
import UserList from "../components/user-list";
import AlertDialog from "../components/alert-dialog"
import LoginForm from "../components/loginform";

import MenuIcon from "@mui/icons-material/Menu";

import {
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

export default function ChatPage({ data }){
    const {query} = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const [userListOpen, setUserListOpen] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [isInvalid, setInvalid] = useState(false)

    const {setSocketUrl,WS_MESSAGE_SET_HISTORY, WS_MESSAGE_GET_HISTORY, WS_USERS_GET, sendMessage, lastMessage, readyState} = data
     const WS_STATUS = {
        [readyState.CONNECTING]: "Connecting",
        [readyState.OPEN]: "Open",
        [readyState.CLOSING]: "Closing",
        [readyState.CLOSED]: "Closed",
        [readyState.UNINSTANTIATED]: "Uninstantiated",
      }[readyState];

      useEffect(() => {
        document
          .querySelector('title')
          ?.setAttribute("content", `#${query}`);
        document
          .querySelector('meta[property="og:description"]')
          ?.setAttribute("content", `Join to ${query}`);
      }, [query]);

      useEffect(() => {
        WS_MESSAGE_SET_HISTORY([]);
      }, [location.pathname]); 

      useEffect(() => {
        
        (async () => {
          try {
              console.log(process.env.PUBLIC_URL)
              const response = await fetch(`${connection.domain}/getChannels`);
              const data = await response.json();
              
               if ( !data.find((c) => c.name == query) ) {
                setInvalid(true)
               }
                
          } catch(err) {
            console.error(err);
          } finally {
            //setLoading(false);
         }
        })()
  
      }, [])
    
      

    if (isInvalid) {
        const text = "Sorry, but this chat doesn`t exist. You can go to the main page and create your own channel."
        const handleOK = () => navigate("/")
        return <AlertDialog text={text} handleOK={handleOK}/>
    }

    

      console.log(isLoading )
    return <>
        <AppBar position="static" sx={{ paddingBottom: 4 }}>
        <Toolbar>
        
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", sm: "none" }, mr: 2 }}
            onClick={() => setUserListOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            #{query}
          </Typography>

        
          {WS_STATUS}
        </Toolbar>
      </AppBar>

      <LoginForm setsocket={setSocketUrl} ws_input={sendMessage} query={query} onClose={() => { 
        setLoading(false); 
      }}/>

      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 8, md: 8 }}>
          <Chat ws_output={WS_MESSAGE_GET_HISTORY} loading={isLoading}/>
        </Grid>

        <Grid item xs={0} sm={2} md={2} sx={{ display: { xs: "none", sm: "block" } }}>
          <UserList ws_output={WS_USERS_GET} ws_input={sendMessage} />
        </Grid>
      </Grid>
    
      <Grid size={{ xs: 12, sm: 8, md: 8 }}>
        <TextInput ws_input={sendMessage} />
      </Grid>

      <Drawer
        anchor="left"
        open={userListOpen}
        onClose={() => setUserListOpen(false)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <UserList ws_output={WS_USERS_GET} loading={isLoading}/>
        </Box>
      </Drawer>
    </>
}