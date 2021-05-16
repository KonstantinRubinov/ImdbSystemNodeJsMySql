const Login = function(login) {
	this.userNickName = login.userNickName;
	this.userPassword = login.userPassword;
	this.userLevel = login.userLevel;
	this.userPicture = login.userPicture;
	this.userImdbPass = login.userImdbPass;
};

module.exports = Login;