function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addAblaufPunkt(id) {
	const thisElement = document.getElementById(id);
	if (thisElement.value != '') {
		let ablaufPunkt = document.createElement('input');
		ablaufPunkt.type = 'text';
		ablaufPunkt.name = 'ablauf';
		ablaufPunkt.setAttribute('onchange', `addAblaufPunkt(${id + 1})`);
		ablaufPunkt.id = id + 1;

		let zeitPunkt = document.createElement('input');
		zeitPunkt.type = 'text';
		zeitPunkt.name = 'zeit';
		zeitPunkt.id = id + 9990;

		insertAfter(document.getElementById(`${9989 + id}`), zeitPunkt);

		insertAfter(document.getElementById(`${id}`), ablaufPunkt);
	} else {
		removeAblaufPunkt(id);
	}
}

function removeAblaufPunkt(id) {
	const valueAblauf = document.getElementById(id + 1).value;
	if (valueAblauf == '') {
		document.getElementById(id + 1).remove();
		document.getElementById(id + 9990).remove();
	}
}

function confirmSave() {
	const button = document.getElementById('save');
	button.style.backgroundColor = 'lightgreen';
	setTimeout(() => {
		button.style = '';
	}, 2000);
}
