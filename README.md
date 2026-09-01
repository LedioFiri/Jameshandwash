# James Hand Carwash website

A dependency-free static website for James Hand Carwash in Leatherhead. Open `index.html` directly or serve this folder with any static web server.

## Pages

- `index.html` — homepage
- `services.html` — service options
- `prices.html` — guide prices
- `gallery.html` — image gallery and lightbox
- `reviews.html` — customer review excerpts
- `faq.html` — frequently asked questions
- `location.html` — address, hours and optional map
- `privacy.html` — privacy policy
- `cookies.html` — cookie policy and preference controls

## Temporary details to confirm

Most editable placeholders are grouped in the `BUSINESS_CONFIG` block at the top of `script.js`:

- WhatsApp number (currently the Ofcom-reserved fictional number `07700 900000`)
- Google rating and review count
- booking / drive-in policy
- payment methods
- Monday–Sunday opening hours
- all vehicle-size package prices
- GA4 Measurement ID (currently the disabled placeholder `G-XXXXXXXXXX`)

Also confirm the service/package contents in `index.html` and `services.html`, plus the typical timing answers in `index.html` and `faq.html`. When hours or FAQ answers change, update the matching visible HTML and JSON-LD so they remain identical. Add geo coordinates to the business schema only after they have been verified.

Before launch, confirm the legal name of the privacy data controller and the hosting provider/log-retention details in `privacy.html`. Recheck the existing phone, directions and Google review links on the deployed site.

## Google Analytics and cookie consent

Set `googleAnalyticsId` in the `BUSINESS_CONFIG` block in `script.js` to the real GA4 Measurement ID. It must use the `G-...` format. The placeholder is deliberately rejected, so no Analytics request is made until it is replaced.

The shared cookie panel appears on every page until a visitor accepts or declines. Google Analytics is injected only after acceptance. The preference is saved under `james_cookie_consent_v1` in local storage, and visitors can reopen the panel with the **Cookie settings** button in any footer.

## Stock photography

All page images are self-hosted, so normal page views do not contact Unsplash or Pexels. Replace every stock image with real James Hand Carwash photography when it becomes available.

- `assets/hand-car-wash.webp` — hero and temporary social-sharing image; Avenir Visuals on Unsplash: https://unsplash.com/photos/man-washing-a-car-covered-in-foam-8s9GAPUMimY
- `assets/exterior-hand-wash.jpg` — exterior washing: https://www.pexels.com/photo/using-soap-in-washing-a-car-5233271/
- `assets/wheel-pressure-cleaning.jpg` — wheel cleaning: https://www.pexels.com/photo/car-wheel-washing-with-water-jet-4876678/
- `assets/car-interior-vacuum.jpg` — interior vacuuming: https://www.pexels.com/photo/hand-holding-a-car-vacuum-cleaner-5233264/
- `assets/car-interior-cleaning.jpg` — interior cleaning: https://www.pexels.com/photo/person-cleaning-car-interior-with-cloth-for-maintenance-31389821/
- `assets/pressure-washing-car.jpg` — pressure washing / staff at work: https://www.pexels.com/photo/a-woman-cleaning-a-car-6873081/
- `assets/car-detailing-finish.jpg` — hand finishing: https://www.pexels.com/photo/cleaning-of-car-7154630/
- `assets/finished-car-interior.jpg` — finished interior: https://www.pexels.com/photo/clean-car-indoors-9138382/
- `assets/wheel-hand-wash.jpg` — wheel and bodywork rinse: https://www.pexels.com/photo/cleaning-car-on-sidewalk-5693660/

Google Maps is loaded only after a visitor explicitly selects “Load Google Map”. The site installs no framework, advertising pixel or gallery library; optional Google Analytics uses Google’s hosted tag only after consent.
