(function () {
  const frames = Array.from(document.querySelectorAll(".video-frame--sound-gate"));
  const players = new Map();
  const pendingSound = new WeakSet();

  if (!frames.length) return;

  frames.forEach((frame) => {
    const button = frame.querySelector(".sound-gate");

    button?.addEventListener("click", () => {
      const activePlayer = players.get(frame);

      frame.classList.add("is-sound-enabled");
      frame.classList.remove("is-playing-muted");

      if (!activePlayer) {
        pendingSound.add(frame);
        return;
      }

      activePlayer.seekTo(0, true);
      activePlayer.unMute();
      activePlayer.playVideo();
    });
  });

  window.onYouTubeIframeAPIReady = function () {
    frames.forEach((frame, index) => {
      const iframe = frame.querySelector(".vsl-video");

      if (!iframe) return;
      if (!iframe.id) iframe.id = `vsl-video-${index + 1}`;

      const player = new YT.Player(iframe.id, {
        events: {
          onReady(event) {
            players.set(frame, event.target);

            if (pendingSound.has(frame)) {
              event.target.seekTo(0, true);
              event.target.unMute();
            } else {
              event.target.mute();
            }

            event.target.playVideo();
          },
          onStateChange(event) {
            const isPlaying = event.data === YT.PlayerState.PLAYING;

            if (isPlaying && !frame.classList.contains("is-sound-enabled")) {
              frame.classList.add("is-playing-muted");
            }
          },
        },
      });
    });
  };

  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);
})();
