const connection = require("../database/db");
const movieSchema = require("../models/Movie");

function createMovieModel(jmovie, userID)
{
    let year= Number(jmovie.Year);
    const movieModel = new movieSchema({
        imdbID: jmovie.imdbID,
        title: jmovie.Title,
        poster: jmovie.Poster,
        userID: userID,
        year: year
    });
	return movieModel;
}

function GetAllMovies(userID){
    try {
        return connection.promise().query(`SELECT * from Movies where userID = ${userID}`)
        .then((response) => {
            let answ = response[0];
            let movies=[];
            for(var i = 0; i < answ.length; i++) {
                movies.push(createMovieModel(answ[i], userID));
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
        return connection.promise().query(`SELECT * from Movies where movieTitle LIKE '%' + ${word} + '%' and userID=${userID}`)
        .then((response) => {
            let answ = response[0];
            let movies=[];
            for(var i = 0; i < answ.length; i++) {
                movies.push(createMovieModel(answ[i], userID));
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
        return connection.promise().query(`SELECT * from Movies where movieImdbID=${imdbID} and userID=${userID}`)
        .then((response) => {
            let answ = response[0];
            let result = createMovieModel(answ, userID);
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
        return connection.promise().query(`SELECT * from Movies where movieTitle=${title} and userID=${userID}`)
        .then((response) => {
            let answ = response[0];
            let result = createMovieModel(answ, userID);
            return result;
        }).catch(error => {
            console.error(error.message);
            throw Error(error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function AddMovie(userID, newMovie){
    try {
        return connection.promise().query("INSERT INTO Movies (movieImdbID, movieTitle, moviePoster, movieYear, userID) VALUES (?, ?, ?, ?, ?); SELECT * FROM Movies WHERE movieImdbID = ? and userID=?;",
        [newMovie.imdbID, newMovie.title, newMovie.poster, newMovie.year, userID, newMovie.imdbID, userID]
                        ).then((response) => {
            let answ = response[0][2][0];
            let result = createMovieModel(answ, userID);
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
            "UPDATE Movies SET movieImdbID = ?, movieTitle = ?, moviePoster = ?, movieYear =?, userID = ? WHERE movieImdbID = ? and userID = ?; SELECT * FROM Movies WHERE movieImdbID = ? and userID=?;",
            [imdbID, body.title, body.poster, body.year, userID, imdbID, userID, imdbID, userID]
                        ).then((response) => {
            let answ = response[0][2][0];
            let result = createMovieModel(answ, userID);
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
            "DELETE FROM Movies WHERE movieImdbID=? and userID=?", [imdbID, userID]
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
        return connection.promise().query("DELETE FROM Movies WHERE userID=?", userID).then((response) => {
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
        return connection.promise().query("DELETE FROM Movies").then((response) => {
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