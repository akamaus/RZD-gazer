// ==UserScript==
// @name        RZD-gazer
// @namespace   http://vyal.ru/rzd-gazer
// @description Отслеживает появление билетов на RZD
// @include     https://ticket.rzd.ru/pass/secure/*
// @include     http://ticket.rzd.ru/pass/secure/*
// @version     1.2
// ==/UserScript==

$(document).ready(function() {
  
  setTimeout(make_test, 10000);
  
  function make_test() {
    console.log("len " + $('div.errorMessageDiv').length);
    if (($("div.dateNavig").length == 0) || ($('div.errorMessageDiv').length >= 1)) {
      console.log("issuing reload");
      setTimeout(function() {
	window.location.reload();
      }, 10000);
    } else {
      console.log("issuing alarm");
      setInterval(alarm, 10000);
    }
  }

  function alarm() {
    var snd = new Audio("http://www.lunerouge.org/sons/engins/LRObject%20falling%2001%20by%20Lionel%20Allorge.ogg");
    snd.play();
  };

});