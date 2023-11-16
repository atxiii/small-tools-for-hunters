// ==UserScript==
// @name         find hidden input
// @namespace    https://github.com/atxiii
// @version      0.1
// @description  Shows hidden input and reflected params in DOM
// @author       You
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=infosecwriteups.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let color = '#0791f5'




    // Your code here...
    const mrcatdevBtn=document.createElement('button');
    mrcatdevBtn.setAttribute('style',`position:fixed;top:0;left:0;z-index:999;background:${color};border:none`);
    mrcatdevBtn.textContent='👁';
    let status=true;
    mrcatdevBtn.addEventListener('click', ()=>{
        if(status){
            status = false;
            console.log('faal');
            document.querySelectorAll('[type="hidden"]').forEach(item=> {item.type='mrcatdevType';item.style.backgroundColor='red'});
        } else {
            status = true;
            console.log('deactive');
            document.querySelectorAll('[type="mrcatdevType"]').forEach(item=> {item.type='hidden';});
        }
    });
    if(document.querySelector('[type="hidden"]')) document.body.append(mrcatdevBtn);

    const urlParams = new URLSearchParams(window.location.search);
    let k = 0;
    const title = document.head.querySelector('title');

    urlParams.forEach((value, key) => {
        const body = document.body.innerHTML;
        if (body.includes(value)) {
            k++;
            console.log(`The value "${value}" of parameter "${key}" is reflected in the body.`);
            color = '#20e820';
        }
    });

    if (k > 0) {
        document.head.querySelector('title').innerText = `👁 [${k}] ${title.innerText}`;
    }


})();

