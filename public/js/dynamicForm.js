function removeThisElement() {
	this.parentElement.remove();
}

function addElement(names) {
	const primary = document.createElement('input');
	primary.type = 'text';
	primary.name = names[0];
	primary.placeholder = names[0].charAt(0).toUpperCase() + names[0].slice(1);

	const secondary = document.createElement('input');
	secondary.type = 'text';
	secondary.name = names[1];
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

function confirmSave() {
	const button = document.getElementById('save');
	button.style.backgroundColor = 'lightgreen';
	setTimeout(() => {
		button.style = '';
	}, 2000);
}

window.onload = () => {
	const button = document.getElementsByClassName('removeButton');
	for (let i = 0; i < button.length; i++) {
		button[i].addEventListener('click', removeThisElement);
	}
};
