chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // GitHubのissue,PR
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'github.com',
              schemes: ['https'],
              urlMatches: '/(.+)/(.+)/issues|pull/(\\d+)'
            },
            css: ['span.js-issue-title', 'span.gh-header-number']
          }),
          // Jiraのチケットを選択時
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostSuffix: '.atlassian.net',
              schemes: ['https'],
              urlMatches: '(/.+(selectedIssue)|/browse)'
            }
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
