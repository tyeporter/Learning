
function getQueryStringParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");  // eslint-disable-line no-useless-escape
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	const results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export default function getBaseUrl() {
	return getQueryStringParameterByName('useMockApi') ? 'http://localhost:3001/' :
		getQueryStringParameterByName('useHerokuApi') ? 'https://limitless-savannah-73642.herokuapp.com/' : '/';
}


