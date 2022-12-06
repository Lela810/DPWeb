function confirmSave() {
	const button = document.getElementById('save');
	button.style.backgroundColor = 'lightgreen';
	setTimeout(() => {
		button.style = '';
	}, 2000);
}
