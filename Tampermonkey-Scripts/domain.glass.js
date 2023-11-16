// ==UserScript==
// @name         domain.glass
// @namespace    https://github.com/atxiii
// @version      0.1
// @description  try to take over the world!
// @author       CatFather
// @match        https://domain.glass/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=domain.glass
// @grant        none
// ==/UserScript==


(function() {

    'use strict';
    const btn = document.createElement('a');
    btn.href="javascript:;"
    btn.onclick = mrcatdev_extract_subs_abuse_ip;
    btn.textContent = 'Download'
    btn.className='btn btn-sm btn-primary mb-4'
   document.querySelectorAll('h4')[1].prepend(btn);

})();

function mrcatdev_extract_subs_abuse_ip(){
    let subs='';
   document.querySelectorAll('h4')[1].nextElementSibling.querySelectorAll('td>a').forEach(sub=> {
         subs+= sub.title + "\n";
    })

    const blob = new Blob([subs], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = document.title.replaceAll(" ",'-').replaceAll("|","-")+".txt";
    link.click();
    URL.revokeObjectURL(url);
}
