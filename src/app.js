import './assets/scss/app.scss';
import $ from 'cash-dom';
import {fetchUserDetails, fetchUserRealHistory} from "./services/user-real-history-service";
import {realHistoryTemplatePullRequest, realHistoryTemplateComment} from "./templates/user-real-history";
require('es6-promise').polyfill();

const regexExpression = '^[!a-zA-Z0-9_-]+$';
const usernameInputElement = document.getElementById('username-input');
const spinnerElement = document.getElementById('spinner');
const profileContainerElement = document.getElementById('profile-container');
const fakeHistoryElement = document.getElementById('fakeHistory');
const realHistoryElement = document.getElementById('realHistory');
const selectorTemplateContainer = $('#template-container');

export class App {

  initializeApp() {
    let self = this;
    self.regex = new RegExp(regexExpression);
    self.isValidationCorrect = false;

    self.hideRealHistoryContainer();

    $('.load-username').on('click', function () {
      let userName = $('.username.input').val();

      self.validationChecker(userName);

      if (self.isValidationCorrect) {
        self.hideOrShowProfileAndHistoryContainers(true);
        self.clearRealHistoryTemplateContainer();

        fetchUserDetails(userName)
          .then((body) => {
            self.profile = body;
            self.updateProfile();

            fetchUserRealHistory(userName)
              .then(body =>
                body.filter(body => body.type === 'PullRequestEvent' || body.type === "PullRequestReviewCommentEvent"))
              .then(eventArray => {
                eventArray.map(singleEvent => {
                  self.generateProperTemplate(singleEvent)
                });
              })
              .then(() =>
                self.hideOrShowProfileAndHistoryContainers(false))
              .catch(error => {
                console.error(error);
              })
          })
          .catch(error => {
            console.error(error);
          })
          .finally(() =>
            spinnerElement.classList.remove('is-hidden')
          )
      }
    })
  };

  updateProfile() {
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
      usernameInputElement.classList.remove("validation-error");
      this.isValidationCorrect = true;
    } else {
      usernameInputElement.classList.add("validation-error");
      this.isValidationCorrect = false;
    }
  }

  generateProperTemplate(singleEvent) {
    switch (singleEvent.type) {
      case 'PullRequestEvent':
        selectorTemplateContainer.append(realHistoryTemplatePullRequest(singleEvent));
        break;
      case 'PullRequestReviewCommentEvent':
        selectorTemplateContainer.append(realHistoryTemplateComment(singleEvent));
    }
  }

  clearRealHistoryTemplateContainer() {
    selectorTemplateContainer.empty();
  }

  hideRealHistoryContainer() {
    realHistoryElement.classList.add('is-hidden');
  }

  hideOrShowProfileAndHistoryContainers(hide) {
    if (hide) {
      spinnerElement.classList.remove('is-hidden');
      profileContainerElement.classList.add('is-hidden');
      fakeHistoryElement.classList.add('is-hidden');
      realHistoryElement.classList.add('is-hidden');
    } else {
      spinnerElement.classList.add('is-hidden');
      profileContainerElement.classList.remove('is-hidden');
      realHistoryElement.classList.remove('is-hidden');

    }
  }
}
