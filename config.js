/******************************************************************************************

We configure... because we can

******************************************************************************************/

module.exports = {
	// Build target directories, this is where all the static files will end up
	target: "./static",
	htmltarget: "./",

	remoteTarget: "../easyrtc/static/fe/static",
	remoteHtmlTarget: "../easyrtc/static/fe",

	// The root directory for all api calls
	apiroot: "http://192.168.2.109:6502/application",

	// The api path for the labourstats service
	labourstatsroot: "/",
};
