// ==UserScript==
// @name         Path Finder
// @namespace
// @description  Capture webpage URLs (right click on the web page and the RunScanner button appears)
// @version      1.6
// @match        *://*/*
// @run-at       document-end
// @icon         https://truelonely.cyou/resources/images/search.png
// @author       TrueLonely
// ==/UserScript==

(function() {
    let triggerBtn = document.createElement("button");
    triggerBtn.textContent = "Run Scanner";
    triggerBtn.style.color= "black";
    triggerBtn.style.position = "fixed";
    triggerBtn.style.top = "10px";
    triggerBtn.style.left = "10px";
    triggerBtn.style.zIndex = "999999";
    triggerBtn.style.padding = "6px 12px";
    triggerBtn.style.border = "1px solid gray";
    triggerBtn.style.background = "#eee";
    triggerBtn.style.cursor = "pointer";
    triggerBtn.style.display = "none";

    document.body.appendChild(triggerBtn);

    document.addEventListener("contextmenu", function() {
        triggerBtn.style.display = "block";

        function hideOnNextClick(ev) {
            if (ev.target !== triggerBtn) {
                triggerBtn.style.display = "none";
            }
            document.removeEventListener("mousedown", hideOnNextClick);
        }

        document.addEventListener("mousedown", hideOnNextClick);
    });

    triggerBtn.addEventListener("click", function() {
        triggerBtn.style.display = "none";
        runScanner();
    });

    function runScanner() {

        let box = document.createElement("div");
        box.style.position = "fixed";
        box.style.bottom = "0";
        box.style.left = "0";
        box.style.width = "100%";
        box.style.height = "50%";
        box.style.background = "white";
        box.style.color = "black";
        box.style.zIndex = "9999";
        box.style.borderTop = "2px solid black";
        box.style.display = "flex";
        box.style.flexDirection = "column";

        // Sticky header
        let header = document.createElement("div");
        header.style.flex = "0 0 auto";
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.gap = "10px";
        header.style.padding = "10px";
        header.style.borderBottom = "1px solid #ccc";
        header.style.background = "#f5f5f5";

        let title = document.createElement("h4");
        title.textContent = "Unique Paths Found:";
        title.style.margin = "0";
        title.style.flex = "1";

        let copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy";
        copyBtn.style.border = "1px solid gray";
        copyBtn.style.background = "#eee";

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.border = "1px solid gray";
        closeBtn.style.background = "#eee";
        closeBtn.onclick = () => box.remove();

        header.appendChild(title);
        header.appendChild(copyBtn);
        header.appendChild(closeBtn);
        box.appendChild(header);

        let resultsWrap = document.createElement("div");
        resultsWrap.style.flex = "1";
        resultsWrap.style.overflowY = "auto";
        resultsWrap.style.padding = "10px";

        let list = document.createElement("ul");
        resultsWrap.appendChild(list);
        box.appendChild(resultsWrap);

        document.body.appendChild(box);

        let collected = [];
        let fetched = new Set;

        async function fetchText(u){
            try{
                const r = await fetch(u);
                return r.ok ? await r.text() : null;
            }catch(e){ return null; }
        }

        function validate(p){
            return (p.startsWith("/")||p.startsWith("./")||p.startsWith("../"))
                && !p.includes(" ")
                && p.length>1 && p.length<200;
        }

        function extract(str){
            return [...str.matchAll(/[%27"]((?:\/|\.\.\/|\.\/)[^%27"]+)[%27"]/g)]
                .map(m => m[1])
                .filter(validate);
        }

        async function scanRes(u){
            if (fetched.has(u)) return;
            fetched.add(u);

            const txt = await fetchText(u);
            if (!txt) return;

            collected.push(...extract(txt));
        }

        (async function(){
            let resources = performance.getEntriesByType("resource").map(r=>r.name);

            for (const r of resources) await scanRes(r);

            let unique = [...new Set(collected)];
            list.innerHTML = unique.map(x => `<li>${x}</li>`).join("");

            copyBtn.onclick = () => navigator.clipboard.writeText(unique.join("\n"));
        })();
    }

})();
