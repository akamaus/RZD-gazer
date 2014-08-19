// ==UserScript==
// @name        RZD-gazer
// @namespace   http://vyal.ru/rzd-gazer
// @description Отслеживает появление билетов на RZD
// @include     http://pass.rzd.ru/timetable/*
// @include     http://ticket.rzd.ru/pass/public/logon
// @version     1.2
// ==/UserScript==

$(document).ready(function() {
  console.log("RZD-gazer is active");

  setTimeout(make_test, 10000);

  function make_test() {
    test_login("input.stdButton");
    test_login("table.LogonTableForm", "input#other");
    test_login("button[value='Вход']");

    if ($('div.errorMessageDiv').length >= 1) {
        issue_reload();
    }

    var section = $.trim($('div#order_ticket_path div.current').text());
    console.log("section = " + section);

    switch(section) {
    case 'Выборпоезда':
        test_train(2200);
        break;
    case 'Выборвагона':
        test_wagon();
        break;
    default:
        console.log('WARNING: unknown screen, do nothing');
    }
  }

  function test_train(max_price = null) {
    var target_trains = ["№ 7040","№ 7040Х", "№ 7042","№ 7042Х"];

    var train_found = false;

    console.log("Hello");
    $(".trlist__trlist-row").each(function() {
      var train = $("div.train-num-1", this).text();
      if (train=="") {
          train = $("div.train-num-0", this).text();
      }
      if (train=="") return;

      if ($.inArray(train, target_trains) > -1) {
          console.log("train " + train + " detected");
          if ( $("table.trlist__table-price", this).length > 0) {
              console.log("tickets for train " + train + " available");
              if (max_price) {
                  $("table.trlist__table-price td.trlist__table-price__price span", this).each(function() {
                      price = parseInt($(this).text().split(' ')[0]);
                      console.log('found price' + price);
                      if (price < max_price) {
                          train_found = true;
                      }
                  });
              } else {
                  train_found = true;
              }
          }
      }
    });

    if(train_found)
        issue_alarm();
    else issue_reload();
  }

  function test_wagon() {
    var target_wagons = [ "06", "07", "08"];
    var wagon_found = false;

    $('table.pass_cars_table label:has(input)').each(function() {
      var wagon = $.trim($(this).text());
      var pos = $.inArray(wagon, target_wagons);
      if ( pos > -1) {
          console.log("Tickets for wagon " + target_wagons[pos] + " available");
          wagon_found = true;
      }
    });
    if (wagon_found)
        issue_alarm();
    else issue_reload();
  }

  function test_login(test, button) {
    if ($(test).length) {
        console.log('logging in');
        button = button || test;
        $(button).click();
    }
  }

  function issue_alarm() {
    console.log("issuing alarm");
    setInterval(do_alarm, 10000);
  }

  function do_alarm() {
    var snd = new Audio("http://www.lunerouge.org/sons/engins/LRObject%20falling%2001%20by%20Lionel%20Allorge.ogg");
    snd.play();
  };

  function issue_reload() {
    console.log("issuing reload");
    setTimeout(function() { window.location.reload(); }, 10000);
  }
});