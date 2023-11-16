// ==UserScript==
// @name         c99
// @namespace    https://github.com/atxiii
// @version      0.1
// @description  try to take over the world!
// @author       CatFather
// @match        https://subdomainfinder.c99.nl/scans/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=c99.nl
// @grant        none
// ==/UserScript==


(function() {

    'use strict';
    const btn = document.createElement('a');
    btn.href="javascript:;"
    btn.onclick = mrcatdev_extract_subs_abuse_ip;
    btn.textContent = 'Download'
    btn.data='sub';
    btn.className='btn btn-sm btn-primary mb-4'
    document.querySelector('.well').prepend(btn);

    // get IPS
    const btni = document.createElement('a');
    btni.href="javascript:;"
    btni.onclick = mrcatdev_extract_subs_abuse_ip;
    btni.textContent = 'Download IPs'
    btni.className='btn btn-sm btn-primary mb-4'
    btni.data='ip';
    Array.from(document.querySelectorAll('th')).filter(t=> t.textContent=='IP')[0].closest('tbody').prepend(btni);

})();

function mrcatdev_extract_subs_abuse_ip(){
    let subs='';

    if(this.data=='sub'){
        subs='';
        document.querySelectorAll('.link[rel]').forEach(sub=> {
            subs+= sub.textContent + "\n";
        });
    }else{
        subs='';
        Array.from(document.querySelectorAll('th')).filter(t=> t.textContent=='IP')[0].closest('tbody').querySelectorAll('tr a').forEach(sub=> {
            subs+= sub.textContent + "\n";
        });
    }

    const blob = new Blob([subs], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = document.title.replaceAll(" ",'-').replaceAll("|","-")+".txt";
    link.click();
    URL.revokeObjectURL(url);
}
