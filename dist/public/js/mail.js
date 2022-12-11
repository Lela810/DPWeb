window.onload = () => {
	document
		.getElementById('save')
		.addEventListener('click', getDataFromTinyMCE, confirmSave);
};

function getDataFromTinyMCE() {
	let editorContent = tinymce.get('editor').getContent();
	document.getElementById('editor').value = editorContent;
	document.getElementById('mailForm').submit();
}
