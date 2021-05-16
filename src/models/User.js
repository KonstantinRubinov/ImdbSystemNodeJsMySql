const User = function(user) {
	this.userID = user.userID;
	this.userFirstName = user.userFirstName;
	this.userLastName = user.userLastName;
	this.userNickName = user.userNickName;
	this.userPassword = user.userPassword;
    this.userEmail = user.userEmail;
    this.userGender = user.userGender;
    this.userBirthDate = user.userBirthDate;
    this.userPicture = user.userPicture;
    // this.userLevel = user.userLevel;
	//this.userImage = user.userImage;
	this.userImdbPass = user.userImdbPass;
};


module.exports = User;