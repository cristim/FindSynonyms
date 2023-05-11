chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === 'findSynonyms') {
            findSynonymsInPage(request.word)
                .catch(error => {
                    console.error('Error in findSynonymsInPage:', error);
                    sendResponse({ error: error.message });
                });
        }
        return true; // async response
    }
);
async function findSynonymsInPage(word) {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            if (!tabs.length) {
                console.error('No active tabs found.');
                return;
            }
            console.log("Active tab ID:", tabs[0].id);  // Log the active tab ID
            const tabId = tabs[0].id;
            const synonymsForWord = await fetchSynonyms(word);
            console.log("Synonyms:", synonymsForWord);  // Log the fetched synonyms
            if (synonymsForWord && synonymsForWord.length > 0) {
                await replaceSynonymsInPage(word, synonymsForWord, tabId);
            } else {
                console.log(`No synonyms found for the word: ${word}`);
            }
        });
    } catch (error) {
        console.error(`Error in findSynonymsInPage function: ${error}`);
    }
}


async function fetchSynonyms(word) {
    try {
        let response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching synonyms for word ${word}:`, error);
        throw error;
    }
}

async function replaceSynonymsInPage(word, synonymsForWord, tabId) {
    try {
        // Store the word and synonyms in chrome.storage.local
        await chrome.storage.local.set({ word: word, synonyms: synonymsForWord });
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content_script.js']
        });
    } catch (error) {
        console.error('Error replacing synonyms in page:', error);
        throw error;
    }
}
