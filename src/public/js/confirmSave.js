function confirmSave() {
	const button = document.getElementById('save');
	button.style.backgroundColor = 'lightgreen';
	setTimeout(() => {
		button.style = '';
	}, 2000);
}

function confirmSync() {
	const button = document.getElementById('sync');
	button.style.backgroundColor = 'lightgreen';
	setTimeout(() => {
		button.style = '';
	}, 2000);
}
