import { useState, useEffect, useRef } from "react";

import "./App.css";

function App() {
  const client = useRef(null);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [dmId, setDmId] = useState("");
  const [user, setUser] = useState({});

  const loginUser = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    })
      .then((resp) => resp.json())
      .then((user) => setUser(user));
  };

  const createMessage = (e) => {
    e.preventDefault();

    let message = {
      command: "message",
      identifier: JSON.stringify({
        channel: "DirectMessageChannel",
        direct_message_id: dmId,
      }),
      data: JSON.stringify({
        action: "send_message",
        content,
        direct_message_id: dmId,
        user_id: user.id,
      }),
    };

    client.current.send(JSON.stringify(message));
    setContent("");
    // fetch("/messages", {
    //   method,
    // });
  };

  const subscribeToChat = (direct_message_id) => {
    setDmId(direct_message_id);
    if (!client.current) {
      let socketClient = new WebSocket("ws://localhost:3000/cable");
      client.current = socketClient;

      socketClient.onopen = (e) => {
        console.log(e);
        let message = {
          command: "subscribe",
          identifier: JSON.stringify({
            channel: "DirectMessageChannel",
            direct_message_id,
          }),
        };

        socketClient.send(JSON.stringify(message));
      };

      socketClient.onmessage = (e) => {
        const serverResponse = JSON.parse(e.data);
        if (serverResponse.type === "ping") return;

        const data = serverResponse.message;
        if (data && data.type === "all_messages") {
          setMessages(data.messages);
        }
        console.log(data);
        if (data && data.type === "new_message") {
          console.log(data.message);
          setMessages((messages) => [...messages, data.message]);
        }
      };
    }
  };

  return (
    <div className="App">
      {messages.map((m) => (
        <p key={m.id}>{m.content}</p>
      ))}

      {dmId && (
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
      )}

      {user.chats?.map((chat) => (
        <p key={chat.id} onClick={() => subscribeToChat(chat.id)}>
          {chat.id}
        </p>
      ))}
      <form onSubmit={loginUser}>
        <label htmlFor="content" />
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input type="submit" value="Send" />
      </form>
      {/* <button onClick={closeWebsocket}>Close</button> */}
    </div>
  );
}

export default App;

// const createMessage = (e) => {
//   e.preventDefault();

//   let message = {
//     command: "message",
//     identifier: JSON.stringify({ channel: "MessageChannel" }),
//     data: JSON.stringify({
//       action: "send_message",
//       content,
//     }),
//   };

//   socketClient.send(JSON.stringify(message));
//   setContent("");
//   // fetch("/messages", {
//   //   method,
//   // });
// };

// useEffect(() => {
//   socketClient.onopen = (e) => {
//     console.log(e);
//     let message = {
//       command: "subscribe",
//       identifier: JSON.stringify({ channel: "MessageChannel" }),
//     };

//     socketClient.send(JSON.stringify(message));
//   };

//   socketClient.onmessage = (e) => {
//     const serverResponse = JSON.parse(e.data);
//     console.log(serverResponse);
//     if (serverResponse.type === "ping") return;
//     // console.log(serverResponse);
//     const data = serverResponse.message;
//     if (data && data.type === "new_message") {
//       setMessages((me) => [...me, data.new_message]);
//     }

//     // this is when we subscribed and broadcasted all the messages
//     if (data && data.type === "all_messages") {
//       setMessages(data.messages);
//     }

//     if (data && data.type === "user_left") {
//     }
//   };

//   socketClient.onclose = (e) => {
//     console.log(e);
//   };

//   // return () => {
//   //   socketClient.close();
//   // };
// }, []);

// const closeWebsocket = () => {
//   let message = {
//     command: "message",
//     identifier: JSON.stringify({ channel: "MessageChannel" }),
//     data: JSON.stringify({
//       action: "alert_unsubscribed",
//       user_id: 1,
//     }),
//   };

//   // socketClient.send(JSON.stringify(message));
//   socketClient.close();
// };
