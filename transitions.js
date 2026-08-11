(function () {
  window.addEventListener('pageshow', function () {
    document.body.classList.remove('page-leaving');
    document.body.classList.add('page-loaded');
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.target === '_blank') {
      return;
    }

    e.preventDefault();
    document.body.classList.remove('page-loaded');
    document.body.classList.add('page-leaving');
    setTimeout(function () {
      window.location.href = href;
    }, 380);
  });
})();
