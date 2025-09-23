// ==UserScript==
// @name         Subdomains-abuseip
// @namespace    https://github.com/atxiii
// @version      0.1
// @description  try to take over the world!
// @author       CatFather
// @match        https://www.abuseipdb.com/whois/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=abuseipdb.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const btn = document.createElement('a');
    btn.href="javascript:;"
    btn.onclick = mrcatdev_extract_subs_abuse_ip;
    btn.textContent = 'Download'
    document.querySelector('#feedback').append(btn);

})();

function mrcatdev_extract_subs_abuse_ip(){
    let subs='';
    const domainName= document.querySelector('h1.text-center').innerText;
    console.log(domainName);
    Array.from(document.querySelectorAll('h4')).filter(h4=> h4.textContent=='Subdomains')[0].nextElementSibling.querySelectorAll('ul li').forEach(sub=> {
         let s = sub.innerText.trim();
         let pattern = new RegExp("\\b" + domainName + "\\b");
         if(pattern.test(s)) subs+=s + "\n";
         else subs+=s+'.'+domainName + "\n";
    })

    const blob = new Blob([subs], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = document.title.replaceAll(" ",'-').replaceAll("|","-")+".txt";
    link.click();
    URL.revokeObjectURL(url);
}
