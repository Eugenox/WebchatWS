import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StarsIcon from '@mui/icons-material/Stars';
import VerifiedIcon from '@mui/icons-material/Verified';

import { Box, Avatar, Typography, Chip, Tooltip } from '@mui/material';

import {FormateDate} from "../utils"

const botColor = "#1976d2" // need to get color from "primary"
const botDesc = "Системне повідомлення."
export default function ChatMessage(props){
    let {user, message} = props
    const {content, time} = message

    let isSystem 
    if (!user){
        user = {
            name: "R2D2",
            color: botColor
        }
        isSystem = true
    }
    const {name, color, isAdmin} = user
    

    

    return <div style={{width:'100%', paddingBottom: 25}}> 
        <Box 
        sx={{
            display: "flex", 
            alignItems: "left", 
            gap: 1, 
            marginBottom: 0
        }}
        > 
            { isSystem ? (<Avatar sx={{ bgcolor: "#1976d2" }}>{<SmartToyIcon/>}</Avatar>) :
            (<Avatar sx={{ bgcolor: `${color}` }}>{name[0]}</Avatar>)}
            
            <Typography variant="caption" >{` [${FormateDate(time)}] `}</Typography>
            <Typography variant="caption" >{name}</Typography>
            { isSystem ? (<Tooltip title={botDesc}><Chip label="System" icon={<VerifiedIcon/>} color="primary" size='small'/></Tooltip>) : (<></>)}
            { isAdmin ? (<Tooltip title={botDesc}><Chip label="Власник каналу" icon={<StarsIcon/>} color="success" size='small'/></Tooltip>) : (<></>)}
        </Box>

        <Box
         sx={{ 
            display: "flex",
            alignItems: "flex-start", 
            marginLeft: 7,
             flexWrap: "wrap",
            maxWidth: '75%'
        }}
        >
            <Typography variant="body2" 
            sx={{whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                textAlign: 'left',
               
            }}
            >
                {content}
            </Typography>
        </Box>

        
    </div>
}