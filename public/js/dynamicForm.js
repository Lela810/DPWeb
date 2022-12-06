function removeThisElement() {
	this.parentElement.remove();
}

function addElement(elements, names, types, required) {
	const primary = document.createElement(elements[0]);
	primary.type = types[0];
	primary.name = names[0];
	if (required[0]) {
		primary.required = true;
	}
	primary.placeholder = names[0].charAt(0).toUpperCase() + names[0].slice(1);

	const secondary = document.createElement(elements[1]);
	secondary.type = types[1];
	secondary.name = names[1];
	if (required[1]) {
		secondary.required = true;
	}
	secondary.placeholder = names[1].charAt(0).toUpperCase() + names[1].slice(1);

	const removeButton = document.createElement('button');
	removeButton.type = 'button';
	removeButton.innerHTML = '-';
	removeButton.addEventListener('click', removeThisElement);
	removeButton.className = ' border-2 rounded-full py-2 px-4 ';

	const input = document.getElementById('input');
	const div = document.createElement('div');

	input.appendChild(div);
	div.appendChild(primary);
	div.appendChild(secondary);
	div.appendChild(removeButton);
}

window.onload = () => {
	const button = document.getElementsByClassName('removeButton');
	for (let i = 0; i < button.length; i++) {
		button[i].addEventListener('click', removeThisElement);
	}
};
