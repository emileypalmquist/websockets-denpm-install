import { useState, useEffect } from "react";

import "./App.css";

let socketClient = new WebSocket("ws://localhost:3000/cable");

function App() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  const createMessage = (e) => {
    e.preventDefault();

    let message = {
      command: "message",
      identifier: JSON.stringify({ channel: "MessageChannel" }),
      data: JSON.stringify({
        action: "send_message",
        content,
      }),
    };

    socketClient.send(JSON.stringify(message));
    setContent("");
    // fetch("/messages", {
    //   method,
    // });
  };

  useEffect(() => {
    socketClient.onopen = (e) => {
      console.log(e);
      let message = {
        command: "subscribe",
        identifier: JSON.stringify({ channel: "MessageChannel" }),
      };

      socketClient.send(JSON.stringify(message));
    };

    socketClient.onmessage = (e) => {
      const serverResponse = JSON.parse(e.data);
      if (serverResponse.type === "ping") return;
      console.log(serverResponse);
      const data = serverResponse.message;
      if (data && data.type === "new_message") {
        setMessages((me) => [...me, data.new_message]);
      }

      // this is when we subscribed and broadcasted all the messages
      if (data && data.type === "all_messages") {
        setMessages(data.messages);
      }
    };
  }, []);

  return (
    <div className="App">
      {messages.map((m) => (
        <p key={m.id}>{m.content}</p>
      ))}
      <form onSubmit={createMessage}>
        <label htmlFor="content" />
        <input
          type="text"
          name="content"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

export default App;
