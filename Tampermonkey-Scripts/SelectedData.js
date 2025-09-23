// ==UserScript==
// @name         SelectedText
// @namespace    http://tampermonkey.net/
// @version      2025-09-22
// @description  Send selected content to Discord (always top-right corner)
// @author       TrueLonely
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const webhooks = {
        "General": "https://discord.com/api/webhooks/1419767332447981588/Ga7X-NWYlj9bVQkngBh4EhKOaU1eaYzfqSqNMsDuU4btJAzEabN72lLqxT9XBDJ0cKEM",
        "Alerts": "https://discord.com/api/webhooks/ID2/TOKEN2",
        "Logs": "https://discord.com/api/webhooks/ID3/TOKEN3"
    };

    const menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.top = "10px";
    menu.style.right = "10px";
    menu.style.background = "#fff";
    menu.style.border = "1px solid #000";
    menu.style.padding = "5px";
    menu.style.display = "none";
    menu.style.zIndex = 99999999;
    menu.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";
    menu.style.borderRadius = "4px";
    menu.style.pointerEvents = "auto";
    menu.style.fontFamily = "sans-serif";
    menu.style.fontSize = "14px";

    for (const name in webhooks) {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.style.display = "block";
        btn.style.margin = "2px 0";
        btn.style.cursor = "pointer";
        btn.onclick = () => {
            const selected = window.getSelection().toString();
            if (!selected) return;
            fetch(webhooks[name], {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: selected })
            });
            menu.style.display = "none";
        };
        menu.appendChild(btn);
    }

    document.documentElement.appendChild(menu);

    document.addEventListener("contextmenu", e => {
        const selected = window.getSelection().toString();
        if (!selected) {
            menu.style.display = "none";
            return;
        }
        menu.style.display = "block";
    });

    document.addEventListener("click", e => {
        if (!menu.contains(e.target)) {
            menu.style.display = "none";
        }
    });

    document.addEventListener("scroll", () => {
        menu.style.display = "none";
    }, true);
})();
