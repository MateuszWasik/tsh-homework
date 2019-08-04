const githubPrefix = "https://github.com/";

export const realHistoryTemplatePullRequest  = function (userData) {
  let date = new Date(userData.created_at).toISOString().slice(0,10);
  return `
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <p class="heading">${date}</p>
            <div class="content">
              <div class="user-avatar-container">
                <img src=${userData.actor.avatar_url} class="user-avatar"/>
              </div>
              <div class="user-container">
                  <span class="gh-username">
                     <a href=${githubPrefix}${userData.actor.login}>${userData.actor.login}</a>
                  </span>
                ${userData.payload.action}
                <a href=${userData.payload.pull_request.html_url}>pull request</a>
              </div>
            </div>
            <p class="repository-name">
              <a href=${githubPrefix}${userData.repo.name}>${userData.repo.name}</a>
            </p>
          </div>
        </div>`
};


export const realHistoryTemplateComment = function (userData) {
  let date = new Date(userData.created_at).toISOString().slice(0,10);
  return `
   <div class="timeline-item is-primary">
          <div class="timeline-marker is-primary"></div>
          <div class="timeline-content">
            <p class="heading">${date}</p>
            <div class="content">
              <div class="user-avatar-container">
                <img src=${userData.actor.avatar_url} class="user-avatar" />
              </div>
              <div class="user-container">
                  <span class="gh-username">
                    <a href=${githubPrefix}${userData.actor.login}>${userData.actor.login}</a>
                  </span>
                ${userData.payload.action}
                <a href=${userData.payload.comment.html_url}>comment</a>
                to
                <a href=${userData.payload.comment.url}>pull request</a>
              </div>
            </div>
            <p class="repository-name">
              <a href=${userData.repo.url}>${userData.repo.name}</a>
            </p>
          </div>
        </div>
  `
};

