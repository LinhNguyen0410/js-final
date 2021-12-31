import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#01579b',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  },

  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      close: true,
      style: {
        background: '#2e7d32',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  },

  error(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      close: true, // show icon x
      style: {
        background: '#d32f2f',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  },
};
