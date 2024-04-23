import { useState } from "react";
import SingleStreamChatbox from "../../Partials/SingleStream/SingleStreamChatbox";
import { useParams } from "react-router-dom";

const SingleStream = () => {
  const [volume, setVolume] = useState(0.25);
  const [viewers, setViewers] = useState(0);
  const [title, setTitle] = useState("stream title");
  const [info, setInfo] = useState("hello welcome to my stream");
  const [chatMessages, setChatMessages] = useState("");
  const [username, setUsername] = useState("Drea");
  const { userAccount } = useParams();

  const currentDateTime = new Date();

  return (
    <>
      <div id="content">
        <div id="stream-container">
          <div id="video-parent">
            <video id="video"></video>
            <div id="video-controls" className="video-bar">
              <div id="video-bar-wrapper">
                <button title="Pause (space)" id="play-button">
                  <i className="fas fa-pause"></i>
                </button>
                <button id="mute-button" title="Mute (m)">
                  <i className="fas fa-volume-mute"></i>
                </button>
                <input
                  type="range"
                  id="volume-control"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    setVolume(e.target.value);
                  }}
                />
                <button id="fullscreen" title="Fullscreen (f)">
                  <i className="fas fa-expand"></i>
                </button>
              </div>
            </div>
          </div>
          <div id="video-details">
            <div id="video-details-wrapper">
              <div id="stream-title">{title}</div>
              <div id="video-control">
                <select id="quality-select"></select>
                <div id="video-info">
                  <i className="fa-solid fa-user"></i>
                  <div id="viewers">{viewers}</div>
                </div>
              </div>
            </div>
          </div>
          <div id="stream-info">{info}</div>
        </div>
        <SingleStreamChatbox
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          username={username}
          currentDateTime={currentDateTime}
        />
      </div>
    </>
  );
};

export default SingleStream;
