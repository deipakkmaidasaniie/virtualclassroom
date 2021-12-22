const jwt = require("jsonwebtoken");

// function for a middleware in order to check whether the token is okay or not so that the protected routes can be accessed
function authenticateToken(req, res, next) {
	// spliting the Authorization header into two parts as it contains Bearer + Token
	let token=req.headers.cookie;
	token=token && token.split("; ")[1];
	token=token.split("=")[1];
	//const token = authHeader && authHeader.split(" ")[1];
	// console.log(token);
	// const token=req.cookies.jwt;
	let isSuccess, message, status;
	if (!token) {
		isSuccess = false;
		message = "Token is missing!";
		status = 401;
		return res.status(status).json({
			isSuccess: isSuccess,
			message: message,
			status: status,
		});
	}
	jwt.verify(token, process.env.USER_ACCESS_KEY, (err, user) => {
		// verify the token
		if (err) {
			isSuccess = false;
			message = "Cannot verify the token or the token has expired!";
			status = 403;
			return res.status(status).json({
				isSuccess: isSuccess,
				message: message,
				status: status,
			});
		}
		req.user = user;
	});
	next(); // will make call to the function using the middleware
}

module.exports = authenticateToken;
//module.exports=authJwt;