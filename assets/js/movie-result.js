// Get ID encoded in URL
let url = new URL(location.href)
let movie_id = url.searchParams.get('id');
var trailers = $('#trailers');

// Global Variables
let movie_title = $("#movieTitle")
let movie_descrip = $('#movieDescrip')
let movie_rating = $('#movie_rating');
let movie_cast = $('#movie_cast')
var movieList;

movieData(); // Initial population of search results page 

async function movieData() {
  let titleResults = await movieIDLookup(movie_id);

  displayMovieObject(titleResults);
}

async function displayMovieObject(movieObject) {

  // Display movie trailer
  videoTrailer(movieObject);

  // Display movie title
  movie_title.text(movieObject.original_title)

  // Display movie description
  movie_descrip.text(movieObject.overview)

  // Display cast
  search_cast = movieObject.credits.cast
    .splice(0, 5)
    .forEach((member) => {
      movie_cast.append($("<li>").text(member.character + ": " + member.name))
    })

  // Display movie MPAA Rating
  let certifications = movieObject.release_dates.results
    .filter(i => i.iso_3166_1 == 'US')[0].release_dates
    .map(i => i.certification)
    .filter(i => i != '')

  let certification = [...new Set(certifications)].join(',')
  movie_rating.append(certification)

  displaySearchResults(movieObject.similar.results.slice(0, 6), $(".similar-posters"))
}

// Display searched movie trailer on search results page
function videoTrailer(movieObject) {
  trailers.attr('src', 'https://www.youtube.com/embed/' + movieObject.videos.results[movieObject.videos.results.length - 1].key)
}

//favorite function
var favoriteButton = document.querySelector('#favorites');
favoriteButton.onclick = favoriteMovies;

function favoriteMovies() {
  if (JSON.parse(localStorage.getItem('favoriteMovies'))) {
    movieList = JSON.parse(localStorage.getItem('favoriteMovies'));
  } else {
    movieList = [];
  }
  var title = movie_title.text();
  movieList.push(title);
  localStorage.setItem('favoriteMovies', JSON.stringify(movieList));
  favoritesIcon();
}

// changes icon to solid if added to favorites
function favoritesIcon() {
  var favoritesIcon = $("#favoritesIcon")
  favoritesIcon.removeClass("fa-regular")
  favoritesIcon.addClass("fa-solid")
}