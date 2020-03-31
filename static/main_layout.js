document.addEventListener('DOMContentLoaded', () => {

	/* Define the actions when the navbar buttons are clicked. */
	document.querySelector('#home-button').onclick = () => {
		window.location.href = location.protocol + '//' + document.domain + ':' + location.port;
	};
	document.querySelector('#solo-button').onclick = () => {
		window.location.href = location.protocol + '//' + document.domain + ':' + location.port + '/solo';
	};
	document.querySelector('#duo-button').onclick = () => {
		window.location.href = location.protocol + '//' + document.domain + ':' + location.port + '/duo';
	};
});
