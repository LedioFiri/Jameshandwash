(() => {
  'use strict';

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-nav]');

  if (menuToggle && navigation) {
    const closeMenu = (returnFocus = false) => {
      navigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');

      if (returnFocus) {
        menuToggle.focus();
      }
    };

    const openMenu = () => {
      navigation.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navigation.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      const mobileMenuIsOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (!link || !mobileMenuIsOpen) return;

      closeMenu();

      const targetId = link.hash;
      const target = targetId ? document.querySelector(targetId) : null;

      if (target) {
        window.requestAnimationFrame(() => {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        });
      } else {
        menuToggle.focus({ preventScroll: true });
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    document.addEventListener('click', (event) => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen && !navigation.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 52.001rem)');
    desktopQuery.addEventListener('change', (event) => {
      if (event.matches) {
        closeMenu();
      }
    });
  }

  document.querySelectorAll('.js-year').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const mapButton = document.querySelector('[data-map-load]');
  const mapShell = document.querySelector('[data-map-shell]');

  if (mapButton && mapShell) {
    mapButton.addEventListener('click', () => {
      mapButton.disabled = true;
      mapButton.textContent = 'Loading map…';
      mapShell.setAttribute('aria-busy', 'true');

      const mapFrame = document.createElement('iframe');
      mapFrame.title = 'Map showing James Hand Carwash at Leatherhead Golf Club';
      mapFrame.src = 'https://www.google.com/maps?q=James%20Hand%20Carwash%2C%20Kingston%20Rd%2C%20Leatherhead%20KT22%200EE%2C%20United%20Kingdom&output=embed';
      mapFrame.loading = 'lazy';
      mapFrame.referrerPolicy = 'no-referrer-when-downgrade';
      mapFrame.allowFullscreen = true;

      const mapRegion = document.createElement('div');
      mapRegion.className = 'map-frame-wrap';
      mapRegion.setAttribute('role', 'region');
      mapRegion.setAttribute('aria-label', 'Google Map loading. A direct Google Maps link follows the map.');
      mapRegion.tabIndex = -1;

      const mapActions = document.createElement('p');
      mapActions.className = 'map-frame-actions';

      const mapHelp = document.createElement('span');
      mapHelp.textContent = 'Having trouble with the map?';

      const mapLink = document.createElement('a');
      mapLink.href = 'https://share.google/yLYQ1P7lqTCCYRFbb';
      mapLink.target = '_blank';
      mapLink.rel = 'noopener noreferrer';
      mapLink.textContent = 'Open in Google Maps ↗';

      mapActions.append(mapHelp, mapLink);
      mapRegion.append(mapFrame, mapActions);

      mapFrame.addEventListener('load', () => {
        mapShell.removeAttribute('aria-busy');
        mapRegion.setAttribute('aria-label', 'Google Map loaded. A direct Google Maps link follows the map.');
      });

      mapShell.replaceChildren(mapRegion);
      mapRegion.focus({ preventScroll: true });
    }, { once: true });
  }
})();
