import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import { useSelector } from "react-redux";
import { loginuser } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

function Home() {
  const { isAuthenticated, response, userin } = useSelector((state) => state.user);
    const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
    const [access, setIsAccess] = useState(false);

  // Handle user authentication
    const login = async () => {
      
      if (isAuthenticated || userin) {
        setIsAccess(true)
      socket.auth.token = response;
      socket.connect();
    }
   
  };

  // listen for previous and incoming msg
  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login");
      }

       socket.auth.token = response;
       socket.connect();
      
    socket.on("previousMessages", (msgs) => setMessages(msgs));
    socket.on("newMessage", (newMessage) =>
      setMessages((prev) => [...prev, newMessage])
    );

    return () => {
      socket.off("previousMessages");
      socket.off("newMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <>
      <div className="App">
        {!isAuthenticated ? (
          <div className="authentication">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              onClick={login}
              className="bg-blue-500 text-white px-16 rounded-md"
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl uppercase">{username}</h1>
            <div className="chat">
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <span className="text-lg">{msg.sender}: </span>
                  {msg.content}
                </div>
              ))}
            </div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <br />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-20 mt-2 rounded-md"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
