document.addEventListener("DOMContentLoaded", function () {
    const titleText = "foreversadboys";
    let index = 1; // Startuj z 1, aby nie było pustego tytułu
    let direction = 1; // 1 - dodawanie, -1 - usuwanie

    function updateTitle() {
        // Zmiana tytułu na podstawie indeksu
        document.title = titleText.substring(0, index);

        // Zmiana indeksu
        if (direction === 1) {
            index++;
            if (index > titleText.length) {
                index = titleText.length; // Upewnij się, że nie przekracza długości
                direction = -1; // Zmień kierunek na usuwanie
            }
        } else {
            index--;
            if (index < 1) { // Upewnij się, że nie jest mniejsze niż 1
                index = 1; // Ustaw na 1, aby zapobiec całkowitemu usunięciu
                direction = 1; // Zmień kierunek na dodawanie
            }
        }

        setTimeout(updateTitle, 400); // Czas opóźnienia między zmianami
    }

    updateTitle(); // Rozpocznij animację
});


document.getElementById('overlay').addEventListener('click', function () {
    this.style.display = 'none';
    document.querySelector('.userContainer').style.display = 'block';
    const video = document.getElementById('myVideo');
    video.style.display = 'block';
    video.volume = 0.1; // Ustaw głośność na 10%
    video.play();
});