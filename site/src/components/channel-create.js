import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"

import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

export default function CreateChannelForm({isOpened, onClose }) {
    const [isOpen, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const [isErr, setErr] = useState(false)
    const [ErrText, setErrText] = useState(false)
    const [token, setToken] = useState()

    const navigate = useNavigate()

    const handleClose = () => {
        
        setOpen(false)
        onClose()
    }

    const handleInputChange = (event) => {
        setInput(event.target.value)

        if (input.trim()){
            setErr(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!input.trim()) {
            setErr(true)
            setErrText("Назва не повинна бути порожньою")
            return 
        }
    
        if (!token) {
            setErr(true)
            setErrText("Пройдіть перевірку на бота")
            return
        }
    
        if (input.trim().length > 24) {
            setErr(true)
            setErrText("Максимальна довжина назви - 24 символи")
            return
        }
        
        if (isErr) return
        const response = await fetch("http://localhost/createChannel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: input.trim(), token}),
        })

        const data = await response.json()
        if (data.responsetext === "channel_created") {
            navigate(`/channel/${data.name}`)
        } else {
            alert(data.responsetext)
        }
        setToken()
    }

    return (
        <Dialog open={isOpened} onClose={handleClose}>
            <DialogTitle> <AddToPhotosIcon/> Створення нового каналу</DialogTitle>
            <DialogContent>
                <DialogContentText>Введіть назву каналу</DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="channel_name"
                    fullWidth
                    variant="standard"
                    value={input}
                    onChange={handleInputChange}
                    error={isErr}
                    helperText={isErr ? ErrText : ""} //! up to 20 symbols
                    
                />
                 <ReCAPTCHA
                    sitekey="6LeoA-sqAAAAAMwocuziNyx5qlldk81VCRSnv0wl"
                    onChange={(v) => setToken(v)}          
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Відмініти</Button>
                <Button onClick={handleSubmit} type="submit">
                    Створити
                </Button>
            </DialogActions>
        </Dialog>
    )
}
