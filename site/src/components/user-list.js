import {ListItem, ListItemAvatar, ListItemText, Box, Avatar, Typography, Divider, Chip, Tooltip, CircularProgress} from '@mui/material'
import { useEffect, useState } from 'react';
import StarsIcon from '@mui/icons-material/Stars';
import { FixedSizeList } from 'react-window';


// удалять ничего не нужно, тк. можно просто заново перерисовывать 
export default function UserList({ws_output, loading}){
    console.log(loading)
    console.log(ws_output)
    let [users, setUsers] = useState([]);
    // setUsers(ws_output)

 
    useEffect(() => {
        if (ws_output && Array.isArray(ws_output)) {
          setUsers(ws_output);
        }
      }, [ws_output]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         ws_input(JSON.stringify({ type: "getupdate"}))
    //     }, 1000);
    //     return () => clearInterval(interval);
    //   }, []);

    const renderRow = ({ index, style }) => {
        
      

        const user = users[index];
        console.log(users)
        const {name, color, isAdmin} = user
        return <ListItem key={index} component="div" style={style}>
            <ListItemAvatar >
            <Avatar sx={{ bgcolor: `${color}` }}>{name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={name} />
            { isAdmin ? (<Tooltip title={"Власник каналу"}><Chip  icon={<StarsIcon/>} color="success" size='small'/></Tooltip>) : (<></>)}
        </ListItem>
      }


    return (<div className='user-bar'>
     
     <Box
        sx={{ width: '100%', 
            overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: 2,
              display: 'flex',
        flexDirection: 'column', 
        height: "calc(100vh - 260px)"
         }}
    >
      
          <Typography variant="h6" sx={{
               mt: 1,
               height: "20%",
               width: "100%",
            
            }}>
                Користувачі онлайн
                <Divider>
                    <Chip label={users.length} size="small" />
                </Divider>
            </Typography>
          
            { loading && (<CircularProgress color="inherit" sx={{margin: "0 auto"}} />) }
        <FixedSizeList 
            height={400}
            width={"100%"}
            itemSize={46}
            itemCount={users.length}
            overscanCount={5}
        >
        {/* <CircularProgress color="inherit" /> */}
        {renderRow}
       
      </FixedSizeList>
    </Box>
    </div>
    )
}