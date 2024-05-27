document.addEventListener("DOMContentLoaded", function() {
    const btnStartorStop = document.querySelector('button.quizStartStop');
    const questionContainer = document.querySelector('.questions');
    const h1Ask = document.getElementById('questionNumber');
    const pAsk = document.getElementById('questionContent');
    const answerContainer = document.getElementById('answers');
    const nextButton = document.querySelector('.buttonForm');
    const statsDisplay = document.createElement('div'); 

    let questionsData;
    let stats = [0, 0, 0, 0, 0]; // tablica przechowująca statystyki dla każdej kategorii

    // Funkcja wczytująca dane z pliku JSON
    function loadQuestions() {
        fetch('kompas.json')
            .then(response => response.json())
            .then(data => {
                questionsData = data.questions;
                showQuestion(currentQuestionIndex);
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    // Funkcja obsługująca przycisk startujący/zatrzymujący quiz
    function changeStateButton() {
        btnStartorStop.classList.toggle('quizStop');

        if (btnStartorStop.textContent === 'start') {
            btnStartorStop.textContent = 'stop';
            stats.fill(0); // Resetowanie wszystkich statystyk
            updateStatsDisplay(); // Aktualizacja wyświetlania statystyk po resecie
            currentQuestionIndex = 0;
            loadQuestions();
            questionContainer.style.display = "block";
        } else {
            btnStartorStop.textContent = 'start';
            questionContainer.style.display = "none";
        }
    }

    btnStartorStop.addEventListener('click', changeStateButton);

    let currentQuestionIndex = 0;

    // Funkcja wyświetlająca pytanie i odpowiedzi
    function showQuestion(index) {
        h1Ask.textContent = "PYTANIE " + (index + 1) + ":";
        pAsk.textContent = "Pytanie nr " + (index + 1) + ": " + questionsData[index].question;

        answerContainer.innerHTML = '';

        questionsData[index].answers.forEach((answer, i) => {
            const answerInput = document.createElement('input');
            answerInput.type = 'radio';
            answerInput.name = 'answer';
            answerInput.id = 'answer' + i;

            const answerLabel = document.createElement('label');
            answerLabel.htmlFor = 'answer' + i;
            answerLabel.textContent = answer;

            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer');
            answerDiv.appendChild(answerInput);
            answerDiv.appendChild(answerLabel);

            answerContainer.appendChild(answerDiv);

            answerInput.addEventListener('click', function() {
                const category = questionsData[index].category; // pobierz kategorię pytania
                switch (i) {
                    case 0:
                        stats[category - 1] += 1.0; // inkrementuj odpowiednią statystykę
                        break;
                    case 1:
                        stats[category - 1] += 0.5;
                        break;
                    case 2:
                        stats[category - 1] -= 0.5;
                        break;
                    case 3:
                        stats[category - 1] -= 1.0;
                        break;
                    default:
                        break;
                }
            });
        });
    }

    // Obsługa przycisku "NEXT"
    nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            if (currentQuestionIndex < questionsData.length - 1) {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            } else {
                window.location.href = `wynik.html?stats=${JSON.stringify(stats)}`;
            }
        } else {
            alert("Wybierz odpowiedź!");
        }
        updateStatsDisplay(); 
    });

    // Funkcja aktualizująca wyświetlanie statystyk
    function updateStatsDisplay() {
        let statsText = '';
        for (let i = 0; i < stats.length; i++) {
            statsText += `Stat${i+1}: ${stats[i].toFixed(1)} | `;
        }
        statsDisplay.textContent = statsText.slice(0, -2); // usuń ostatni separator
    }

    //nextButton.parentNode.insertBefore(statsDisplay, nextButton.nextSibling);

    // Zapisywanie statystyk w cookie po zakończeniu quizu
    window.addEventListener('beforeunload', function() {
        for (let i = 0; i < stats.length; i++) {
            document.cookie = `stat${i+1}=${stats[i]}; max-age=3600`;
        }
    });

    // Wczytywanie statystyk z cookie przy ponownym uruchomieniu strony
    window.addEventListener('load', function() {
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const [name, value] = cookie.split('=');
            if (name.trim().startsWith('stat')) {
                const index = parseInt(name.trim().slice(4)) - 1;
                stats[index] = parseFloat(value);
            }
        });
        updateStatsDisplay(); 
    });
});
