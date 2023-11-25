// ==UserScript==
// @name         Google-Subsidiaries
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.google.com/search?q=*+subsidiaries*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
     const btn = document.createElement('button');
     btn.onclick = mrcatdev_subsidiary;
     btn.textContent = 'Download'
     btn.style.position='fixed'
     btn.style.top='200px'
     btn.style.left='50px'
     btn.style.zIndex='99'
     document.body.append(btn)

})();


function mrcatdev_subsidiary(){
    let data=""
    document.querySelectorAll('g-scrolling-carousel div div a').forEach( i => data+=i.textContent+"\n" )
    const blob = new Blob([data], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = document.title.replaceAll(" ",'').replaceAll("|","-")+".txt";
    link.click();
    URL.revokeObjectURL(url)
}
