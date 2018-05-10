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
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    textarea.value = text;

    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('Copy');

    document.body.removeChild(textarea);
  }

  function getFormattedTicketLink(format) {
    var url = window.location.href;
    let title = '';

    if (isGithubUrl(url)) {
      title = getTitleForGithub();
    } else if (isJiraUrl(url)) {
      if (/\/browse\//.test(url)) {
        // チケット固有URLの場合
        title = getTitleForJiraBrowse();
      } else {
        // スクラムボードの場合
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
    const title = document.querySelector(`${h1} .js-issue-title`).innerText.trim();
    const num = document.querySelector(`${h1} .gh-header-number`).innerText;

    return `${num}｜${title}`;
  }

  function getTitleForJiraBrowse() {
    const title = document.querySelector('h1.hYXQEK').innerText.trim();
    const num = document.querySelector('a.ihyVSq').innerText;

    return `${num}｜${title}`;
  }

  function getTitleForJiraBoard() {
    const selected = '.ghx-selected';
    const title = document.querySelector(`${selected} .ghx-summary`).innerText.trim();
    const numDom = document.querySelector(`${selected} a.ghx-key`);
    const num = numDom.getAttribute('aria-label') || numDom.getAttribute('title');

    return `${num}｜${title}`;
  }

  function getUrlForJiraBoard() {
    const href = document.querySelector('.ghx-selected a.ghx-key').getAttribute('href');
    return `https://${window.location.host}${href}`;
  }

  function isGithubUrl(url) {
    return /^https:\/\/github\.com/.test(url);
  }

  function isJiraUrl(url) {
    return /^https:\/\/.+\.atlassian\.net/.test(url);
  }
})();
