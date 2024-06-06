const searchBtn = document.getElementById("search-btn");
const myWatchlistBtn = document.getElementById("my-watchlist-btn");
let watchListArray = [];

searchBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  document.getElementById("placeholder").style.display = "none";

  let searchedFilm = document.getElementById("movie-search").value;
  let filmIdArray = await getFilmIdArray(searchedFilm);

  if (filmIdArray.length === 0) {
    document.getElementById("no-results").style.display = "flex";
    document.getElementById("results").style.display = "none";
  } else {
    document.getElementById("no-results").style.display = "none";
    document.getElementById("results").style.display = "flex";
  }

  document.getElementById("results").innerHTML =
    await getResultsHtml(filmIdArray);
});

//17073252

// function returns array of IDs returned from user's search input
async function getFilmIdArray(userInput) {
  const res = await fetch(
    `https://www.omdbapi.com/?s=${userInput}&apikey=17073252`
  );
  const data = await res.json();
  let filmIdArray = [];
  if (data.Search) {
    for (let film of data.Search) {
      if (film.Type === "movie") {
        filmIdArray.push(film.imdbID);
      }
    }
  }
  return filmIdArray;
}

function addToWatchlist(id) {
  localStorage.setItem(id, id);
}

// function iterates over array of IDs and creates html for each film, renders to browser
async function getResultsHtml(IdArray) {
  let searchResultHtml = ``;
  for (let filmId of IdArray) {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${filmId}&apikey=17073252`
    );
    const filmData = await res.json();
    let filmHtml = `
            <div class="filmData" id="filmData-${filmData.imdbID}">
                <img src="${filmData.Poster}">
                <div class="filmData-desc">
                    <div class="title">
                        <h3 class="title">${filmData.Title}</h3>
                        <p class="rating">${filmData.imdbRating}</p>
                    </div>
                    <div class="info">
                        <p class="runtime">${filmData.Runtime}</p>
                        <p class="genre">${filmData.Genre}</p>
                        <button
                            class="add-to-watchlist"
                            id="${filmData.imdbID}">
                            Watchlist
                        </button>
                    </div>
                    <div class="synopsis">
                        <p>${filmData.Plot}</p>
                    </div>
                </div>
            </div>`;
    searchResultHtml += filmHtml;
  }
  return searchResultHtml;
}

// Attach event listener to dynamically created buttons
document.addEventListener("click", function (e) {
  if (e.target && e.target.className === "add-to-watchlist") {
    addToWatchlist(e.target.id);
  }
});
