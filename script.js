document.addEventListener("DOMContentLoaded", function () {
    const titleText = "foreversadboys";
    let index = 1;
    let direction = 1;

    function updateTitle() {
        // Zmiana tytułu na podstawie indeksu
        document.title = titleText.substring(0, index);

        // Zmiana indeksu
        if (direction === 1) {
            index++;
            if (index > titleText.length) {
                index = titleText.length;
                direction = -1; //
            }
        } else {
            index--;
            if (index < 1) {
                index = 1;
                direction = 1;
            }
        }

        setTimeout(updateTitle, 400);
    }

    updateTitle();
});


document.getElementById('overlay').addEventListener('click', function () {
    this.style.display = 'none';
    document.querySelector('.userContainer').style.display = 'block';
    const video = document.getElementById('myVideo');
    video.style.display = 'block';
    video.volume = 0.1;
    video.play();
});
