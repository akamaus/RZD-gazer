// ==UserScript==
// @name        RZD-gazer
// @namespace   http://vyal.ru/rzd-gazer
// @description Отслеживает появление билетов на RZD
// @include     https://ticket.rzd.ru/pass/secure/*
// @include     http://ticket.rzd.ru/pass/secure/*
// @include     http://ticket.rzd.ru/pass/public/logon
// @version     1.2
// ==/UserScript==

$(document).ready(function() {

  setTimeout(make_test, 10000);

  function make_test() {
    if ($('input.stdButton').length) { // логинимся (1ый вариант экрана
      console.log('logging in');
      $('input.stdButton').click();
      return;
    }

    if ($('table.LogonTableForm').length) { // логинимся (2ой вариант экрана)
      console.log('logging in');
      $('input#other').click();
    }

    console.log("len " + $('div.errorMessageDiv').length);
    if (!detect_presense() || ($('div.errorMessageDiv').length >= 1)) {
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

  function detect_presense() {
      var target_trains = ["№ 7044"];

      var issue_alarm = false;

      console.log("Hello");
      $(".trlist__trlist-row").each(function() {
          var train = $("div.train-num-1", this).text();
          if (train=="") {
              train = $("div.train-num-0", this).text();
          }
          if (train=="") return;

//          console.log(train);

          if ($.inArray(train, target_trains) > -1) {
              console.log("train " + train + " detected");
              if ( $("table.trlist__table-price", this).length > 0) {
                  console.log("tickets for train " + train + " available");
                  issue_alarm = true;
              }
          }
      });
      return issue_alarm;
  }

});