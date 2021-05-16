const Movie = function(movie) {
	this.imdbID = movie.imdbID;
	this.title = movie.title;
	this.poster = movie.poster;
	this.userID = movie.userID;
	this.year = movie.year;
};

module.exports = Movie;