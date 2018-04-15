(function() {
  if (window.isAlreadyPrepared) return;
  window.isAlreadyPrepared = true;
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!!request.format) {
      copy(request.format);
    }
  });

  function copy(format) {
    return execCopy(getFormattedTicketLink(format));
  }

  function execCopy(text) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;

    document.body.appendChild(input);

    input.select();
    document.execCommand('Copy');

    document.body.removeChild(input);
  }

  function getFormattedTicketLink(format) {
    var url = window.location.href;
    let title = '';

    if (isGithubUrl(url)) {
      title = getTitleForGithub();
    } else if (isJiraUrl(url)) {
      if (/\/browse\//.test(url)) {
        // チケット固有URLの場合
        console.log(2);
        title = getTitleForJiraBrowse();
      } else {
        // スクラムボードの場合
        console.log(1);
        title = getTitleForJiraBoard();
        url = getUrlForJiraBoard();
      }
    }

    switch (format) {
      case 'markdown':
        return `[${title}](${url})`;
        break;
      case 'jira':
        return `[${title}|${url}]`;
        break;
      case 'plain':
        return `${title}\n${url}`;
        break;
    }
    return '';
  }

  function getTitleForGithub() {
    const h1 = 'h1.gh-header-title';
    const title = document.querySelectorAll(`${h1} .js-issue-title`)[0].innerText.trim();
    const num = document.querySelectorAll(`${h1} .gh-header-number`)[0].innerText;

    return `${num}｜${title}`;
  }

  function getTitleForJiraBrowse() {
    const title = document.querySelectorAll('h1.hYXQEK')[0].innerText.trim();
    const num = document.querySelectorAll('a.ihyVSq')[0].innerText;

    return `${num}｜${title}`;
  }

  function getTitleForJiraBoard() {
    const selected = '.ghx-selected';
    const title = document.querySelectorAll(`${selected} .ghx-summary`)[0].innerText.trim();
    const num = document.querySelectorAll(`${selected} a.ghx-key`)[0].getAttribute('aria-label');

    return `${num}｜${title}`;
  }

  function getUrlForJiraBoard() {
    const href = document.querySelectorAll('.ghx-selected a.ghx-key')[0].getAttribute('href');
    return `https://${window.location.host}${href}`;
  }

  function isGithubUrl(url) {
    return /^https:\/\/github\.com/.test(url);
  }

  function isJiraUrl(url) {
    return /^https:\/\/.+\.atlassian\.net/.test(url);
  }
})();
