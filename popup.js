document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', function () {
        const wordInput = document.getElementById('word-input').value;
        chrome.runtime.sendMessage({ action: 'findSynonyms', word: wordInput }, function (response) {
            if (response && response.error) {
                console.error('Error:', response.error);
            }
        });
    });
});
