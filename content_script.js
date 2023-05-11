chrome.storage.local.get(['word', 'synonyms'], function (data) {
    console.log('Getting data from storage:', data);
    const { word, synonyms } = data;
    const regex = new RegExp(word, 'gi');
    const elements = [...document.body.getElementsByTagName('*')];
    console.log('Elements to process:', elements.length);
    elements.forEach((element, i) => {
        console.log(`Processing element ${i + 1} of ${elements.length}`);
        element.childNodes.forEach((child) => {
            if (child.nodeType === 3) {
                const synonym = synonyms[Math.floor(Math.random() * synonyms.length)].word;
                console.log('Synonym:', synonym);
                child.textContent = child.textContent.replace(regex, synonym);
            }
        });
    });
    // Clear the word and synonyms from chrome.storage.local
    chrome.storage.local.remove(['word', 'synonyms'], function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log('Word and synonyms removed from storage');
        }
    });
});
