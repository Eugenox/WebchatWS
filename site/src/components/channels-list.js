import {useState, useEffect} from 'react';
import connection from '../config.json'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import HouseIcon from '@mui/icons-material/House';
import DrawIcon from '@mui/icons-material/Draw';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCommentIcon from '@mui/icons-material/AddComment';

import ChannelCreate from './channel-create'

export default function ChannelsList() {
    const [channels, setChannels] = useState([]);
    const [isCHCreateOpen, setCHCreateOpen] = useState(false);
    useEffect(() => {

      const GetChannels = async () => {
        try {
            const response = await fetch(`${connection.domain}/getChannels`); //! HTTPS
            if (!response.ok) throw new Error("Помилка завантаження списку каналів");
            const data = await response.json();

            setChannels(data);
        } catch(err) {
          console.error(err);
        }
      }

      GetChannels()

      const UPDInterval = setInterval(GetChannels, 3000)
      return () => clearInterval(UPDInterval)
    }, [])

   const DEFAULT_ICONS = {
    0: () => (<HouseIcon/>),
    1: () => (<DrawIcon/>),
   }
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: "rgba(0, 0, 0, 0.24)", margin: "0 auto", borderRadius: '20px' }}>
        <List>
        <Divider sx={{"&::before, &::after": {borderColor: "#439647",},
  }}>Основні канали</Divider>
        {channels.map((c, i) => (
            <>
                <ListItem key={c.name} disablePadding>
                    <ListItemButton  href={`/#channel/${c.name}`}>
                        <ListItemIcon sx={{ color:"#8a9f90" }}>
                            {c.isDefault && DEFAULT_ICONS[i] && DEFAULT_ICONS[i]() || <ArrowForwardIcon />}
                        </ListItemIcon>
                        <ListItemText primary={`#${c.name} [${c.online}]`} />
                    </ListItemButton>
                </ListItem>
                {i == Object.keys(DEFAULT_ICONS).length - 1 && <Divider sx={{"&::before, &::after": {borderColor: "#439647",}}}>Інші канали</Divider>}
            </>
            ))}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setCHCreateOpen(true)}>
                <ListItemIcon sx={{ color:"#8a9f90" }}>
                    <AddCommentIcon/>
                </ListItemIcon>
              <ListItemText primary="Створити канал"  />
            </ListItemButton>
          </ListItem>
        </List>
        <ChannelCreate isOpened={isCHCreateOpen} onClose={() => setCHCreateOpen(false)} />
    </Box>
  );
}