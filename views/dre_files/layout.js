(function () {
    'use strict';

    var dataElement = document.getElementById('page-config-data');
    var pageConfig = dataElement ? JSON.parse(dataElement.innerHTML).pageconfig : {};
    var ledeMediaSize = pageConfig.ledeMediaSize;

    var pageLayout = Math.random() < 0.7 ? 'a' : 'b';
    var html = document.getElementsByTagName('html')[0];
    var articleToneTag = document.getElementById('article-tone');
    var articleTone = articleToneTag ? articleToneTag.getAttribute('content') : '';

    html.className += ' has-top-ad';

    if (ledeMediaSize === 'none' || ledeMediaSize === 'small') {
        pageLayout = 'a';
    }

    if (ledeMediaSize === 'jumbo') {
        pageLayout = 'b';
    }

    if (articleTone === 'informal') { // always show page layout "a" if an article's tone has been marked "informal"
        pageLayout = 'a';
    }

    if (ledeMediaSize === 'none' || ledeMediaSize === 'small' || (ledeMediaSize === 'large' && pageLayout === 'a')) {
        html.className += ' has-big-ad';
    }

    html.setAttribute('data-page-layout', pageLayout);
    html.setAttribute('data-lede-media-size', ledeMediaSize);
    html.setAttribute('data-keywords', pageConfig.keywords);
})();
