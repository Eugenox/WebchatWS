import React, { useEffect, useRef } from "react";
import ChatMessage from "./chat-message";

import { Box, Skeleton } from "@mui/material";
export default function Chat({ setsocket, ws_output, loading }) {
  console.log(ws_output);

  const ChatRef = useRef();

  // Autoscroll to bottom
  useEffect(() => {
    if (ChatRef.current){
      ChatRef.current.scrollTop = ChatRef.current.scrollHeight;
    }
  }, [ws_output])

  return loading ? (<>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="calc(100vh - 260px)" // Высота точно такая же, как у Box
        sx={{
          bgcolor: "background.default",
          borderRadius: "8px",
          marginBottom: "80px",
        }}
        animation="wave"
      />
    </>) : (
    <div class="chat-field">
      <Box
      sx={{
        bgcolor: "background.default",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: 2,
        margin: "auto",
        height: "calc(100vh - 260px)", // Calculating shit 
        marginBottom: "80px",
        }}
        ref={ChatRef}
      >
        {/* <ChatMessage user={{nick: "Boba"}} message={{content: "Hello, world! Lorem Ipsum dolor sit amen", time: Date.now()}}/> */}
        {/* <ChatMessage  message={{content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. adm,;kadadl'a,dlald,a'd,'ad,a'l,", time: Date.now()}}/> */}

        {ws_output.map((entry, index) => {
          if (entry.type === "textmessage") { // !rewrite to cool antiswitch
           
            const { user, message, date } = entry;
            return (
              <ChatMessage
                key={index}
                user={user}
                message={{ content: message, time: date }}
              />
            );
          } else if (entry.type === "history" && entry.message) {
            return entry.message.map((data, idx) => {
              const { user, type, date } = data;

              switch (type) {
                case "login":
                  let msg_login = `Користувач ${user.name} приєднався до чату`;
                  return (
                    <ChatMessage
                      key={`${index}-${idx}`}
                      message={{ content: msg_login, time: date }}
                    />
                  );
                  break;
                case "disconnect":
                  let msg_leave = `Користувач ${user.name} від'єднався від чату, до побачення!`;
                  return (
                    <ChatMessage
                      key={`${index}-${idx}`}
                      message={{ content: msg_leave, time: date }}
                    />
                  );
                  break;
                case "textmessage":
                  const {  message } = data;
                  return (
                    <ChatMessage
                      key={`${index}-${idx}`}
                      user={user}
                      message={{ content: message, time: date }}
                    />
                  );
                  break;
              }
              
            });
          }
          return null; 
        })}
      </Box>
    </div>
  );
}
