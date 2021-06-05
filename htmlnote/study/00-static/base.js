
"use strict"
// var-普通 let-不可重复定义 const-不可修改

window.onload = function () {
    var anchors = getDoms(".anchor");
    if (!anchors || anchors.length == 0) return;
    var menu = '<ul class="anchor-ul">';
    for (let i = 0; i < anchors.length; i++) {
        menu += '<li onclick="goto(' + i + ')">' + anchors[i].innerText + '</li>';
    }
    getDom("body").innerHTML += menu + '</ul>';
}

function getDom(selector) {
    return document.querySelector(selector);
}
function getDoms(selector) {
    return document.querySelectorAll(selector);
}
//跳转至页面位置
function goto(idx) {
    /**
     {
        // auto-使用当前元素的scroll-behavior样式 instant-直接滚到底 smooth-平滑滚动
        behavior: "auto" | "instant" | "smooth",
        block: "start" | "center" | "end" | "nearest", // 默认 center
        inline: "start" | "center" | "end" | "nearest", // 默认 nearest
     }
     */
    getDoms(".anchor")[idx].scrollIntoView({behavior: "smooth"});
}