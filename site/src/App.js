//import logo from './logo.svg';
// import './App.css';
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

import Main from './pages/main'
import ChatPage from "./pages/chatpage"

import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";

import {UUID} from './components/utils'

function App() {
  
  useEffect(()=>{
    if (!localStorage.getItem("session")) localStorage.setItem("session", UUID())   // looks dummy, this clientsideID
  }, [])

  //* WEBSOCKETS
  const [socketUrl, setSocketUrl] = useState("");
  const [WS_MESSAGE_GET_HISTORY, WS_MESSAGE_SET_HISTORY] = useState([]);
  const [WS_USERS_GET, WS_USERS_SET] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("[WS] Connection Successfull");
      sendMessage(JSON.stringify({ type: "getupdate" }));
    },
    onClose: () => console.log("[WS] Connection Closed"),
    shouldReconnect: () => true,

    onMessage: (event) => {
      const data = JSON.parse(event.data);
      console.log("[WS] [DEBUG] RECIEVE:", data);

      switch (data.type) {
        case "textmessage":
          WS_MESSAGE_SET_HISTORY((prev) => [...prev, data]);
          break;
        case "history":
          WS_MESSAGE_SET_HISTORY((prev) => [...prev, data]);
          break;
        case "update":
          console.log("UPDATE");
          WS_USERS_SET(data.list);
          break;
      }
    },
  });
 

  const TransferData = {
    setSocketUrl, WS_MESSAGE_GET_HISTORY, WS_USERS_GET, sendMessage, lastMessage, readyState,
  }
  return (
    <>
    <ThemeProvider theme={theme}>
      
    

    <Router>
        <Routes> 
            {/* exact используется для точности в ссылке */}
            <Route exact path = "/" element = {<Main/>}/>
            {/* <Route exact path = "/docs" element = {<Docs/>}/> */}
            {/* <Route exact path = "/gettoken" element = {<GetToken/>}/> */}
            <Route exact path = "/channel/:query" element = {<ChatPage data={TransferData}/>}/>
          </Routes>
      </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
