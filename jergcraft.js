/**
 * jergcraft.js
 * Automatically replaces occurrences of "eaglercraft" with "jergcraft" on the page.
 */
(function() {
    'use strict';

    // Function to handle text replacement inside a text node
    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.nodeValue;
            
            // Case-insensitive global regex matching "eaglercraft"
            const updatedText = originalText.replace(/eaglercraft/gi, (match) => {
                // Match the capitalization style of the original word
                if (match === match.toUpperCase()) {
                    return 'JERGCRAFT';
                }
                if (match[0] === match[0].toUpperCase()) {
                    return 'Jergcraft';
                }
                return 'jergcraft';
            });

            // Update the node value only if a change occurred
            if (originalText !== updatedText) {
                node.nodeValue = updatedText;
            }
        } else {
            // Recursively search child nodes, skipping script and style elements
            if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
                for (let child of node.childNodes) {
                    replaceTextInNode(child);
                }
            }
        }
    }

    // Execute the replacement on elements already loaded in the document body
    if (document.body) {
        replaceTextInNode(document.body);
    }

    // Monitor the document for any dynamically loaded or modified content
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let addedNode of mutation.addedNodes) {
                replaceTextInNode(addedNode);
            }
        }
    });

    // Configuration for the mutation observer
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
