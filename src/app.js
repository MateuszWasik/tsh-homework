import './assets/scss/app.scss';
import $ from 'cash-dom';
import {fetchUserDetails, fetchUserRealHistory} from "./services/user-real-history-service";
import {realHistoryTemplatePullRequest, realHistoryTemplateComment} from "./templates/user-real-history";
require('es6-promise').polyfill();

const regexExpression = '^[!a-zA-Z0-9_-]+$';

export class App {

  initializeApp() {
    let self = this;
    self.regex = new RegExp(regexExpression);
    self.usernameInputElement = document.getElementById('username-input');
    self.isValidationCorrect = false;

    $('.load-username').on('click', function () {
      let userName = $('.username.input').val();

      self.validationChecker(userName);

      if (self.isValidationCorrect) {
        self.clearTemplateContainer();

        fetchUserDetails(userName)
          .then((body) => {
            self.profile = body;
            self.update_profile();

            fetchUserRealHistory(userName)
              .then(body =>
                body.filter(body => body.type === 'PullRequestEvent' || body.type === "PullRequestReviewCommentEvent"))
              .then(eventArray => {
                eventArray.map(singleEvent => {
                  self.generateProperTemplate(singleEvent)
                })
              })
              .catch(error => {
                console.error(error)
              })
          })
          .catch(error => {
            console.error(error)
          })
      }
    })
  };

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

  generateProperTemplate(singleEvent) {
    const selectorTemplateContainer = $('#template-container');

    switch (singleEvent.type) {
      case 'PullRequestEvent':
        selectorTemplateContainer.append(realHistoryTemplatePullRequest(singleEvent));
        break;
      case 'PullRequestReviewCommentEvent':
        selectorTemplateContainer.append(realHistoryTemplateComment(singleEvent));
    }
  }

  clearTemplateContainer() {
    $('#template-container').empty();
  }
}
