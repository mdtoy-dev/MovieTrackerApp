document.addEventListener('DOMContentLoaded', function () {
    const movieForm = document.getElementById('movieForm');
    const watchedMoviesContainer = document.getElementById('watchedMoviesContainer');

    movieForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;

        if (title) {
            addMovie(title);
            resetMovieForm();
        } else {
            alert('Please enter a movie title.');
        }
    });

    displayMovies();

    // Enable drag-and-drop for movie elements
    watchedMoviesContainer.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    });

    watchedMoviesContainer.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    watchedMoviesContainer.addEventListener('drop', function (event) {
        event.preventDefault();
        const draggedElementId = event.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(draggedElementId);

        const targetElement = event.target.closest('.movie');
        if (draggedElement && targetElement && draggedElement !== targetElement) {
            watchedMoviesContainer.insertBefore(draggedElement, targetElement);
            saveMovieOrder();
        }
    });
});

let movies = [];

function getMoviesFromStorage() {
    return JSON.parse(localStorage.getItem('movies')) || [];
}

function saveMovieToStorage(movies) {
    localStorage.setItem('movies', JSON.stringify(movies));
}

function addMovie(title) {
    const movies = getMoviesFromStorage();

    const movie = {
        title: title
    };

    movies.push(movie);
    saveMovieToStorage(movies);
    displayMovies();
}

function displayMovies() {
    const movies = getMoviesFromStorage();
    const watchedMoviesContainer = document.getElementById('watchedMoviesContainer');
    watchedMoviesContainer.innerHTML = '';

    movies
        .map((movie, index) => createMovieElement(movie, index))
        .filter((movieElement) => movieElement !== null)
        .forEach((movieElement) => {
            watchedMoviesContainer.appendChild(movieElement);
        });
}


function createMovieElement(movie, index) {
    if (!movie) {
        return null;
    }

    const movieElement = document.createElement('div');
    movieElement.id = 'movie_' + index;
    movieElement.classList.add('movie');
    movieElement.draggable = true;

    const titleElement = document.createElement('span');
    titleElement.textContent = movie.title;
    titleElement.classList.add('movie-title'); // Add a class for styling

    // Add a "Remove" button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-button'); // Add a class for styling
    removeButton.addEventListener('click', function () {
        removeMovie(index);
    });

    movieElement.appendChild(titleElement);
    movieElement.appendChild(removeButton);

    return movieElement;
}



function removeMovie(index) {
    const movies = getMoviesFromStorage();
    movies.splice(index, 1);
    saveMovieToStorage(movies);
    displayMovies();
}

function saveMovieOrder() {
    const movieElements = document.querySelectorAll('.movie');
    const newOrder = Array.from(movieElements).map((element) => {
        const index = parseInt(element.id.split('_')[1], 10);
        return movies[index];
    });

    movies = newOrder;
    saveMovieToStorage(movies);
}

function resetMovieForm() {
    document.getElementById('title').value = '';
}
