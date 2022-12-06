tinymce.init({
	selector: 'textarea#editor',
	height: 500,
	menubar: true,
	branding: false,
	promotion: false,
	setup: function (editor) {
		editor.on('change', function () {
			tinymce.triggerSave();
		});
	},
	plugins: [
		'autolink',
		'lists',
		'link',
		'image',
		'charmap',
		'preview',
		'anchor',
		'searchreplace',
		'visualblocks',
		'fullscreen',
		'insertdatetime',
		'media',
		'table',
		'help',
		'wordcount',
	],
	toolbar:
		'undo redo | casechange blocks | bold italic backcolor | ' +
		'alignleft aligncenter alignright alignjustify | ' +
		'bullist numlist checklist outdent indent | removeformat | table help',
});
