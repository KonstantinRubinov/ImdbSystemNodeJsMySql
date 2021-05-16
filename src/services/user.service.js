const bcrypt = require("bcrypt");
const connection = require("../database/db");
const User = require("../models/User");
const movieService = require("../services/movie.service");
const movieextendService = require("../services/movieextend.service");

var fs = require('fs');

function isValidIsraeliID(id) {
    id = String(id).trim();
    if (id.length > 9 || id.length < 5 || isNaN(id)){
        return false;
    }
    

    // Pad string with zeros up to 9 digits
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

    let res= Array
        .from(id, Number)
        .reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
        }) % 10 === 0;

    return res;
}

function createGuid(){  
    function S4() {  
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
    }  
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();  
}

function GetAllUsers(){
    try {
        return connection.promise().query("SELECT * FROM Users")
        .then((response) => {
            let answ = response[0];
            return answ;
        }).catch(error => {
            console.error(error.message);
            throw Error(error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function GetOneUser(userID){
    try {
        return connection.promise().query(`SELECT * FROM Users WHERE userID = ${userID}`)
        .then((response) => {
            let answ = response[0];
            return answ;
        }).catch(error => {
            console.error(error.message);
            throw Error(error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function ReturnUserByNamePassword(userNickName, userPassword){
    try {
        return connection.promise().query(`SELECT * FROM Users WHERE userNickName = ${userNickName} and userPassword = ${userPassword}`)
        .then((response) => {
            let answ = response[0];
            return answ;
        }).catch(error => {
            console.error(error.message);
            throw Error(error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function AddUser(body){
    return bcrypt.hash(body.userPassword, 10).then((hash) => {
        let extension = "";
        let pictureName = "";
        let filePath="";
        let buff="";
        let fd="";

        if(!isValidIsraeliID(body.userID)){
            throw Error(error);
        }

        if(body.userPicture!==undefined && body.userPicture!==null && body.userPicture!==""){
            extension = body.userPicture.split(".");
            extension = extension[extension.length-1];
            pictureName = createGuid()+"."+extension;
            filePath = "./src/assets/images/users/"+pictureName;
            body.userImage = body.userImage.replace(/^data:image\/\w+;base64,/, "");
            body.userImage = body.userImage.replace(/ /g, '+');
            buff = new Buffer.from(body.userImage, 'base64');
            fd =  fs.openSync(filePath, 'w');
            fs.write(fd, buff, 0, buff.length, 0, function(error,written){
                if (error!=null){
                    fs.closeSync( fd );
                    throw Error(error);
                }
                fs.closeSync( fd );
            });
            body.userImage = "";
        }
        
        const user = new User({
            userID: body.userID,
            userFirstName: body.userFirstName,
            userLastName: body.userLastName,
            userNickName:body.userNickName,
            userPassword: hash,
            userEmail: body.userEmail,
            userGender: body.userGender,
            userBirthDate: body.userBirthDate,
            userPicture: pictureName,
            userImdbPass: body.userImdbPass
        });
        
        return connection.promise().query("INSERT INTO Users (userID, userFirstName, userLastName, userNickName, userBirthDate, userGender, userEmail, userPassword, userPicture, userImdbPass) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); SELECT * FROM Users where userID=?;", 
                                        [user.userID, user.userFirstName, user.userLastName, user.userNickName, user.userBirthDate, user.userGender, user.userEmail, user.userPassword, user.userPicture, user.userImdbPass, user.userID]).then((response) => {
            let answ = response[0][1][0];
            answ.userPassword = body.userPassword;
            return answ;
        }).catch(error => {
            console.error("Registration failed " + error.message);
            throw Error("Registration failed " + error.message)
        });
    });
};

function UpdateUser(body, userID){
    try {
        return connection.promise().query(
            "UPDATE Users SET userID = ?, userFirstName = ?, userLastName = ?, userNickName = ?, userBirthDate = ?, userGender = ?, userEmail = ?, userPassword = ?, userPicture = ?, userImdbPass = ? where userID=?; SELECT * FROM Users where userID=?;",
            [userID, body.userFirstName, body.userLastName, body.userNickName, body.userBirthDate, body.userGender, body.userEmail, body.userPassword, body.userPicture, body.userImdbPass, userID, userID]
                        ).then((response) => {
            let answ = response[0][2][0];
            return answ;
        }).catch(error => {
            console.error("User update failed " + error.message);
            throw Error("User update failed " + error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function DeleteUser(userID){
    try {
        return connection.promise().query(
            "DELETE FROM Users WHERE userID = ?", userID
                        ).then((response) => {
            response.affectedRows = response.affectedRows + movieService.DeleteMoviesByUser(userID);
            response.affectedRows = response.affectedRows + movieextendService.DeleteMoviesByUser(userID);
            return response.affectedRows;
        }).catch(error => {
            console.error("User delete failed " + error.message);
            throw Error("User delete failed " + error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

function DeleteUsers(){
    try {
        return connection.promise().query(
            "DELETE FROM Users"
                        ).then((response) => {
            response.affectedRows = response.affectedRows + movieService.DeleteMovies();
            response.affectedRows = response.affectedRows + movieextendService.DeleteMovies();
            return response.affectedRows;
        }).catch(error => {
            console.error("User delete failed " + error.message);
            throw Error("User delete failed " + error.message)
        });
    } catch (error) {
        throw Error(error);
    }
}

module.exports ={
    GetAllUsers:GetAllUsers,
    GetOneUser:GetOneUser,
    ReturnUserByNamePassword:ReturnUserByNamePassword,
    AddUser:AddUser,
    UpdateUser:UpdateUser,
    DeleteUser:DeleteUser,
    DeleteUsers:DeleteUsers
};