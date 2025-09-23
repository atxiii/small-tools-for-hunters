// ==UserScript==
// @name         Extract url from crt.sh
// @namespace    https://github.com/atxiii
// @version      0.1
// @description  export subdomains
// @author       CatFather
// @match        https://crt.sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const btn = document.createElement('button');
    btn.onclick = mrcatdev_extract;
    btn.textContent = 'Download'
    document.getElementsByTagName('table')[1].prepend(btn);

})();

function mrcatdev_extract(){

    const table = document.getElementsByTagName('table')[2]
    let data = '';
    for (let i = 0; i < table.rows.length; i++) {
        let cell = table.rows[i].cells[5];
        data += cell.innerHTML.trim() + "\n";
    }
    const blob = new Blob([data], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = document.title.replaceAll(" ",'').replaceAll("|","-")+".txt";
    link.click();
    URL.revokeObjectURL(url);
}
