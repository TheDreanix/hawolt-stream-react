import React, { useEffect, useRef } from "react";

const SingleStreamChatbox = ({
  chatMessages,
  username,
  currentDateTime,
  setChatMessages,
}) => {
  const chatboxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleChatMessage = (value) => {
    if (value.charAt(0) === ".") {
      alert("Command: " + value);
    } else {
      setChatMessages([...chatMessages, { value, isUser: true }]);
    }
  };

  return (
    <>
      <div id="chat">
        <div id="chatbox" ref={chatboxRef}>
          {chatMessages &&
            chatMessages.map((message, index) => (
              <React.Fragment key={index}>
                {message["isUser"] === true ? (
                  <div className="message message-align">
                    <span className="user-message">{username}: </span>
                    <span className="message-align" title={currentDateTime}>
                      {message["value"]}
                    </span>
                  </div>
                ) : (
                  <div className="message message-align system">
                    <span title="system"></span>
                    <span className="message-align" title={currentDateTime}>
                      {message["value"]}
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
        <div id="submit">
          <input
            id="text-message"
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleChatMessage(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SingleStreamChatbox;
