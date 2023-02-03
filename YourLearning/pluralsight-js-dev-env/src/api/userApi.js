import { fetch } from 'whatwg-fetch';
import getBaseUrl from './baseUrl';

/* eslint-disable no-console */

const baseUrl = getBaseUrl();

function onSuccess(response) {
	return response.json();
}

function onError(error) {
	console.log(error);
}

function get(url) {
	return fetch(baseUrl + url).then(onSuccess, onError);
}

export function getUsers() {
	return get('users');
}

function del(url) {
	const request = new Request(baseUrl + url, {
		method: 'DELETE'
	});

	return fetch(request).then(onSuccess, onError);
}

export function deleteUser(id) {
	return del(`users/${id}`);
}
