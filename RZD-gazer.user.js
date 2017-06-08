// ==UserScript==
// @name        RZD-gazer
// @namespace   http://vyal.ru/rzd-gazer
// @description Отслеживает появление билетов на RZD
// @include     https://pass.rzd.ru/tickets/public/*
// @version     1.2
// @grant       none
// ==/UserScript==

console.log('hello gazer');

function issue_alarm() {
  console.log("issuing alarm");
  setInterval(do_alarm, 10000);
  do_alarm();

  var note_pars = {
    text:       'Seat available',
    title:      'Hurry up!',
    timeout:    600000,
    onclick:    function () {
      console.log ("Notice clicked.");
      window.focus ();
    }
  };
  GM_notification(note_pars);

  var note = new Notification("Seat available");
}

function do_alarm() {
  var snd = new Audio("http://www.lunerouge.org/sons/engins/LRObject%20falling%2001%20by%20Lionel%20Allorge.ogg");
  snd.play();
  console.log("beep!");
};

function issue_reload() {
  console.log("issuing reload");
  setTimeout(function() { window.location.reload(); }, 120 * 1000);
}

$(document).ready(function() {
  console.log("RZD-gazer is active");

  if (Notification.permission === 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        console.log("will use notes");
      }
    });
  }

  function test_train(max_price = null) {
    var target_trains = ["7044","7098"]; //["7044","7098", "7042","№ 7042Х"];
    var forbidden_trains = ["№ 030Ч", "№ 064Б", "№ 096Б" ];

    var train_found = false;

    console.log("Hello");
    $("div.j-train").each(function() {
      var train = $("div.train-info__train_number", this).html().trim().split(/\s+/)[0];

      if ((target_trains.length == 0 || $.inArray(train, target_trains) > -1)
        && $.inArray(train, forbidden_trains) == -1) {

        console.log('checking train: ' + train);

        $("div.car-type__cost", this).each(function() {
          var cost = parseInt($(this).text().split(/\s+/)[2]);
          console.log('cost=' + cost);
          if (!max_price || cost < max_price) {
            train_found = true;
          }
        })

//      if (train=="") return;
      //         if (max_price) {
      //             $("table.trlist__table-price td.trlist__table-price__price span", this).each(function() {
      //                 price = parseInt($(this).text().split(' ')[0]);
      //                 console.log('found price' + price);
      //                 if (price < max_price) {
      //                     train_found = true;
      //                 }
      //             });
      //         } else {
      //             train_found = true;
      //         }
      //     }
      // }
      }
    });

    if (train_found) {
      console.log("seat found!");
      issue_alarm()
    } else {
      issue_reload();
    }
  }

  test_train(3000);
})


shim_GM_notification ()

/*--- Cross-browser Shim code follows:
*/
function shim_GM_notification () {
    if (typeof GM_notification === "function") {
        return;
    }
    window.GM_notification = function (ntcOptions) {
        checkPermission ();

        function checkPermission () {
            if (Notification.permission === "granted") {
                fireNotice ();
            }
            else if (Notification.permission === "denied") {
                alert ("User has denied notifications for this page/site!");
                return;
            }
            else {
                Notification.requestPermission ( function (permission) {
                    console.log ("New permission: ", permission);
                    checkPermission ();
                } );
            }
        }

        function fireNotice () {
            if ( ! ntcOptions.title) {
                console.log ("Title is required for notification");
                return;
            }
            if (ntcOptions.text  &&  ! ntcOptions.body) {
                ntcOptions.body = ntcOptions.text;
            }
            var ntfctn  = new Notification (ntcOptions.title, ntcOptions);

            if (ntcOptions.onclick) {
                ntfctn.onclick = ntcOptions.onclick;
            }
            if (ntcOptions.timeout) {
                setTimeout ( function() {
                    ntfctn.close ();
                }, ntcOptions.timeout);
            }
        }
    }
}
