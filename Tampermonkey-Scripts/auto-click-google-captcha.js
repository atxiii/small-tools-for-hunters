// ==UserScript==
// @name         auto click on captcha
// @namespace    http://tampermonkey.net/
// @version      2026-02-03
// @description  auto click on google captcha v2
// @author       Hossein Shourabi
// @match        https://www.google.com/sorry/index?continue=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = null;

function clickIframeElement() {
    try {
        const iframe = document.querySelector('iframe');
        if (!iframe || !iframe.contentDocument) return;

        const targetElement = iframe.contentDocument.querySelectorAll('div')[0];
        if (targetElement) {
            targetElement.click();
        }
    } catch (error) {
        alert('Access error');
    }
}

function startClicking(intervalTime = 2000) {
    stopClicking();

    window.addEventListener('load', function init() {
        window.removeEventListener('load', init);

        setTimeout(() => {
            clickIframeElement();
            intervalId = setInterval(clickIframeElement, intervalTime);
        }, 1000);
    });

    if (document.readyState === 'complete') {
        setTimeout(() => {
            clickIframeElement();
            intervalId = setInterval(clickIframeElement, intervalTime);
        }, 1000);
    }
}

function stopClicking() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('Stopped');
    }
}

startClicking(2000);
})();
