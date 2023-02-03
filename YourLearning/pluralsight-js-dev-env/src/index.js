import './index.css';
// import numeral from 'numeral';
import { getUsers, deleteUser } from './api/userApi';

// const courseValue = numeral(1000).format('$0,0.00');
// console.log(`I would pay ${courseValue} for this awesome course!`); // eslint-disable-line no-console

getUsers().then(result => {
	let tableBody = "";

	result.forEach(user => {
		tableBody += `<tr>
			<td><a href="#" data-id="${user.id}" class="deleteUser">Delete</a></td>
			<td>${user.id}</td>
			<td>${user.firstName}</td>
			<td>${user.lastName}</td>
			<td>${user.email}</td>
		</tr>`;
	});
	global.document.getElementById('users').innerHTML = tableBody;

	const deleteLinks = global.document.getElementsByClassName('deleteUser');

	// Must user array.from to create a real array from a DOM collection
	// getElementsByClassName only returns an "array like" object
	Array.from(deleteLinks, link => {
		link.onclick = e => {
			e.preventDefault();
			const element = e.target;
			deleteUser(element.attributes['data-id'].value);
			const row = element.parentNode.parentNode;
			row.parentNode.removeChild(row)
		};
	});
});
