/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
  // Bacon cloner
  var baconImage = document.querySelector('.o-bacon-cloner__image');
  var baconCloner = document.querySelector('.o-bacon-cloner__btn');

  if (baconCloner) {
    baconCloner.addEventListener('click', function() {
      baconImage.parentNode.appendChild(baconImage.cloneNode(true));
    });
  }

  // Form validation
  var form = document.querySelector('.l-checkout__form');
  var validationMessage = document.querySelector('#validationMessage');
  var sucessMessage = 'Everything is OK!';
  var testedFields = {
    'expirationDate': /^((0[1-9])|(1[0-2]))[\/\.\-]*((0[8-9])|(1[1-9]))$/,
    'securityCode': /^[0-9]{3}$/,
    'creditCard': /^[0-9]{3}\-?[0-9]{3}\-?[0-9]{3}\-?[0-9]{3}$/,
    'email': /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    'lastName': /^[a-z ,.'-]+$/i,
    'firstName': /^[a-z ,.'-]+$/i,
  };
  var testedFieldsKeys = [];
  for (var key in testedFields) {      
      if (testedFields.hasOwnProperty(key)) {
        testedFieldsKeys.push(key);
      }
  }

  function capitalizeName(camelCaseName) {
    var spaced = camelCaseName.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  function setError(field, validationMessage) {
    validationMessage.classList.add('error');
    field.classList.add('error');
    field.focus();
  }

  function validateFields() {
    var data = {
      message: sucessMessage
    };
    var fields = document.forms.checkoutForm;
    
    validationMessage.classList.remove('error');
    for (var i = 0; i < testedFieldsKeys.length; i++) {
      var element = fields[testedFieldsKeys[i]];
      var regExp = testedFields[testedFieldsKeys[i]];

      if (element.value.length === 0) {
        data.message = capitalizeName(element.id) + ' is empty!';
        setError(element, validationMessage);
      } else if (regExp && !regExp.test(element.value)) {
        data.message = capitalizeName(element.id) + ' has wrong format! Hint: ' + element.placeholder;
        setError(element, validationMessage);
      } else {
        element.classList.remove('error');
      }
    }

    validationMessage.MaterialSnackbar.showSnackbar(data);
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    validateFields();
  });
})();
