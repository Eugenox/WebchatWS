import { TextField, Button, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export default function TextInput({ws_input}) {
  const [text, setText] = useState("")

  const handleTyping = (event) => {
    setText(event.target.value)
  }

  const handleSending = () => {
    if (!text.length > 0) return
    ws_input(JSON.stringify({ type: "textmessage", username: "JohnDoe", message: text }))
    setText("")
  }

  return (
    <Box
      component="form"
      sx={
        { "& .MuiTextField-root": { m: 1, width: "65%" },
        position: "fixed",
        left: 0,
        bottom: 20,
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: 2,
        backgroundColor: "white", // Фон, чтобы форма не просвечивала
        boxShadow: "0px -2px 5px rgba(0,0,0,0.1)", // Тень для эффекта прижатости
        }
    }
      noValidate
      autoComplete="off"
    >
      <form autoComplete="off">
        <TextField
          id="outlined-textarea"
          label="Write something"
          placeholder="Your message"
          value = {text}

          maxRows={4}
          sx={{
            overflow: "auto",
          }}
          multiline
          onChange={handleTyping}
        />
        <Button variant="contained" color="primary" sx={{
            visibility: text.length > 0 ? 'visible' : 'hidden'
          }}
          onClick={handleSending}
          >
            <SendIcon />
        </Button>
      </form>
    </Box>

  );
}
