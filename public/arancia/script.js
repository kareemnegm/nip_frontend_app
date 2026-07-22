// Capture utm_campaign from URL on arrival and persist for the session
(function () {
  const c = new URLSearchParams(window.location.search).get('utm_campaign');
  if (c) sessionStorage.setItem('nip_utm_campaign', c);
})();

(() => {
  /* ============================================================
     Header scroll state + section reveals
     ============================================================ */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ============================================================
     ZOHO CRM CONFIG — Web-to-Lead
     ------------------------------------------------------------
     To activate: in Zoho CRM go to
       Setup → Developer Hub → Web Forms → New
     Build a Leads form with at minimum: Last Name, Email, Phone, Description.
     Click "Embed" / "Get Source" and copy the values from the generated
     HTML into the three constants below.
     ============================================================ */
  const ZOHO = {
    actionUrl: 'https://crm.zoho.com/crm/WebToLeadForm',
    xnQsjsdp: 'af105359555425b9f41cf81058b28522e56f9bbc062cb36d18d44e525b9370aa',
    xmIwtLD:  '1bb695372c9d1bd0e0f4210df86e2029f7e7b9fe08c83c2a5d4de9a688351ecbeaa5ec343f13f2a1fdb27590aa8bc62c',
    returnURL: window.location.pathname.includes('/ar/')
      ? 'https://niprealty.com/arancia/ar/thank-you'
      : 'https://niprealty.com/arancia/thank-you'
  };

  /* ============================================================
     SPAM PROTECTION — honeypot (in markup), 45s lockout, reCAPTCHA v3
     ============================================================ */
  let lastSubmitTs = 0;
  const SUBMIT_LOCKOUT_MS = 45000;

  // reCAPTCHA v3 (invisible). TODO: paste your v3 SITE key below (public — safe in client).
  // NOTE: v3 is score-based and needs server-side verification to actually gate spam.
  // Until verify.php is live this only fetches a token; the token is not yet checked.
  const RECAPTCHA_SITE_KEY = '__PASTE_RECAPTCHA_V3_SITE_KEY__';
  const recaptchaEnabled = RECAPTCHA_SITE_KEY && !RECAPTCHA_SITE_KEY.startsWith('__');
  if (recaptchaEnabled) {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    document.head.appendChild(s);
  }
  const getRecaptchaToken = () => new Promise((resolve) => {
    if (!recaptchaEnabled || typeof grecaptcha === 'undefined') return resolve(null);
    let settled = false;
    const finish = (v) => { if (!settled) { settled = true; resolve(v); } };
    // Never block submit on reCAPTCHA — bail after 3s no matter what
    setTimeout(() => finish(null), 3000);
    try {
      grecaptcha.ready(() => grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' })
        .then(finish).catch(() => finish(null)));
    } catch (_) {
      finish(null);
    }
  });

  const COUNTRIES = [
    { iso:'AE', name:'United Arab Emirates', dial:'+971', flag:'🇦🇪' },
    { iso:'SA', name:'Saudi Arabia',         dial:'+966', flag:'🇸🇦' },
    { iso:'QA', name:'Qatar',                dial:'+974', flag:'🇶🇦' },
    { iso:'KW', name:'Kuwait',               dial:'+965', flag:'🇰🇼' },
    { iso:'BH', name:'Bahrain',              dial:'+973', flag:'🇧🇭' },
    { iso:'OM', name:'Oman',                 dial:'+968', flag:'🇴🇲' },
    { iso:'GB', name:'United Kingdom',       dial:'+44',  flag:'🇬🇧' },
    { iso:'US', name:'United States',        dial:'+1',   flag:'🇺🇸' },
    { iso:'CA', name:'Canada',               dial:'+1',   flag:'🇨🇦' },
    { iso:'IN', name:'India',                dial:'+91',  flag:'🇮🇳' },
    { iso:'PK', name:'Pakistan',             dial:'+92',  flag:'🇵🇰' },
    { iso:'BD', name:'Bangladesh',           dial:'+880', flag:'🇧🇩' },
    { iso:'CN', name:'China',                dial:'+86',  flag:'🇨🇳' },
    { iso:'HK', name:'Hong Kong',            dial:'+852', flag:'🇭🇰' },
    { iso:'SG', name:'Singapore',            dial:'+65',  flag:'🇸🇬' },
    { iso:'MY', name:'Malaysia',             dial:'+60',  flag:'🇲🇾' },
    { iso:'ID', name:'Indonesia',            dial:'+62',  flag:'🇮🇩' },
    { iso:'TH', name:'Thailand',             dial:'+66',  flag:'🇹🇭' },
    { iso:'PH', name:'Philippines',          dial:'+63',  flag:'🇵🇭' },
    { iso:'JP', name:'Japan',                dial:'+81',  flag:'🇯🇵' },
    { iso:'KR', name:'South Korea',          dial:'+82',  flag:'🇰🇷' },
    { iso:'AU', name:'Australia',            dial:'+61',  flag:'🇦🇺' },
    { iso:'NZ', name:'New Zealand',          dial:'+64',  flag:'🇳🇿' },
    { iso:'ZA', name:'South Africa',         dial:'+27',  flag:'🇿🇦' },
    { iso:'EG', name:'Egypt',                dial:'+20',  flag:'🇪🇬' },
    { iso:'JO', name:'Jordan',               dial:'+962', flag:'🇯🇴' },
    { iso:'LB', name:'Lebanon',              dial:'+961', flag:'🇱🇧' },
    { iso:'IQ', name:'Iraq',                 dial:'+964', flag:'🇮🇶' },
    { iso:'TR', name:'Türkiye',              dial:'+90',  flag:'🇹🇷' },
    { iso:'IR', name:'Iran',                 dial:'+98',  flag:'🇮🇷' },
    { iso:'IL', name:'Israel',               dial:'+972', flag:'🇮🇱' },
    { iso:'DE', name:'Germany',              dial:'+49',  flag:'🇩🇪' },
    { iso:'FR', name:'France',               dial:'+33',  flag:'🇫🇷' },
    { iso:'IT', name:'Italy',                dial:'+39',  flag:'🇮🇹' },
    { iso:'ES', name:'Spain',                dial:'+34',  flag:'🇪🇸' },
    { iso:'PT', name:'Portugal',             dial:'+351', flag:'🇵🇹' },
    { iso:'NL', name:'Netherlands',          dial:'+31',  flag:'🇳🇱' },
    { iso:'BE', name:'Belgium',              dial:'+32',  flag:'🇧🇪' },
    { iso:'CH', name:'Switzerland',          dial:'+41',  flag:'🇨🇭' },
    { iso:'AT', name:'Austria',              dial:'+43',  flag:'🇦🇹' },
    { iso:'IE', name:'Ireland',              dial:'+353', flag:'🇮🇪' },
    { iso:'SE', name:'Sweden',               dial:'+46',  flag:'🇸🇪' },
    { iso:'NO', name:'Norway',               dial:'+47',  flag:'🇳🇴' },
    { iso:'DK', name:'Denmark',              dial:'+45',  flag:'🇩🇰' },
    { iso:'FI', name:'Finland',              dial:'+358', flag:'🇫🇮' },
    { iso:'PL', name:'Poland',               dial:'+48',  flag:'🇵🇱' },
    { iso:'CZ', name:'Czech Republic',       dial:'+420', flag:'🇨🇿' },
    { iso:'GR', name:'Greece',               dial:'+30',  flag:'🇬🇷' },
    { iso:'RU', name:'Russia',               dial:'+7',   flag:'🇷🇺' },
    { iso:'UA', name:'Ukraine',              dial:'+380', flag:'🇺🇦' },
    { iso:'BR', name:'Brazil',               dial:'+55',  flag:'🇧🇷' },
    { iso:'MX', name:'Mexico',               dial:'+52',  flag:'🇲🇽' },
    { iso:'AR', name:'Argentina',            dial:'+54',  flag:'🇦🇷' },
    { iso:'NG', name:'Nigeria',              dial:'+234', flag:'🇳🇬' },
    { iso:'KE', name:'Kenya',                dial:'+254', flag:'🇰🇪' },
    { iso:'GH', name:'Ghana',                dial:'+233', flag:'🇬🇭' },
    { iso:'MA', name:'Morocco',              dial:'+212', flag:'🇲🇦' }
  ];

  /* ============================================================
     Build a country-code dropdown inside each .ri-phone-cc
     Uses flagcdn.com PNGs so flags render reliably on Windows.
     ============================================================ */
  const flagUrl = (iso) => `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;
  const flagUrl2x = (iso) => `https://flagcdn.com/w80/${iso.toLowerCase()}.png 2x`;

  function buildPicker(root) {
    const toggle = root.querySelector('.cc-toggle');
    const menu   = root.querySelector('.cc-menu');
    const flagEl = toggle.querySelector('.cc-flag');
    const dialEl = toggle.querySelector('.cc-dial');
    const dialIn = root.querySelector('input[name="dial_code"]');
    const isoIn  = root.querySelector('input[name="country_iso"]');

    const isArPage = document.documentElement.lang === 'ar';
    const searchLabel = isArPage ? 'ابحث عن الدولة' : 'Search country';

    menu.innerHTML = `
      <li class="cc-search"><input type="text" placeholder="${searchLabel}" aria-label="${searchLabel}"/></li>
      ${COUNTRIES.map(c => `
        <li class="cc-option" role="option" data-iso="${c.iso}" data-dial="${c.dial}">
          <img class="cc-flag" src="${flagUrl(c.iso)}" srcset="${flagUrl2x(c.iso)}" alt="" />
          <span class="cc-name">${c.name}</span>
          <span class="cc-dial">${c.dial}</span>
        </li>
      `).join('')}
    `;

    const search = menu.querySelector('.cc-search input');
    const options = () => Array.from(menu.querySelectorAll('.cc-option'));

    const closeMenu = () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    };
    const openMenu = () => {
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      setTimeout(() => search.focus(), 50);
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) closeMenu();
    });

    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      options().forEach(opt => {
        const name = opt.querySelector('.cc-name').textContent.toLowerCase();
        const dial = opt.dataset.dial;
        opt.style.display = (!q || name.includes(q) || dial.includes(q)) ? '' : 'none';
      });
    });

    menu.addEventListener('click', (e) => {
      const opt = e.target.closest('.cc-option');
      if (!opt) return;
      const c = COUNTRIES.find(x => x.iso === opt.dataset.iso);
      flagEl.src    = flagUrl(c.iso);
      flagEl.srcset = flagUrl2x(c.iso);
      dialEl.textContent = c.dial;
      dialIn.value = c.dial;
      isoIn.value  = c.iso;
      closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }
  document.querySelectorAll('.ri-phone-cc').forEach(buildPicker);

  /* ============================================================
     Modal open/close
     ============================================================ */
  const modal = document.getElementById('leadModal');

  // Language-aware UI strings — Arabic page uses lang="ar" on <html>
  const isAr = document.documentElement.lang === 'ar';
  const T = {
    registerTitle:    isAr ? 'سجّل اهتمامك'                                                              : 'REGISTER YOUR INTEREST',
    registerSubtitle: isAr ? 'سري ومُخصَّص. يرد عليك أحد مستشارينا في غضون يوم عمل واحد.'               : 'Discreet and tailored. An advisor responds within one business day.',
    registerSubmit:   isAr ? 'طلب استشارة خاصة'                                                          : 'Request Private Advisory',
    downloadTitle:    isAr ? 'تحميل ملفات المشروع'                                                        : 'DOWNLOAD PROJECT ASSETS',
    downloadSubtitle: isAr ? 'يرجى ملء النموذج للوصول إلى ملفات المشروع.'                                : 'To download project assets you must fill in the form.',
    downloadSubmit:   isAr ? 'تقديم'                                                                      : 'Submit',
    submitting:       isAr ? 'جارٍ الإرسال…'                                                             : 'Submitting…',
    waitError:  (s)  => isAr ? `يرجى الانتظار ${s} ثانية قبل المحاولة مجدداً.`                          : `Please wait ${s} second${s === 1 ? '' : 's'} before submitting again.`,
    submitError:      isAr ? 'حدث خطأ. يرجى المحاولة مرة أخرى أو مراسلتنا على info@niprealty.com'        : 'Something went wrong. Please try again or email info@niprealty.com.',
  };

  // Single global flag — any form submitted means all subsequent opens skip the form
  let anyFormSubmitted = false;

  // Shared thank-you HTML; content depends only on whether the opener is the brochure button
  const thanksHTML = (isBrochure) => `
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
      <circle cx="28" cy="28" r="28" fill="#EEF6F0"/>
      <path d="M16 28.5l8 8 16-16" stroke="#1A7F37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <p class="form-thanks-title">THANK YOU</p>
    <p class="form-thanks-body">${isBrochure
      ? 'Your details have been received. Click below to download your project assets.'
      : 'Your registration has been received. A NIP advisor will be in touch within one business day.'
    }</p>
    ${isBrochure ? `
    <div class="form-thanks-actions">
      <button type="button" class="btn btn-primary js-dl" data-file="brochure/Beyond.pdf" data-name="Arancia-Yards-Brochure.pdf">Download Brochure</button>
      <button type="button" class="btn btn-secondary js-dl" data-file="brochure/floorplans.pdf" data-name="Arancia-Yards-Floor-Plans.pdf">Download Floor Plans</button>
    </div>` : ''}
  `;

  // Force a real file download (blob → object URL) so PDF buttons never navigate away.
  // Buttons stay enabled and re-clickable; user can grab both files, any order, any number of times.
  const downloadFile = async (url, filename, btn) => {
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Downloading…';
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objUrl), 4000);
    } catch (err) {
      console.error('[NIP] Download failed', url, err);
      // Fallback: open in a new tab so the user still gets the file without losing the success state
      window.open(url, '_blank', 'noopener');
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-dl');
    if (!btn) return;
    e.preventDefault();
    downloadFile(btn.dataset.file, btn.dataset.name, btn);
  });

  const renderThanksInCard = (card, isBrochure) => {
    const prev = card.querySelector('.form-thanks');
    if (prev) prev.remove();
    const closeBtn = card.querySelector('.modal-close');
    Array.from(card.children).forEach(el => {
      if (el !== closeBtn) el.style.display = 'none';
    });
    const div = document.createElement('div');
    div.className = 'form-thanks';
    div.innerHTML = thanksHTML(isBrochure);
    card.appendChild(div);
  };

  const openModal = (source) => {
    const card = modal.querySelector('.modal-card');
    const isBrochureSrc = (source === 'Brochure');

    if (anyFormSubmitted) {
      // A form was already filled anywhere this session — skip straight to thank-you.
      // Brochure button always shows download buttons; others show plain thank-you.
      renderThanksInCard(card, isBrochureSrc);
    } else {
      // No submission yet — show the fresh form
      const prev = card.querySelector('.form-thanks');
      if (prev) prev.remove();
      Array.from(card.children).forEach(el => (el.style.display = ''));
      const f = modal.querySelector('form.ri-form');
      if (f) f.dataset.source = source || 'Modal';
      if (f) f.dataset.intent = isBrochureSrc ? 'download' : 'lead';
      const titleEl    = document.getElementById('modalTitle');
      const subtitleEl = document.getElementById('modalSubtitle');
      const submitBtn  = modal.querySelector('.ri-submit');
      if (titleEl)    titleEl.textContent    = isBrochureSrc ? T.downloadTitle    : T.registerTitle;
      if (subtitleEl) subtitleEl.textContent = isBrochureSrc ? T.downloadSubtitle : T.registerSubtitle;
      if (submitBtn)  submitBtn.textContent  = isBrochureSrc ? T.downloadSubmit   : T.registerSubmit;
      setTimeout(() => {
        const first = modal.querySelector('input[name="full_name"]');
        if (first) first.focus();
      }, 100);
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.js-open-form').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.formSource));
  });
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* ============================================================
     Auto popup — fires once at 50 % scroll depth per session
     ============================================================ */
  if (!sessionStorage.getItem('nip_popup_shown')) {
    const onScrollPopup = () => {
      const scrolled  = window.scrollY + window.innerHeight;
      const pageTotal = document.documentElement.scrollHeight;
      if (scrolled >= pageTotal * 0.5) {
        window.removeEventListener('scroll', onScrollPopup);
        sessionStorage.setItem('nip_popup_shown', '1');
        if (!modal.classList.contains('open')) {
          openModal('Auto Popup');
        }
      }
    };
    window.addEventListener('scroll', onScrollPopup, { passive: true });
  }

  /* ============================================================
     Form submit → Zoho CRM Web-to-Lead
     ============================================================ */
  const showFeedback = (form, type, msg) => {
    const fb = form.querySelector('.ri-feedback');
    fb.className = `ri-feedback show ${type}`;
    fb.textContent = msg;
  };

  const splitName = (full) => {
    const parts = full.trim().split(/\s+/);
    if (parts.length === 1) return { first: '', last: parts[0] };
    return { first: parts.slice(0, -1).join(' '), last: parts.slice(-1)[0] };
  };

  const validate = (form) => {
    let ok = true;
    form.querySelectorAll('input[required]').forEach(input => {
      input.classList.remove('invalid');
      if (input.type === 'checkbox') {
        if (!input.checked) { input.classList.add('invalid'); ok = false; }
        return;
      }
      if (!input.value.trim()) { input.classList.add('invalid'); ok = false; }
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.add('invalid'); ok = false;
      }
      if (input.type === 'tel' && input.value.replace(/\D/g,'').length < 6) {
        input.classList.add('invalid'); ok = false;
      }
    });
    form.querySelectorAll('select[required]').forEach(sel => {
      sel.classList.remove('invalid');
      if (!sel.value) { sel.classList.add('invalid'); ok = false; }
    });
    return ok;
  };

  // Populate the static Zoho form fields (form is submitted by the caller per intent)
  const populateZohoForm = (payload, rcToken) => {
    document.getElementById('nzf_Last_Name').value   = payload.lastName || payload.firstName || 'Unknown';
    document.getElementById('nzf_First_Name').value  = payload.firstName;
    document.getElementById('nzf_Email').value        = payload.email;
    document.getElementById('nzf_Phone').value        = `${payload.dial || ''} ${payload.phone || ''}`.trim();
    document.getElementById('nzf_LEADCF40').value     = payload.budget;
    document.getElementById('nzf_LEADCF47').value     = sessionStorage.getItem('nip_utm_campaign') || 'ARANCIA YARDS';
    document.getElementById('nzf_Description').value  =
      `Source: ${payload.source} | Country: ${payload.iso || 'N/A'} | Budget: ${payload.budget}` +
      (rcToken ? ` | RC:${rcToken.substring(0, 24)}` : '');
  };

  // Fallback when Zoho tokens are absent — stash the lead locally so nothing is lost
  const saveLeadLocally = (payload) => {
    const leads = JSON.parse(localStorage.getItem('nip_leads') || '[]');
    leads.push({ ...payload, ts: Date() });
    localStorage.setItem('nip_leads', JSON.stringify(leads));
    console.warn('[NIP] Zoho not configured — lead saved to localStorage');
  };

  const showThanks = (form, isBrochure) => {
    anyFormSubmitted = true;
    const card = form.closest('.form-card') || form.closest('.hero-glass-panel') || form.closest('.modal-card');
    renderThanksInCard(card, isBrochure);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    console.log('[NIP] form submit fired —', form.dataset.source || '(unknown)', '| intent:', form.dataset.intent || 'lead');

    // Re-entrancy guard: a submit is already in flight. Never fail silently.
    if (form.dataset.submitted === 'true') {
      showFeedback(form, 'err', 'Your submission is already being processed…');
      return;
    }

    // Honeypot — silently drop bots that fill the off-screen field
    const hp = form.querySelector('input[name="company_website"]');
    if (hp && hp.value) return;

    // 45s global lockout across all forms (debounce rapid/duplicate submits)
    const now = Date.now();
    if (now - lastSubmitTs < SUBMIT_LOCKOUT_MS) {
      const wait = Math.ceil((SUBMIT_LOCKOUT_MS - (now - lastSubmitTs)) / 1000);
      showFeedback(form, 'err', T.waitError(wait));
      return;
    }

    if (!validate(form)) {
      showFeedback(form, 'err', 'Please complete all required fields — name, email, phone and budget.');
      return;
    }

    const intent = form.dataset.intent === 'download' ? 'download' : 'lead';
    const data = new FormData(form);
    const { first, last } = splitName(data.get('full_name'));
    const payload = {
      firstName: first,
      lastName:  last,
      email:     data.get('email'),
      phone:     data.get('phone'),
      dial:      data.get('dial_code'),
      iso:       data.get('country_iso'),
      budget:    data.get('budget') || '',
      source:    form.dataset.source || 'Website'
    };

    const submitBtn = form.querySelector('.ri-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = T.submitting;

    try {
      form.dataset.submitted = 'true';

      // reCAPTCHA v3 token — captured and forwarded to Zoho Description for auditing.
      // Server-side score check requires verify.php + RECAPTCHA_SITE_KEY to be configured.
      const rcToken = await getRecaptchaToken();

      // No Zoho tokens → save locally and show thanks without navigating
      if (!ZOHO.xnQsjsdp || !ZOHO.xmIwtLD) {
        saveLeadLocally(payload);
        lastSubmitTs = Date.now();
        showThanks(form, intent === 'download');
        return;
      }

      populateZohoForm(payload, rcToken);
      const zForm = document.getElementById('nip_zoho_form');
      lastSubmitTs = Date.now();

      if (intent === 'download') {
        // SILENT submit into the hidden iframe — stay on page, reveal downloads
        zForm.target = 'nip_zoho_frame';
        const frame = document.getElementById('nip_zoho_frame');
        let done = false;
        const reveal = () => {
          if (done) return;
          done = true;
          frame.removeEventListener('load', reveal);
          clearTimeout(timer);
          showThanks(form, true); // renders the two download buttons
          (window.dataLayer = window.dataLayer || []).push({ event: 'nip_brochure_success', project: 'arancia' });
          console.log('[NIP] Brochure lead submitted (iframe) — check Zoho CRM → All Leads');
        };
        const timer = setTimeout(reveal, 2500); // fallback if iframe load doesn't fire
        frame.addEventListener('load', reveal);
        zForm.submit();
      } else {
        // LEAD: real top-level POST → Zoho redirects the browser to thank-you
        zForm.removeAttribute('target');
        document.getElementById('nzf_returnURL').value = ZOHO.returnURL;
        zForm.submit(); // navigates away
      }
    } catch (err) {
      console.error(err);
      form.dataset.submitted = 'false';
      submitBtn.disabled = false;
      submitBtn.textContent = intent === 'download' ? T.downloadSubmit : T.registerSubmit;
      showFeedback(form, 'err', T.submitError);
    }
  };

  document.querySelectorAll('form.ri-form').forEach(f => f.addEventListener('submit', handleSubmit));

  // Back/forward-cache restore: clear transient submit state so a returned-to form
  // isn't permanently stuck "submitted" (silent dead clicks). This is the live root cause.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    lastSubmitTs = 0;
    document.querySelectorAll('form.ri-form').forEach((f) => {
      f.dataset.submitted = 'false';
      const b = f.querySelector('.ri-submit');
      if (b) {
        b.disabled = false;
        b.textContent = f.dataset.intent === 'download' ? T.downloadSubmit : T.registerSubmit;
      }
    });
    console.log('[NIP] bfcache restore — submit state reset');
  });

  /* ============================================================
     Construction Progress — ring + counter animation
     ============================================================ */
  const progressFill = document.querySelector('.progress-fill');
  const progressNum  = document.querySelector('.progress-num');
  if (progressFill && progressNum) {
    const target   = parseInt(progressFill.dataset.target || '20', 10);
    const duration = 1500;
    let started    = false;

    const runAnimation = () => {
      if (started) return;
      started = true;
      progressFill.classList.add('animated');
      const begin = performance.now();
      const tick  = (now) => {
        const t      = Math.min((now - begin) / duration, 1);
        const eased  = 1 - Math.pow(1 - t, 3);
        progressNum.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runAnimation();
      }
    }, { threshold: 0.4 }).observe(document.querySelector('.progress-band'));
  }

  /* ============================================================
     Lightbox (image slider) — opens from gallery tiles
     ============================================================ */
  const GALLERY = [
    // — Featured in grid (indices 0, 1, 2) —
    { src:'images/Exterior/Balcony - Sunken Courtyard 2.webp',       caption:'Balcony — Sunken courtyard II' },
    { src:'images/Exterior/Facade.webp',                             caption:'Facade — Arancia Yards' },
    { src:'images/Interior/1BR - Living.webp',                       caption:'1 Bedroom — Living room' },
    // — Exterior —
    { src:'images/Exterior/Hero Shot - Aerial.webp',                 caption:'Aerial view — Arancia Yards' },
    { src:'images/Exterior/Arrival.webp',                            caption:'Arrival experience' },
    { src:'images/Exterior/Balcony - Green Spine.webp',              caption:'Balcony — Green spine' },
    { src:'images/Exterior/Balcony - Sunken Courtyard.webp',         caption:'Balcony — Sunken courtyard' },
    { src:'images/Exterior/Building A - Lobby.webp',                 caption:'Building A — Lobby' },
    { src:'images/Exterior/Cascading Water Feature - Courtyard.webp',caption:'Cascading water feature' },
    { src:'images/Exterior/Courtyard.webp',                          caption:'Courtyard' },
    { src:'images/Exterior/Courtyard 2.webp',                        caption:'Courtyard II' },
    { src:'images/Exterior/Courtyard 3.webp',                        caption:'Courtyard III' },
    { src:'images/Exterior/Dining.webp',                             caption:'Outdoor dining' },
    { src:'images/Exterior/Facade 2.webp',                           caption:'Facade II' },
    { src:'images/Exterior/Green Walkways - Courtyard.webp',         caption:'Green walkways — Courtyard' },
    { src:'images/Exterior/Hero Shot - Aerial 2.webp',               caption:'Aerial view II' },
    { src:'images/Exterior/Lobby - Outdoor.webp',                    caption:'Lobby — Outdoor' },
    { src:'images/Exterior/Private Terrace.webp',                    caption:'Private terrace' },
    { src:'images/Exterior/Retail Cafe.webp',                        caption:'Retail café' },
    { src:'images/Exterior/Retail.webp',                             caption:'Retail' },
    { src:'images/Exterior/Rooftop Terrace.webp',                    caption:'Rooftop terrace' },
    { src:'images/Exterior/Sunken Courtyard - Golden Hour.webp',     caption:'Sunken courtyard — Golden hour' },
    { src:'images/Exterior/Sunken Courtyard - Night.webp',           caption:'Sunken courtyard — Night' },
    { src:'images/Exterior/Sunken Courtyard.webp',                   caption:'Sunken courtyard' },
    { src:'images/Exterior/Sunken Seating.webp',                     caption:'Sunken seating' },
    { src:'images/Exterior/Terrace - Outdoor.webp',                  caption:'Terrace — Outdoor' },
    { src:'images/Exterior/Terrace - Sunken Courtyard.webp',         caption:'Terrace — Sunken courtyard' },
    { src:'images/Exterior/Terrace To Courtyard.webp',               caption:'Terrace to courtyard' },
    { src:'images/Exterior/Water Feature.webp',                      caption:'Water feature' },
    // — Interior —
    { src:'images/Interior/1BR - Bedroom.webp',                      caption:'1 Bedroom — Bedroom' },
    { src:'images/Interior/1BR - Kitchen and Living.webp',           caption:'1 Bedroom — Kitchen & living' },
    { src:'images/Interior/2BR - Bathroom.webp',                     caption:'2 Bedroom — Bathroom' },
    { src:'images/Interior/2BR - Living room.webp',                  caption:'2 Bedroom — Living room' },
    { src:'images/Interior/2BR - Powder room.webp',                  caption:'2 Bedroom — Powder room' },
    { src:'images/Interior/3BR - Bedroom.webp',                      caption:'3 Bedroom — Bedroom' },
    { src:'images/Interior/3BR - Living room 1.webp',                caption:'3 Bedroom — Living room I' },
    { src:'images/Interior/3BR - Living room 2.webp',                caption:'3 Bedroom — Living room II' },
    { src:'images/Interior/Co-working Space.webp',                   caption:'Co-working space' },
    { src:'images/Interior/GF Amenities.webp',                       caption:'Ground floor amenities' },
    { src:'images/Interior/Kids Area - Indoor.webp',                 caption:'Kids area — Indoor' },
    { src:'images/Interior/Kids Area - Indoor 2.webp',               caption:'Kids area — Indoor II' },
    { src:'images/Interior/Living & Dining 2.webp',                  caption:'Living & dining II' },
    { src:'images/Interior/Living and Dining.webp',                  caption:'Living and dining' },
    { src:'images/Interior/Living and Dining 2.webp',                caption:'Living and dining III' },
    { src:'images/Interior/Living and Kitchen.webp',                 caption:'Living and kitchen' },
    { src:'images/Interior/Living.webp',                             caption:'Living' },
    { src:'images/Interior/Lobby.webp',                              caption:'Lobby' },
    { src:'images/Interior/Lobby 2.webp',                            caption:'Lobby II' },
    { src:'images/Interior/Lobby 3.webp',                            caption:'Lobby III' },
    { src:'images/Interior/Master Bedroom.webp',                     caption:'Master bedroom' },
    { src:'images/Interior/Master Bedroom 2.webp',                   caption:'Master bedroom II' },
  ];

  const lb     = document.getElementById('lightbox');
  const lbImg  = lb.querySelector('.lb-img');
  const lbCap  = lb.querySelector('.lb-caption');
  const lbCur  = lb.querySelector('.lb-current');
  const lbTot  = lb.querySelector('.lb-total');
  const lbThumbs = lb.querySelector('.lb-thumbs');
  let lbIndex  = 0;

  lbTot.textContent = GALLERY.length;
  // build thumbs
  lbThumbs.innerHTML = GALLERY.map((g, i) => `
    <button type="button" class="lb-thumb" data-i="${i}" aria-label="${g.caption}">
      <img src="${g.src}" alt="" loading="lazy" />
    </button>
  `).join('');

  const showImg = (i) => {
    lbIndex = (i + GALLERY.length) % GALLERY.length;
    const g = GALLERY[lbIndex];
    lbImg.classList.remove('loaded');
    lbImg.src = '';            // forces transition restart
    requestAnimationFrame(() => {
      lbImg.src = g.src;
      lbImg.alt = g.caption;
    });
    lbCap.textContent = g.caption;
    lbCur.textContent = lbIndex + 1;
    lbThumbs.querySelectorAll('.lb-thumb').forEach((t, n) => {
      t.classList.toggle('active', n === lbIndex);
    });
    const activeThumb = lbThumbs.querySelector('.lb-thumb.active');
    if (activeThumb) activeThumb.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  };

  lbImg.addEventListener('load', () => lbImg.classList.add('loaded'));

  const openLb = (i) => {
    showImg(i);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.js-open-lightbox').forEach(btn => {
    btn.addEventListener('click', () => openLb(parseInt(btn.dataset.index || '0', 10)));
  });
  lb.querySelectorAll('[data-lb-close]').forEach(el => el.addEventListener('click', closeLb));
  lb.querySelector('.lb-prev').addEventListener('click', () => showImg(lbIndex - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => showImg(lbIndex + 1));
  lbThumbs.addEventListener('click', (e) => {
    const t = e.target.closest('.lb-thumb');
    if (t) showImg(parseInt(t.dataset.i, 10));
  });

  // Close on backdrop click (anywhere outside the figure & nav)
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLb();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLb();
    if (e.key === 'ArrowLeft')   showImg(lbIndex - 1);
    if (e.key === 'ArrowRight')  showImg(lbIndex + 1);
  });

  /* ============================================================
     Hero glass form — mobile "Enquire Now" toggle
     ============================================================ */
  const heroEnqBtn = document.querySelector('.hero-enquire-btn');
  const heroPanel  = document.querySelector('.hero-glass-panel');
  if (heroEnqBtn && heroPanel) {
    heroEnqBtn.addEventListener('click', () => {
      heroPanel.classList.add('form-open');
      heroEnqBtn.style.display = 'none';
    });
  }

  /* ============================================================
     Gallery carousel — initialise on mobile (≤680 px)
     ============================================================ */
  function initGalleryCarousels() {
    if (window.innerWidth > 680) return;
    document.querySelectorAll('.gallery').forEach(gallery => {
      if (gallery.classList.contains('carousel-init')) return;
      gallery.classList.add('carousel-init', 'gallery--carousel');

      // Flatten .gallery-stack children directly into gallery
      const stack = gallery.querySelector('.gallery-stack');
      if (stack) {
        Array.from(stack.querySelectorAll('.gallery-tile')).forEach(t => gallery.appendChild(t));
        stack.remove();
      }
      // Remove .gallery-main so CSS size overrides don't conflict
      gallery.querySelectorAll('.gallery-main').forEach(t => t.classList.remove('gallery-main'));

      const tiles = Array.from(gallery.querySelectorAll('.gallery-tile'));
      let cur = 0;

      // Wrap for nav positioning
      const wrap = document.createElement('div');
      wrap.className = 'gallery-carousel-wrap';
      gallery.parentNode.insertBefore(wrap, gallery);
      wrap.appendChild(gallery);

      // Build prev / next buttons
      const prevBtn = document.createElement('button');
      const nextBtn = document.createElement('button');
      prevBtn.type = nextBtn.type = 'button';
      prevBtn.className = 'gcnav gcnav-prev';
      nextBtn.className = 'gcnav gcnav-next';
      prevBtn.setAttribute('aria-label', 'Previous image');
      nextBtn.setAttribute('aria-label', 'Next image');
      const chevL = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
      const chevR = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
      prevBtn.innerHTML = chevL;
      nextBtn.innerHTML = chevR;
      wrap.appendChild(prevBtn);
      wrap.appendChild(nextBtn);

      const updateNav = () => {
        prevBtn.style.opacity = cur === 0 ? '0.3' : '1';
        nextBtn.style.opacity = cur === tiles.length - 1 ? '0.3' : '1';
      };
      const goTo = (idx) => {
        cur = Math.max(0, Math.min(tiles.length - 1, idx));
        gallery.scrollTo({ left: cur * gallery.offsetWidth, behavior: 'smooth' });
        updateNav();
      };

      prevBtn.addEventListener('click', () => goTo(cur - 1));
      nextBtn.addEventListener('click', () => goTo(cur + 1));
      gallery.addEventListener('scroll', () => {
        cur = Math.round(gallery.scrollLeft / gallery.offsetWidth);
        updateNav();
      }, { passive: true });

      updateNav();
    });
  }
  initGalleryCarousels();

  /* ============================================================
     Floating contact — desktop click/touch toggle
     ============================================================ */
  const floatContact = document.getElementById('floatContact');
  const floatMain    = floatContact && floatContact.querySelector('.float-main');
  if (floatMain) {
    floatMain.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = floatContact.classList.toggle('open');
      floatMain.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!floatContact.contains(e.target)) {
        floatContact.classList.remove('open');
        floatMain.setAttribute('aria-expanded', 'false');
      }
    });
  }

})();

/* ============================================================
   CURRENCY DROPDOWN — static business-editable config.
   To update prices: change the `amount` values in CURRENCIES.
   No live FX rates. No geo-detection.
   ============================================================ */
(() => {
  const sel  = document.getElementById('currSelect');
  if (!sel) return;
  const wrap = sel.closest('.curr-wrap');
  const drop = wrap && wrap.querySelector('.curr-drop');
  if (!drop) return;

  // Icon path differs between EN (root) and AR (subfolder)
  const ICON_BASE = document.documentElement.lang === 'ar' ? '../icons/' : 'icons/';

  // BUSINESS-EDITABLE — static display values, no live FX rates, no geo-detection.
  // To update prices: change the `amount` values below.
  const CURRENCIES = [
    { code: 'AED', symbol: 'د.إ',  amount: '1M',    icon: 'icon-dirham.svg' },
    { code: 'EUR', symbol: '€',    amount: '239K',  icon: 'icon-eur.svg'    },
    { code: 'SAR', symbol: '﷼',   amount: '1.02M', icon: 'icon-sar.svg'    },
    { code: 'OMR', symbol: 'ر.ع.', amount: '105K',  icon: 'icon-omr.svg'    },
    { code: 'KWD', symbol: 'د.ك',  amount: '84K',   icon: 'icon-kwd.svg'    },
    { code: 'INR', symbol: '₹',    amount: '22.7M', icon: 'icon-inr.svg'    },
    { code: 'PKR', symbol: '₨',    amount: '76M',   icon: 'icon-pkr.svg'    },
    { code: 'SGD', symbol: 'S$',   amount: '350K',  icon: 'icon-sgd.svg'    },
  ];

  function closeDrop() {
    drop.classList.remove('open');
    sel.setAttribute('aria-expanded', 'false');
  }
  function openDrop() {
    drop.classList.add('open');
    sel.setAttribute('aria-expanded', 'true');
    const inp = drop.querySelector('.curr-search-input');
    if (inp) {
      inp.value = '';
      filterOpts('');
      // Touch devices: skip auto-focus — iOS Safari opens the keyboard on async focus,
      // scrolling the page and hiding the dropdown before the user can see it.
      if (!('ontouchstart' in window)) setTimeout(() => inp.focus(), 50);
    }
  }

  function render(code) {
    const cur      = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
    const amountEl = document.getElementById('price-amount');
    const iconWrap = wrap.querySelector('.price-dirham-icon');
    const iconImg  = iconWrap && iconWrap.querySelector('img');
    if (!amountEl) return;
    amountEl.textContent = cur.amount;
    if (iconImg) { iconImg.src = ICON_BASE + cur.icon; iconImg.alt = code; }
    wrap.querySelectorAll('.curr-opt').forEach(o =>
      o.classList.toggle('active', o.dataset.currency === code)
    );
  }

  function filterOpts(q) {
    const lq = q.toLowerCase();
    drop.querySelectorAll('.curr-opt').forEach(o => {
      const code = (o.dataset.currency || '').toLowerCase();
      o.style.display = (!lq || code.includes(lq)) ? '' : 'none';
    });
  }

  // Toggle on trigger click
  sel.addEventListener('click', () => {
    drop.classList.contains('open') ? closeDrop() : openDrop();
  });

  // Keyboard
  sel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel.click(); }
    if (e.key === 'Escape') closeDrop();
  });

  // Select option (delegate to drop)
  drop.addEventListener('click', (e) => {
    const opt = e.target.closest('.curr-opt');
    if (!opt) return;
    render(opt.dataset.currency);
    closeDrop();
  });

  // Search
  const searchInp = drop.querySelector('.curr-search-input');
  if (searchInp) {
    searchInp.addEventListener('input', (e) => filterOpts(e.target.value));
    searchInp.addEventListener('click', (e) => e.stopPropagation());
  }

  // Close on outside click — guard prevents close when clicking inside wrap
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) closeDrop();
  });
  // iOS Safari: click doesn't bubble to document on non-interactive elements.
  // touchstart does — use it as a fallback close trigger.
  document.addEventListener('touchstart', (e) => {
    if (!wrap.contains(e.target)) closeDrop();
  }, { passive: true });

  render('AED');
})();
