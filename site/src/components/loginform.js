import {useState, useEffect} from 'react';
import connection from '../config.json'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function LoginForm({setsocket, ws_input, query, onClose}) {
  const [isOpen, setOpen] = useState(true)
  const [input, setInput] = useState("")
  const [isErr, setErr] = useState(false)

  useEffect(()=>{
    const saved_name = localStorage.getItem('name')
    if (saved_name){
      setsocket(`${connection.domain_ws}`)
      ws_input(JSON.stringify({ type: "login", username: saved_name, channelName: query, sid: localStorage.getItem("session")}))
      setOpen(false);
      onClose()
    }
  }, [])
  const handleClickOpen =()=>{
    setOpen(true)
  }
  
  const handleClose = () => {
    if (!input.length > 0 ){
        setErr(true)
    }else{
        setOpen(false);
        onClose()
    }
    
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    if (input.length > 0) {
        setErr(false)
    }
}


  return !localStorage.getItem('name') ? (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        onChange={handleInputChange}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const username = formJson.input_username;
            localStorage.setItem('name', username)
            
            setsocket(`${connection.domain_ws}`)
            ws_input(JSON.stringify({ type: "login", username: username, channelName: query, sid: localStorage.getItem("session")}))
            handleClose();
          },
        }}
      >
        <DialogTitle>Welcome to #{query}!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your name bellow
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name = "input_username"
            id="input_username"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  ) : (<></>);
}