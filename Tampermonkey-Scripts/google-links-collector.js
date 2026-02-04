// ==UserScript==
// @name         Google Search Links Collector
// @namespace    https://jsecurity.ir/
// @version      1.1
// @description  Collect and download Google search result links page by page
// @author       Hossein Shourabi
// @match        https://www.google.com/search*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'g_search_links_all';
    const STATE_KEY   = 'g_search_collecting_state';

    // ─── Helper: Current page number ────────────────────────────────────────
    function getCurrentPageNum() {
        const params = new URLSearchParams(location.search);
        const start = parseInt(params.get('start') || '0', 10);
        return Math.floor(start / 10) + 1;
    }

    // ─── Extract links from current page (your working selector) ─────────────
    function extractLinks() {
        const links = [];
        document.querySelectorAll('#rso [jscontroller] a[jsname]').forEach(el => {
            let url;
            for (const attr of el.attributes) {
                if (attr.value && attr.value.includes('&url=')) {
                    url = attr.value;
                    break;
                }
            }
            if (!url) return;
            const urlPart = url.split('&url=')[1];
            if (urlPart) {
                try {
                    links.push(decodeURIComponent(urlPart.split('&')[0]));
                } catch {}
            }
        });
        return links;
    }

    // ─── Find next page URL ─────────────────────────────────────────────────
    function getNextPageUrl() {
        const a = document.querySelector('a[aria-label="Next page"], a#pnnext');
        return a ? a.href : null;
    }

    // ─── Storage helpers ────────────────────────────────────────────────────
    function loadAllData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }

    function savePageData(page, links) {
        const data = loadAllData();
        data[page] = links;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getAllLinksText() {
        const data = loadAllData();
        let text = '';
        Object.keys(data)
            .map(Number)
            .sort((a,b)=>a-b)
            .forEach(pg => {
                data[pg].forEach(link => text += link + '\n');
                text += '\n';
            });
        return text;
    }

    function clearCollectedData() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STATE_KEY);
    }

    // ─── Your download function (unchanged) ─────────────────────────────────
    function downloadTxt(content, customName = '') {
        const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        let title = document.title
            .replace(/[|]/g, '-')
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-آ-ی]/g, '');
        if (customName) title = customName;
        a.download = title + '.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // ─── Download only current page ─────────────────────────────────────────
    function downloadCurrentPage() {
        const page = getCurrentPageNum();
        const links = extractLinks();
        if (!links.length) {
            alert('Not found any links here!');
            return;
        }
        const text = links.join('\n') + '\n';
        downloadTxt(text, `google-page-${page}`);
    }

    // ─── Start collecting all pages ─────────────────────────────────────────
    function startCollectingAll() {
        clearCollectedData();
        localStorage.setItem(STATE_KEY, 'running');
        collectCurrentPageAndGoNext();
    }

    // ─── Main loop logic ────────────────────────────────────────────────────
    function collectCurrentPageAndGoNext() {
        if (localStorage.getItem(STATE_KEY) !== 'running') return;

        const page = getCurrentPageNum();
        const links = extractLinks();

        if (links.length > 0) {
            savePageData(page, links);
        }

        const nextUrl = getNextPageUrl();

        if (nextUrl) {
            setTimeout(() => {
                location.href = nextUrl;
            }, 1800);
        } else {

            const allText = getAllLinksText();
            if (allText.trim()) {
                downloadTxt(allText, 'google-all-pages');
            } else {
                alert('not found');
            }
            clearCollectedData();
        }
    }

    // ─── Auto-continue after page load ──────────────────────────────────────
    if (localStorage.getItem(STATE_KEY) === 'running') {
        setTimeout(collectCurrentPageAndGoNext, 1200);
    } else {
        // buttons
        const container = document.querySelector('[role="list"]');
        const wrapper = document.createElement('div');
        const style= {
            'padding': '0',
            'cursor': 'pointer',
            'background': 'transparent',
            'color': '#ccc',
            'border': 'none',
            'display': 'inline-block',
            'white-space': 'nowrap',
            'width': 'fit-content',
            'font-family': 'Google Sans, Arial, sans-serif',
            'font-size': '14px',
            'line-height': '20px',
            'border-bottom': '3px solid transparent',
            'padding-bottom': '8px',
            'margin-right':'8px'
        }

        Object.assign(wrapper.style, {
         'display': 'flex',
         'min-height': '48px',
         'padding': '0',
         'align-items': 'end'
        });

        const btnCurrent = document.createElement('button');
        btnCurrent.textContent = 'This Page';
        btnCurrent.onclick = downloadCurrentPage;
        Object.assign(btnCurrent.style, style);

        const btnAll = document.createElement('button');
        btnAll.textContent = 'All Pages';
        btnAll.onclick = startCollectingAll;
        Object.assign(btnAll.style, style);

        wrapper.append(btnCurrent, btnAll);
        container.append(wrapper);

    }

})();
