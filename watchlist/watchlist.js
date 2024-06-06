function getFilmIdArray() {
  let filmIdArray = [];
  Object.keys(localStorage).forEach(function (key) {
    filmIdArray.push(localStorage.getItem(key));
  });
  console.log(filmIdArray);
  return filmIdArray;
}

let watchlistIdArray = getFilmIdArray();

// function iterates over array of IDs and creates html for each film, renders to browser
async function getWatchlistHtml(IdArray) {
  let watchlistHtml = ``;
  for (let filmId of IdArray) {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${filmId}&apikey=17073252`
    );
    const filmData = await res.json();
    let filmHtml = `
            <div class="filmData" id="filmData">
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
                            class="remove-from-watchlist"
                            id="${filmId}">
                            Remove
                        </button>
                    </div>
                    <div class="synopsis">
                        <p>${filmData.Plot}</p>
                    </div>
                </div>
            </div>`;
    watchlistHtml += filmHtml;
  }
  return watchlistHtml;
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.className === "remove-from-watchlist") {
    removeFromWatchlist(e.target.id);
  }
});

async function renderWatchlistHtml() {
  if (!watchlistIdArray.length) {
    document.getElementById("placeholder").style.display = "flex";
    document.getElementById("watchlist").style.display = "none";
  } else {
    document.getElementById("placeholder").style.display = "none";
    document.getElementById("watchlist").innerHTML =
      await getWatchlistHtml(watchlistIdArray);
  }
}

function removeFromWatchlist(id) {
  localStorage.removeItem(id);
  let removedIndex = watchlistIdArray.indexOf(id);
  watchlistIdArray.splice(removedIndex, 1);
  renderWatchlistHtml();
}

renderWatchlistHtml();
