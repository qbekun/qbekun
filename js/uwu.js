document.addEventListener('DOMContentLoaded', () => {
  const entryOverlay = document.getElementById('entry-overlay');
  const enterBtn = document.getElementById('enter-btn');
  const backgroundMusic = document.getElementById('background-music');
  const mainVideo = document.getElementById('main-video');
  const localTimeDisplay = document.getElementById('local-time');

  // Function to update local time
  function updateLocalTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    localTimeDisplay.textContent = `${hours}:${minutes}`;
  }

  // Mute music and video by default to comply with autoplay restrictions
  backgroundMusic.muted = true;
  mainVideo.muted = true;

  enterBtn.addEventListener('click', () => {
    // Fade out overlay
    entryOverlay.classList.add('hidden');

    // Show local time temporarily
    updateLocalTime();
    localTimeDisplay.classList.add('visible');
    
    // Hide local time after 3 seconds
    setTimeout(() => {
      localTimeDisplay.classList.remove('visible');
    }, 3000);

    // Try to play music and video, handling potential autoplay restrictions
    backgroundMusic.muted = false;
    mainVideo.muted = false;

    backgroundMusic.play().catch(error => {
      console.log('Music autoplay was prevented', error);
    });

    mainVideo.play().catch(error => {
      console.log('Video autoplay was prevented', error);
    });
  });
});