(() => {
  'use strict';

  /*
   * TEMPORARY BUSINESS CONFIGURATION
   * Replace the values marked TODO when James Hand Carwash confirms them.
   * The existing phone, address and Google Maps link came from the original site.
   */
  const BUSINESS_CONFIG = Object.freeze({
    phone: '+447732384211',
    phoneDisplay: '+44 7732 384211',
    directionsUrl: 'https://share.google/yLYQ1P7lqTCCYRFbb',

    // TODO: Replace this placeholder with the real GA4 Measurement ID (format: G-XXXXXXXXXX).
    // Analytics stays completely disabled while this placeholder remains in place.
    googleAnalyticsId: 'G-XXXXXXXXXX',

    // TODO: Replace WHATSAPP_NUMBER with the confirmed James Hand Carwash number.
    // 07700 900000 is in Ofcom's reserved fictional mobile range and is not a real customer number.
    whatsappNumber: '447700900000',
    whatsappMessage: "Hi James Hand Carwash, I'd like to ask about getting my car cleaned.",

    // TODO: Confirm the current Google rating and review count.
    googleRating: '4.9',
    googleReviewCount: '42',

    // TODO: Confirm whether booking is required. Set true to remove the drive-in message.
    bookingRequired: false,

    // TODO: Confirm payment methods.
    paymentMethods: [
      { name: 'Cash', icon: '£' },
      { name: 'Card', icon: '▭' },
      { name: 'Contactless', icon: ')))' }
    ],

    // TODO: CONFIRM OPENING HOURS. Times use 24-hour HH:MM format in Europe/London.
    openingHours: {
      Monday: { open: '08:30', close: '17:30' },
      Tuesday: { open: '08:30', close: '17:30' },
      Wednesday: { open: '08:30', close: '17:30' },
      Thursday: { open: '08:30', close: '17:30' },
      Friday: { open: '08:30', close: '17:30' },
      Saturday: { open: '08:30', close: '17:30' },
      Sunday: { open: '09:00', close: '17:00' }
    },

    // TODO: Replace all temporary prices with the confirmed price list.
    prices: {
      small: { exterior: '£10', insideOut: '£22', valet: '£65' },
      medium: { exterior: '£12', insideOut: '£25', valet: '£75' },
      large: { exterior: '£15', insideOut: '£30', valet: '£90' },
      van: { exterior: '£18', insideOut: '£38', valet: '£110' }
    }
  });

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const COOKIE_CONSENT_KEY = 'james_cookie_consent_v1';

  const getNestedValue = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
  };
  const formatTime = (time) => {
    const [rawHour, minutes] = time.split(':').map(Number);
    const suffix = rawHour >= 12 ? 'PM' : 'AM';
    const hour = rawHour % 12 || 12;
    return `${hour}:${String(minutes).padStart(2, '0')} ${suffix}`;
  };

  document.querySelectorAll('.js-year').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('[data-phone-link]').forEach((link) => {
    link.href = `tel:${BUSINESS_CONFIG.phone}`;
    if (link.hasAttribute('data-phone-text')) link.textContent = BUSINESS_CONFIG.phoneDisplay;
  });

  document.querySelectorAll('[data-directions-link]').forEach((link) => {
    link.href = BUSINESS_CONFIG.directionsUrl;
  });

  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(BUSINESS_CONFIG.whatsappMessage)}`;
  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
    link.href = whatsappUrl;
  });

  document.querySelectorAll('[data-google-rating]').forEach((element) => {
    element.textContent = BUSINESS_CONFIG.googleRating;
  });
  document.querySelectorAll('[data-google-review-count]').forEach((element) => {
    element.textContent = BUSINESS_CONFIG.googleReviewCount;
  });

  document.querySelectorAll('[data-price]').forEach((element) => {
    const configuredPrice = getNestedValue(BUSINESS_CONFIG.prices, element.dataset.price);
    if (configuredPrice) element.textContent = configuredPrice;
  });

  const bookingMessage = document.querySelector('[data-booking-message]');
  if (bookingMessage && BUSINESS_CONFIG.bookingRequired) bookingMessage.hidden = true;

  const openDaysItem = document.querySelector('[data-open-days-item]');
  const openDayCount = Object.values(BUSINESS_CONFIG.openingHours).filter(Boolean).length;
  if (openDaysItem) {
    const value = openDaysItem.querySelector('strong');
    const label = openDaysItem.querySelector('span:last-child');
    if (value) value.textContent = `${openDayCount} DAYS`;
    if (label) label.textContent = openDayCount === 7 ? 'Open Weekly' : 'Each Week';
  }

  document.querySelectorAll('[data-hours-day]').forEach((row) => {
    const day = row.dataset.hoursDay;
    const schedule = BUSINESS_CONFIG.openingHours[day];
    const value = row.querySelector('dd');
    if (value) value.textContent = schedule ? `${schedule.open}–${schedule.close}` : 'Closed';
  });

  const paymentList = document.querySelector('[data-payment-methods]');
  if (paymentList) {
    paymentList.replaceChildren(...BUSINESS_CONFIG.paymentMethods.map((method) => {
      const item = document.createElement('li');
      const icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = method.icon;
      item.append(icon, document.createTextNode(` ${method.name}`));
      return item;
    }));
  }

  const getLondonTime = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const hour = Number(values.hour) === 24 ? 0 : Number(values.hour);
    return { day: values.weekday, minutes: (hour * 60) + Number(values.minute) };
  };

  const findNextOpening = (day, currentMinutes) => {
    const startIndex = DAYS.indexOf(day);
    for (let offset = 0; offset <= 7; offset += 1) {
      const nextDay = DAYS[(startIndex + offset) % DAYS.length];
      const schedule = BUSINESS_CONFIG.openingHours[nextDay];
      if (!schedule) continue;
      if (offset === 0 && currentMinutes >= toMinutes(schedule.open)) continue;
      const relativeDay = offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : `on ${nextDay}`;
      return `Closed · Opens ${relativeDay} at ${formatTime(schedule.open)}`;
    }
    return 'Closed · Please call for opening hours';
  };

  const updateOpenStatus = () => {
    const london = getLondonTime();
    const schedule = BUSINESS_CONFIG.openingHours[london.day];
    const isOpen = Boolean(schedule && london.minutes >= toMinutes(schedule.open) && london.minutes < toMinutes(schedule.close));
    const message = isOpen
      ? `Open now · Closes at ${formatTime(schedule.close)}`
      : findNextOpening(london.day, london.minutes);

    document.querySelectorAll('[data-open-status]').forEach((status) => {
      status.classList.toggle('is-open', isOpen);
      const text = status.querySelector('span:last-child');
      if (text && text.textContent !== message) text.textContent = message;
    });

    document.querySelectorAll('[data-hours-day]').forEach((row) => {
      row.classList.toggle('is-today', row.dataset.hoursDay === london.day);
    });
  };

  if (document.querySelector('[data-open-status]')) {
    updateOpenStatus();
    window.setInterval(updateOpenStatus, 30000);
  }

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-nav]');
  if (menuToggle && navigation) {
    const closeMenu = (returnFocus = false) => {
      navigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
      if (returnFocus) menuToggle.focus();
    };
    const openMenu = () => {
      navigation.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      menuToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', (event) => {
      if (menuToggle.getAttribute('aria-expanded') === 'true' && !navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    window.matchMedia('(min-width: 70.001rem)').addEventListener('change', (event) => {
      if (event.matches) closeMenu();
    });
  }

  document.querySelectorAll('[data-faq-button]').forEach((button, index) => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    if (!answer) return;
    const startsOpen = index === 0;
    button.setAttribute('aria-expanded', String(startsOpen));
    answer.hidden = !startsOpen;
    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(willOpen));
      answer.hidden = !willOpen;
    });
  });

  const galleryItems = [...document.querySelectorAll('[data-gallery-item]')];
  const lightbox = document.querySelector('[data-lightbox]');
  if (galleryItems.length && lightbox) {
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('[data-lightbox-caption]');
    const closeButton = lightbox.querySelector('[data-lightbox-close]');
    let currentIndex = 0;

    const showImage = (index) => {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];
      const thumbnail = item.querySelector('img');
      image.src = item.dataset.fullSrc;
      image.alt = thumbnail?.alt || '';
      caption.textContent = item.dataset.caption || thumbnail?.alt || '';
    };
    const openLightbox = (index) => {
      showImage(index);
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else lightbox.setAttribute('open', '');
    };
    const closeLightbox = () => {
      if (typeof lightbox.close === 'function') lightbox.close();
      else lightbox.removeAttribute('open');
    };

    galleryItems.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
    closeButton?.addEventListener('click', closeLightbox);
    lightbox.querySelector('[data-lightbox-previous]')?.addEventListener('click', () => showImage(currentIndex - 1));
    lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => showImage(currentIndex + 1));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  const mapButton = document.querySelector('[data-map-load]');
  const mapShell = document.querySelector('[data-map-shell]');
  if (mapButton && mapShell) {
    mapButton.addEventListener('click', () => {
      mapButton.disabled = true;
      mapButton.textContent = 'Loading map…';
      mapShell.setAttribute('aria-busy', 'true');

      const mapFrame = document.createElement('iframe');
      mapFrame.title = 'Map showing James Hand Carwash in Leatherhead';
      mapFrame.src = 'https://www.google.com/maps?q=James%20Hand%20Carwash%2C%20Kingston%20Rd%2C%20Leatherhead%20KT22%200EE%2C%20United%20Kingdom&output=embed';
      mapFrame.loading = 'lazy';
      mapFrame.referrerPolicy = 'no-referrer-when-downgrade';
      mapFrame.allowFullscreen = true;

      const wrapper = document.createElement('div');
      wrapper.className = 'map-frame-wrap';
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Google Map');
      wrapper.tabIndex = -1;
      const actions = document.createElement('p');
      actions.className = 'map-frame-actions';
      const help = document.createElement('span');
      help.textContent = 'Having trouble with the map?';
      const mapLink = document.createElement('a');
      mapLink.href = BUSINESS_CONFIG.directionsUrl;
      mapLink.target = '_blank';
      mapLink.rel = 'noopener noreferrer';
      mapLink.textContent = 'Open in Google Maps ↗';
      actions.append(help, mapLink);
      wrapper.append(mapFrame, actions);
      mapFrame.addEventListener('load', () => mapShell.removeAttribute('aria-busy'));
      mapShell.replaceChildren(wrapper);
      wrapper.focus({ preventScroll: true });
    }, { once: true });
  }

  /* Google Analytics is loaded only after an explicit “Accept” choice. */
  let analyticsLoaded = false;
  const hasValidAnalyticsId = () => /^G-[A-Z0-9]+$/.test(BUSINESS_CONFIG.googleAnalyticsId)
    && BUSINESS_CONFIG.googleAnalyticsId !== 'G-XXXXXXXXXX';
  const loadGoogleAnalytics = () => {
    if (analyticsLoaded || !hasValidAnalyticsId()) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', BUSINESS_CONFIG.googleAnalyticsId);

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(BUSINESS_CONFIG.googleAnalyticsId)}`;
    tag.dataset.googleAnalytics = 'true';
    document.head.append(tag);
  };
  const readCookieChoice = () => {
    try { return window.localStorage.getItem(COOKIE_CONSENT_KEY); }
    catch { return null; }
  };
  const saveCookieChoice = (choice) => {
    try { window.localStorage.setItem(COOKIE_CONSENT_KEY, choice); }
    catch { /* The choice will last for this page only when storage is unavailable. */ }
  };
  const removeAnalyticsCookies = () => {
    const hostParts = window.location.hostname.split('.');
    const domains = ['', window.location.hostname, `.${window.location.hostname}`];
    if (hostParts.length > 2) domains.push(`.${hostParts.slice(-2).join('.')}`);
    document.cookie.split(';').forEach((entry) => {
      const name = entry.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach((domain) => {
        const domainPart = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax`;
      });
    });
  };

  const cookieBanner = document.createElement('aside');
  cookieBanner.className = 'cookie-banner';
  cookieBanner.hidden = true;
  cookieBanner.setAttribute('role', 'dialog');
  cookieBanner.setAttribute('aria-modal', 'false');
  cookieBanner.setAttribute('aria-labelledby', 'cookie-banner-title');
  cookieBanner.setAttribute('aria-describedby', 'cookie-banner-description');
  cookieBanner.innerHTML = `
    <div class="cookie-banner__copy">
      <strong id="cookie-banner-title">Your cookie choice</strong>
      <p id="cookie-banner-description">We use optional Google Analytics cookies to understand how the site is used. Analytics will not load unless you accept.</p>
      <a href="cookies.html">Read our Cookie Policy</a>
    </div>
    <div class="cookie-banner__actions">
      <button class="cookie-choice cookie-choice--decline" type="button" data-cookie-decline>Decline</button>
      <button class="cookie-choice cookie-choice--accept" type="button" data-cookie-accept>Accept</button>
    </div>`;
  document.body.append(cookieBanner);

  let cookieSettingsTrigger = null;
  const showCookieBanner = (moveFocus = false) => {
    cookieBanner.hidden = false;
    if (moveFocus) cookieBanner.querySelector('[data-cookie-decline]')?.focus();
  };
  const hideCookieBanner = () => {
    cookieBanner.hidden = true;
    cookieSettingsTrigger?.focus();
    cookieSettingsTrigger = null;
  };
  cookieBanner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
    saveCookieChoice('accepted');
    loadGoogleAnalytics();
    hideCookieBanner();
  });
  cookieBanner.querySelector('[data-cookie-decline]')?.addEventListener('click', () => {
    saveCookieChoice('declined');
    removeAnalyticsCookies();
    if (analyticsLoaded) window.location.reload();
    else hideCookieBanner();
  });
  document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
    button.addEventListener('click', () => {
      cookieSettingsTrigger = button;
      showCookieBanner(true);
    });
  });

  const savedCookieChoice = readCookieChoice();
  if (savedCookieChoice === 'accepted') loadGoogleAnalytics();
  else if (savedCookieChoice !== 'declined') showCookieBanner();
})();
