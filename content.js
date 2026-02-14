function getStatusPath(article) {
  // Find the timestamp link which contains /{username}/status/{id}
  const timeLink = article.querySelector('a[href*="/status/"] time');
  if (!timeLink) return null;
  const anchor = timeLink.closest('a');
  if (!anchor) return null;
  const href = anchor.getAttribute('href');
  // Match /{username}/status/{id} pattern
  const match = href.match(/^\/[^/]+\/status\/\d+$/);
  return match ? href : null;
}

function createQuotesButton(statusPath) {
  const wrapper = document.createElement('div');
  wrapper.className = 'css-175oi2r r-18u37iz r-1h0z5md r-13awgt0';
  wrapper.setAttribute('data-quotes-btn', 'true');

  const btn = document.createElement('button');
  btn.className = 'quotes-btn';
  btn.title = 'View Quotes';
  btn.type = 'button';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g><path d="M14.23 2.854c.98-.977 2.56-.977 3.54 0l3.38 3.378c.97.977.97 2.559 0 3.536L9.91 21H3v-6.91L14.23 2.854zm2.12 1.414c-.2-.195-.51-.195-.71 0L4.5 15.41V19.5h4.09L19.73 8.358c.2-.195.2-.512 0-.707l-3.38-3.383zM14.5 10.5L13 9l-7 7v1.5H7.5l7-7z"></path></g>
    </svg>
    <span>Quotes</span>
  `;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `https://x.com${statusPath}/quotes`;
  });

  wrapper.appendChild(btn);
  return wrapper;
}

function addQuotesButtons() {
  const articles = document.querySelectorAll('article[data-testid="tweet"]');
  articles.forEach((article) => {
    // Skip if already processed
    if (article.querySelector('[data-quotes-btn]')) return;

    const statusPath = getStatusPath(article);
    if (!statusPath) return;

    const actionBar = article.querySelector('div[role="group"]');
    if (!actionBar) return;

    // Insert the quotes button before the bookmark button
    const bookmarkBtn = actionBar.querySelector('button[data-testid="bookmark"]');
    if (bookmarkBtn) {
      const bookmarkWrapper = bookmarkBtn.closest('.css-175oi2r.r-18u37iz.r-1h0z5md');
      if (bookmarkWrapper) {
        bookmarkWrapper.parentNode.insertBefore(
          createQuotesButton(statusPath),
          bookmarkWrapper
        );
        return;
      }
    }

    // Fallback: append to end of action bar
    actionBar.appendChild(createQuotesButton(statusPath));
  });
}

// Run on page load and observe DOM changes for infinite scroll
addQuotesButtons();

const observer = new MutationObserver(() => {
  addQuotesButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
