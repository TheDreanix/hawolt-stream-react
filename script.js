var source;
var client;
var path = location.pathname.substring(1);
var channel = path.length == 0 ? 'hawolt' : path;

let isPageClicked = false;

function incoming(json) {
  if (!json.hasOwnProperty("instruction")) return;
  let instruction = json["instruction"];
  console.log(json);
  switch (instruction) {
    case "list":
      document.getElementById("viewers").innerText = json["users"].length;
      break;
    case "chat":
      addMessageToMessagebox(json);
      break;
  }
}

function darkness() {

}

function connecting() {
  addMessageElement(true, "", "system", "connecting to chat")
}

function reconnect() {
  addMessageElement(true, "", "system", "attempting to reconnect...")
}

function disconnect() {
  addMessageElement(true, "", "system", "lost connection to chat")
}

function addMessageToMessagebox(json) {
  let user = json["user"];
  let msg = json["message"];
  let identifier = json["identifier"];
  let isWithType = json.hasOwnProperty("type");
  addMessageElement(isWithType, user, identifier, msg);
}

function addMessageElement(isWithType, user, identifier, msg) {
  let messagebox = document.getElementById("box");
  let message = document.createElement("div");
  message.classList = 'message';
  let attendee = document.createElement("span");
  attendee.title = identifier;
  let content = document.createElement("span");
  content.title = new Date().toLocaleString();
  if (isWithType) {
    attendee.innerText = user;
    content.innerText = " " + msg;
  } else {
    attendee.classList = "user-message";
    attendee.innerText = user + ":";
    content.innerText = " " + msg;
  }
  message.appendChild(attendee);
  message.appendChild(content);
  messagebox.appendChild(message);
  messagebox.scrollTo(0, messagebox.scrollHeight);
}

function ready() {
  addMessageElement(true, "", "system", "connected to chat")
  addMessageElement(true, "", "system", "change your name using .namechange")
  enter(channel);
}

function enter(channel) {
  client.join(channel, onJoinEvent);
}

function onJoinEvent(json) {
  console.log(json);
}

function submitMessage() {
  let submit = document.getElementById("text-message");
  let msg = submit.value;
  if (!msg.startsWith('.')) {
    client.message(
      channel,
      darkness,
      btoa(encodeURIComponent(msg))
    );
  } else {
    let command = msg.substring(1).split(" ")[0];
    switch (command) {
      case "namechange":
        if (msg.split(" ").length > 1) {
          client.namechange(btoa(msg.split(" ").slice(1).join(" ")), darkness, channel);
        } else {
          addMessageElement(true, "", "system", "usage: .namechange NAME")
        }
        break;
    }
  }
  submit.value = "";
}


window.onload = function () {
  client = new RemoteClient(
    "wss://stream.hawolt.com:42069/?name=anon",
    this
  );

  document.body.addEventListener('click', function () {
    isPageClicked = true;
  });

  var href = window.location.href;
  if (href.match("https:\/\/stream\.hawolt\.com\/[A-z]{1,16}")) {
    channel = href.substring(href.lastIndexOf('/') + 1);
  }

  var video = document.getElementById('video');
  var qualitySelect = document.getElementById('quality-select');
  var muteButton = document.getElementById('mute-button');
  var playButton = document.getElementById('play-button');
  var volumeControl = document.getElementById('volume-control');

  video.muted = true;
  volumeControl.disabled = video.muted;

  window.hls = new Hls();
  var hls = window.hls;

  hls.attachMedia(video);
  var availableQualities;
  var selectedQuality;
  var initialized;

  load('https://stream.hawolt.com/hls/transcoded/' + channel + '.m3u8');

  hls.on(Hls.Events.MANIFEST_PARSED, function () {
    if (!initialized) {
      availableQualities = hls.levels.map(function (level) {
        var resolution = level.attrs.RESOLUTION;
        return {
          label: resolution,
          value: level.height
        };
      });

      availableQualities.forEach(function (quality, index) {
        if (quality.label !== undefined && quality.label.length != 0) {
          var option = document.createElement('option');
          option.textContent = quality.label;
          option.value = index;
          qualitySelect.appendChild(option);
        }
      });
      initialized = true;
    }
    if (!isPageClicked) {
      video.muted = true;
      muteButton.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }
    volumeControl.disabled = video.muted;
    video.play().catch(function (error) {
      playButton.innerHTML = '<i class="fas fa-play"></i>';
    });
  });

  var option = document.createElement('option');
  option.textContent = "source";
  option.value = "source";
  qualitySelect.insertBefore(option, qualitySelect.firstChild);

  hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
    currentQualityIndex = hls.nextLoadLevel;
    qualitySelect.selectedIndex = currentQualityIndex + (selectedQuality === 'source' ? 0 : 1);
  });

  hls.on(Hls.Events.ERROR, function (event, data) {
    console.error('HLS error:', data);
  });

  qualitySelect.addEventListener('change', function () {
    selectedQuality = qualitySelect.value;
    if (selectedQuality === "source") {
      load('https://stream.hawolt.com/hls/source/' + channel + '/index.m3u8');
    } else {
      if (source.includes('source')) {
        load('https://stream.hawolt.com/hls/transcoded/' + channel + '.m3u8');
      }
      hls.nextLevel = parseInt(selectedQuality);
    }
  });

  function startPlayback() {
    if (video.paused) {
      video.play();
      playButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change button to pause icon
    } else {
      video.pause();
      playButton.innerHTML = '<i class="fas fa-play"></i>'; // Change button to play icon
    }
  }

  function setVolume() {
    video.volume = volumeControl.value;
  }

  muteButton.addEventListener('click', function () {
    video.muted = !video.muted;
    volumeControl.disabled = video.muted;
    muteButton.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
  });

  playButton.addEventListener('click', startPlayback);
  volumeControl.addEventListener('input', setVolume);

  var textBox = document.getElementById("text-message");

  textBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      submitMessage();
    }
  });
}

function load(playlist, delay = 1000) {
  var timeout;
  function loadSource() {
    source = playlist;
    hls.loadSource(playlist);
  }

  function retry() {
    timeout = setTimeout(function () {
      loadSource();
      retry();
    }, delay);
  }

  hls.once(Hls.Events.ERROR, function (event, data) {
    if (data.fatal && data.type === Hls.ErrorTypes.NETWORK_ERROR) {
      console.error('Network error occurred while loading source:', playlist);
      retry();
    }
  });

  hls.once(Hls.Events.MANIFEST_PARSED, function () {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
  });

  loadSource();
}
