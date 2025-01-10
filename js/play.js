        const welcomeScreen = document.getElementById('welcome-screen');
        const page = document.getElementById('page');
        const backgroundMusic = document.getElementById('background-music');

        welcomeScreen.addEventListener('click', () => {
            welcomeScreen.style.display = 'none';
            page.style.display = 'block';
            backgroundMusic.play();
        });
