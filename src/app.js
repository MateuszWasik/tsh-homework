import './assets/scss/app.scss';
import $ from 'cash-dom';
import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();

const regexExpression = '^[!a-zA-Z0-9_-]+$';

export class App {

  initializeApp() {
    let self = this;
    self.regex = new RegExp(regexExpression);
    self.usernameInputElement =  document.getElementById('username-input');
    self.isValidationCorrect = false;

    $('.load-username').on('click', function (e) {
      let userName = $('.username.input').val();

      self.validationChecker(userName);

      if (self.isValidationCorrect) {
        fetch('https://api.github.com/users/' + userName)
          .then(response => response.json())
          .then((body) => {
            self.profile = body;
            self.update_profile();
          })
      }
    });
  }

  update_profile() {
    $('#profile-name').text($('.username.input').val());
    $('#profile-image').attr('src', this.profile.avatar_url);
    $('#profile-url').attr('href', this.profile.html_url).text(this.profile.login);
    $('#profile-bio').text(this.profile.bio || '(no information)');
  }

  validationChecker(value) {
      value.match(this.regex)
        ? this.validationChanger(true)
        : this.validationChanger(false);
  }

  validationChanger(correctValidation) {
    if (correctValidation) {
      this.usernameInputElement.classList.remove("validation-error");
      this.isValidationCorrect = true;
    } else {
      this.usernameInputElement.classList.add("validation-error");
      this.isValidationCorrect = false;
    }
  }
}
