/* Cookie consent + gated Google Analytics loader.
 *
 * Nothing is stored on the visitor's device and no banner is shown until a real
 * GA4 measurement ID is configured below — so the site stays cookie-free (and
 * banner-free) until analytics is actually switched on.
 *
 * When GA_ID is set: gtag.js is loaded ONLY after an explicit opt-in. Rejecting
 * is exactly as easy as accepting, and the choice can be changed later via the
 * "Cookie settings" link in the footer.
 */
(function () {
  'use strict';

  // ── Configure here: paste your GA4 measurement ID (e.g. "G-AB12CD34EF") ──
  var GA_ID = 'G-7GZLLM3R5X';

  var STORE_KEY = 'devproof:analytics-consent'; // holds only "granted" / "denied"
  // Pages in docs/ load this script as ../assets/consent.js — read the RAW
  // attribute (element.src would already be resolved to an absolute URL) so
  // links in the banner point at the site root from any depth.
  var self = document.currentScript || document.querySelector('script[src$="consent.js"]');
  var raw = self ? self.getAttribute('src') || '' : '';
  var BASE = raw.indexOf('../') === 0 ? '../' : '';

  var enabled = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  if (!enabled) return; // analytics not configured → no cookies, no banner

  function read() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* private mode */ }
  }

  var gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  var banner = null;
  function buildBanner() {
    var el = document.createElement('div');
    el.className = 'consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie settings');
    el.innerHTML =
      '<div class="consent-inner">' +
        '<p class="consent-text">This site uses cookies for <b>web analytics</b> only, and only ' +
        'if you agree. Everything else works without them. See the ' +
        '<a href="' + BASE + 'privacy.html">privacy policy</a>.</p>' +
        '<div class="consent-actions">' +
          '<button type="button" class="btn ghost" data-consent="denied">Reject</button>' +
          '<button type="button" class="btn" data-consent="granted">Accept</button>' +
        '</div>' +
      '</div>';
    el.addEventListener('click', function (ev) {
      var choice = ev.target.getAttribute && ev.target.getAttribute('data-consent');
      if (!choice) return;
      write(choice);
      if (choice === 'granted') loadAnalytics();
      hide();
    });
    return el;
  }

  function show() {
    if (!banner) { banner = buildBanner(); document.body.appendChild(banner); }
    banner.classList.add('open');
    var btn = banner.querySelector('[data-consent="granted"]');
    if (btn) btn.focus();
  }
  function hide() {
    if (banner) banner.classList.remove('open');
  }

  // Control on the privacy page so consent can be withdrawn or given later.
  // It stays hidden unless analytics is configured (this file returns early
  // otherwise), so the page never offers a setting that does nothing.
  function enableSettingsButton() {
    var btns = document.querySelectorAll('[data-consent-open]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].hidden = false;
      btns[i].addEventListener('click', function (e) { e.preventDefault(); show(); });
    }
  }

  function init() {
    enableSettingsButton();
    var stored = read();
    if (stored === 'granted') loadAnalytics();
    else if (stored !== 'denied') show(); // undecided → ask
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
