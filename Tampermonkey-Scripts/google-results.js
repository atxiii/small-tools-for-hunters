// ==UserScript==
// @name         Read More
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Save all google search result to a text file
// @author       Hossein Shourabi
// @match        https://www.google.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==
var k=0;
let mm;
(function() {
    'use strict';
    const btn = document.createElement('a');
    btn.href="javascript:;"
    btn.onclick = mrcatdev_lg;
    btn.textContent = 'DL'
    document.querySelector('.logo').append(btn);
})();

function mrcatdev_lg(){
   if(!mm) mm =setInterval(mrcatdev_more_res,4000);
}

function mrcatdev_more_res(){
  k++;
  let m = document.querySelector('h3>div>span:nth-child(2)');
  let c = document.querySelector('.card-section a');
  if(c) {
      clearInterval(mm);
      mrcatdev_google_dl_links()
  }
  if(m) {
      window.scrollTo(0, document.body.scrollHeight);
      m.click();
  }
}


function mrcatdev_google_dl_links(){
    let l=''
    document.querySelectorAll('#center_col span[jscontroller] a[jsname]').forEach((i,k)=> l += i.href+"\n")
    const blob = new Blob([l], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = document.title.replaceAll(" ",'-').replaceAll("|","-")+".txt";
    link.click();
    URL.revokeObjectURL(url);
}