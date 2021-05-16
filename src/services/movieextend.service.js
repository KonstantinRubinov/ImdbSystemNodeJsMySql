const connection = require("../database/db");
const movieExtendSchema = require("../models/MovieExtend");

function createMovieExtendModel(jmovie, userID)
{
    let seen=false;
    let year= Number(jmovie.movieYear);
    const movieExtendModel = new movieExtendSchema({
        plot: jmovie.moviePlot,
        website: jmovie.movieUrl,
        rated: jmovie.movieRated,
        imdbRating: jmovie.imdbRating,
        seen: jmovie.movieImdbRating,
        imdbID: jmovie.movieImdbID,
        title: jmovie.movieTitle,
        poster: jmovie.moviePoster,
        userID: userID,
        year: year
    });
	return movieExtendModel;
}

function GetAllMovies(userID){
    try {
        return connection.promise().query(`SELECT Movies.movieImdbID, Movies.movieTitle, Movies.moviePoster, Movies.userID, Movies.movieYear, MOVIEEXTENDS.moviePlot, MOVIEEXTENDS.movieUrl, MOVIEEXTENDS.movieRated, MOVIEEXTENDS.movieImdbRating, MOVIEEXTENDS.movieSeen From Movies LEFT JOIN MOVIEEXTENDS ON Movies.movieImdbID=MOVIEEXTENDS.movieImdbID and Movies.userID=MOVIEEXTENDS.userID where Movies.userID=${userID}`)
        .then((response) => {
            let answ = response[0];
            let movies=[];
            for(var i = 0; i < answ.length; i++) {
                movies.push(createMovieExtendModel(answ[i], userID));
            }
            return movies;
        }).catch(error => {
            console.error(error.message);
            throw Error(error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function GetByWord(userID, word){
    try {
        return connection.promise().query(`SELECT Movies.movieImdbID, Movies.movieTitle, Movies.moviePoster, Movies.userID, Movies.movieYear, MOVIEEXTENDS.moviePlot, MOVIEEXTENDS.movieUrl, MOVIEEXTENDS.movieRated, MOVIEEXTENDS.movieImdbRating, MOVIEEXTENDS.movieSeen From Movies LEFT JOIN MOVIEEXTENDS ON Movies.movieImdbID=MOVIEEXTENDS.movieImdbID and Movies.userID=MOVIEEXTENDS.userID where Movies.movieTitle LIKE CONCAT('%', "${word}", '%') and Movies.userID="${userID}"`)
        .then((response) => {
            let answ = response[0];
            let movies=[];
            for(var i = 0; i < answ.length; i++) {
                movies.push(createMovieExtendModel(answ[i], userID));
            }
            return movies;
        }).catch(error => {
            console.error(error.message);
            throw Error(error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function GetById(userID, imdbID){
    try {
        return connection.promise().query(`SELECT Movies.movieImdbID, Movies.movieTitle, Movies.moviePoster, Movies.userID, Movies.movieYear, MOVIEEXTENDS.moviePlot, MOVIEEXTENDS.movieUrl, MOVIEEXTENDS.movieRated, MOVIEEXTENDS.movieImdbRating, MOVIEEXTENDS.movieSeen, MOVIEEXTENDS.userID From Movies LEFT JOIN MOVIEEXTENDS ON Movies.movieImdbID=MOVIEEXTENDS.movieImdbID where Movies.movieImdbID="${imdbID}" and Movies.userID="${userID}"`)
        .then((response) => {
            let answ = response[0][0];
            let result = createMovieExtendModel(answ, userID);
            return result;
        }).catch(error => {
            console.error(error.message);
            throw Error(error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function GetByTitle(userID, title){
    try {
        return connection.promise().query(`SELECT Movies.movieImdbID, Movies.movieTitle, Movies.moviePoster, Movies.userID, Movies.movieYear, MOVIEEXTENDS.moviePlot, MOVIEEXTENDS.movieUrl, MOVIEEXTENDS.movieRated, MOVIEEXTENDS.movieImdbRating, MOVIEEXTENDS.movieSeen, MOVIEEXTENDS.userID From Movies LEFT JOIN MOVIEEXTENDS ON Movies.movieImdbID=MOVIEEXTENDS.movieImdbID where Movies.movieTitle=${title} and Movies.userID=${userID}`)
        .then((response) => {
            let answ = response[0];
            let result = createMovieExtendModel(answ, userID);
            return result;
        }).catch(error => {
            console.error(error.message);
            throw Error(error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function AddMovie(userID, body){
    try {
        return connection.promise().query(
                            "INSERT INTO Movies (movieImdbID, movieTitle, moviePoster, movieYear, userID) VALUES (?, ?, ?, ?, ?);" +
                            "INSERT INTO MOVIEEXTENDS (movieImdbID, moviePlot, movieUrl, movieRated, movieImdbRating, movieSeen, userID) VALUES (?, ?, ?, ?, ?, ?, ?);" +
                            "SELECT Movies.movieImdbID, Movies.movieTitle, Movies.moviePoster, Movies.userID, Movies.movieYear, MOVIEEXTENDS.moviePlot, MOVIEEXTENDS.movieUrl, MOVIEEXTENDS.movieRated, MOVIEEXTENDS.movieImdbRating, MOVIEEXTENDS.movieSeen, MOVIEEXTENDS.userID From Movies LEFT JOIN MOVIEEXTENDS ON Movies.movieImdbID=MOVIEEXTENDS.movieImdbID where Movies.movieImdbID=? and Movies.userID=?;",
                            [body.imdbID, body.title, body.poster, body.year, userID, body.imdbID, body.plot, body.website, body.rated, body.imdbRating, body.seen, userID, body.imdbID, userID]
                        ).then((response) => {
            let answ = response[0][2][0];
            let result = createMovieExtendModel(answ, userID);
            return result;
        }).catch(error => {
            console.error("Movie adding failed " + error.message);
            throw Error("Movie adding failed " + error.message)
        });
    } catch (error) {
        throw Error(error);
    }
};
    
function UpdateMovie(userID, imdbID, body){
    try {
        return connection.promise().query(
            "UPDATE Movies SET movieImdbID = ?, movieTitle = ?, moviePoster = ?, movieYear = ?, userID = ? WHERE movieImdbID = ? and userID = ?; " +
            "UPDATE MOVIEEXTENDS SET movieImdbID = ?, moviePlot = ?, movieUrl = ?, movieRated = ?, movieImdbRating = ?, movieSeen = ?, userID = ? WHERE movieImdbID = ? and userID = ?; " +
            "SELECT Movies.movieImdbID, Movies.movieTitle, Movies.moviePoster, Movies.userID, Movies.movieYear, MOVIEEXTENDS.moviePlot, MOVIEEXTENDS.movieUrl, MOVIEEXTENDS.movieRated, MOVIEEXTENDS.movieImdbRating, MOVIEEXTENDS.movieSeen, MOVIEEXTENDS.userID From Movies LEFT JOIN MOVIEEXTENDS ON Movies.movieImdbID=MOVIEEXTENDS.movieImdbID where Movies.movieImdbID=? and Movies.userID=?;",
            [imdbID, body.title, body.poster, body.year, userID, imdbID, userID, imdbID, userID, body.imdbID, body.plot, body.website, body.rated, body.imdbRating, body.seen, userID, imdbID, userID]
                        ).then((response) => {
            let answ = response[0][2][0];
            let result = createMovieExtendModel(answ, userID);
            return result;
        }).catch(error => {
            console.error("Movie update failed " + error.message);
            throw Error("Movie update failed " + error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function DeleteMovie(userID, imdbID){
    try {
        return connection.promise().query(
                            "DELETE FROM MOVIEEXTENDS WHERE movieImdbID = ? and userID=?; " +
                            "DELETE FROM Movies WHERE movieImdbID = ? and userID=?;",
                            [imdbID, userID, imdbID, userID]
                        ).then((response) => {
            return response.affectedRows;
        }).catch(error => {
            console.error("Movie delete failed " + error.message);
            throw Error("Movie delete failed " + error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function DeleteMoviesByUser(userID){
    try {
        return connection.promise().query(
                        "DELETE FROM MOVIEEXTENDS WHERE userID=?; " +
                        "DELETE FROM Movies WHERE userID=?;",
                        [userID, userID]
        ).then((response) => {
            return response.affectedRows;
        }).catch(error => {
            console.error("Movie delete failed " + error.message);
            throw Error("Movie delete failed " + error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}


function DeleteMovies(){
    try {
        return connection.promise().query("DELETE FROM MOVIEEXTENDS; DELETE FROM Movies;").then((response) => {
            return response.affectedRows;
        }).catch(error => {
            console.error("Movie delete failed " + error.message);
            throw Error("Movie delete failed " + error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

module.exports ={
    GetAllMovies:GetAllMovies,
    GetByWord:GetByWord,
    GetById:GetById,
    GetByTitle:GetByTitle,
    AddMovie:AddMovie,
    UpdateMovie:UpdateMovie,
    DeleteMovie:DeleteMovie,
    DeleteMoviesByUser:DeleteMoviesByUser,
    DeleteMovies:DeleteMovies
};