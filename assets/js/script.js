//jQuery variable elements
var searchBtn = $('#searchBtn');
var searchImages = $('#searchResults');
var trailers = $('#trailers');
var upComing = $('#upComing');

//global variables
const api_key = '1fc2de251859dcddc136157f2a89acbe';
var currentSlide = 1;

$('#landingBtn').on("click", function () {
  location.href = "search.html";
})

// API functions start gathering movie information on click
searchBtn.on('click', async function (event) {
  event.preventDefault();

  let movieName = $('#searchInput').val();

  let movieResult = await movieLookup(movieName); // Movie data for movie search

  await displaySearchResults(movieResult.results.slice(0, 20), searchImages);
})

// Param URL and api_key + any parameters
function paramApiUrl(url, params) {
  params === null ? params = {} : params
  params = Object.assign({ api_key: api_key }, params)
  return url + jQuery.param(params)
}

// Fetch function to process the fetch using prepared string as arguement
async function apiRequest(requestString) {
  return fetch(requestString)
    .then(function (response) {
      return response.text()
    })
    .then(function (text) {
      return JSON.parse(text)
    })
}

// Fetch API data for movie inputed into search
async function movieLookup(movieName) {
  let apiSite = 'https://api.themoviedb.org/3/search/movie?'
  let requestUrl = paramApiUrl(apiSite, { query: movieName })
  return apiRequest(requestUrl)
}

async function movieIDLookup(movie_id) {
  let apiSite = 'https://api.themoviedb.org/3/movie/' + movie_id + "?"

  let requestUrl = paramApiUrl(apiSite, {
    append_to_response: 'videos,images,credits,similar,release_dates'
  })
  return apiRequest(requestUrl)
}

async function displaySearchResults(movieResult, container) {
  container.empty();
  for (var i = 0; i < movieResult.length; i++) {
    let movieDetail = await movieIDLookup(movieResult[i].id)

    if (movieDetail.poster_path != null) {
      let imageProperties = {
        src: 'https://image.tmdb.org/t/p/' + 'w185' + movieDetail.poster_path,
        alt: movieDetail.title
      }
      let linkParams = jQuery.param({ id: movieDetail.id })
      $div = $("<div>", { "class": "grid-item card" })
      $detail = $("<a>", { href: "movie-page.html?" + linkParams, text: "Mais detalhes" })
      $film_page = $("<a>", { href: movieDetail.homepage, text: "Pagina do filme" })
      $img = $('<img>', imageProperties)
      $title = $('<h4>', { "text": movieDetail.title })
      $vote_average = $('<p>', { "text": "Nota: " + movieDetail.vote_average })
      $date = $('<p>', { "text": "Data de lançamento: " + movieDetail.release_date })

      $div.append($img)
      $div.append($title)
      $div.append($vote_average)
      $div.append($date)
      $div.append($detail)
      $div.append($film_page)

      container.append($div);
    }
  }
}