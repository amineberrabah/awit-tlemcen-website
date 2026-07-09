// ==========================================================================
// Association Trisomie 21 Algérie — script.js
// Navigation, accessibilité, animations, galerie, formulaires, don
// ==========================================================================

// ==========================================================================
// Téléphone : normalisation partagée (don.html, contact.html, benevole.html)
// Nettoie la saisie, retire le 0 initial du format local (déjà représenté
// par l'indicatif pays) et combine proprement indicatif + numéro.
// ==========================================================================
const COUNTRY_PHONE_CODES = [["+93","🇦🇫","Afghanistan"],["+27","🇿🇦","Afrique du Sud"],["+35818","🇦🇽","Ahvenanmaa"],["+355","🇦🇱","Albanie"],["+213","🇩🇿","Algérie"],["+49","🇩🇪","Allemagne"],["+376","🇦🇩","Andorre"],["+244","🇦🇴","Angola"],["+1264","🇦🇮","Anguilla"],["+1268","🇦🇬","Antigua-et-Barbuda"],["+966","🇸🇦","Arabie Saoudite"],["+54","🇦🇷","Argentine"],["+374","🇦🇲","Arménie"],["+297","🇦🇼","Aruba"],["+61","🇦🇺","Australie"],["+43","🇦🇹","Autriche"],["+994","🇦🇿","Azerbaïdjan"],["+1242","🇧🇸","Bahamas"],["+973","🇧🇭","Bahreïn"],["+880","🇧🇩","Bangladesh"],["+1246","🇧🇧","Barbade"],["+32","🇧🇪","Belgique"],["+501","🇧🇿","Belize"],["+229","🇧🇯","Bénin"],["+1441","🇧🇲","Bermudes"],["+975","🇧🇹","Bhoutan"],["+375","🇧🇾","Biélorussie"],["+95","🇲🇲","Birmanie"],["+591","🇧🇴","Bolivie"],["+387","🇧🇦","Bosnie-Herzégovine"],["+267","🇧🇼","Botswana"],["+55","🇧🇷","Brésil"],["+673","🇧🇳","Brunei"],["+359","🇧🇬","Bulgarie"],["+226","🇧🇫","Burkina Faso"],["+257","🇧🇮","Burundi"],["+855","🇰🇭","Cambodge"],["+237","🇨🇲","Cameroun"],["+1","🇨🇦","Canada"],["+56","🇨🇱","Chili"],["+86","🇨🇳","Chine"],["+357","🇨🇾","Chypre"],["+3","🇻🇦","Cité du Vatican"],["+57","🇨🇴","Colombie"],["+269","🇰🇲","Comores"],["+242","🇨🇬","Congo"],["+243","🇨🇩","Congo (Rép. dém.)"],["+850","🇰🇵","Corée du Nord"],["+82","🇰🇷","Corée du Sud"],["+506","🇨🇷","Costa Rica"],["+225","🇨🇮","Côte d'Ivoire"],["+385","🇭🇷","Croatie"],["+53","🇨🇺","Cuba"],["+599","🇨🇼","Curaçao"],["+45","🇩🇰","Danemark"],["+253","🇩🇯","Djibouti"],["+1767","🇩🇲","Dominique"],["+20","🇪🇬","Égypte"],["+971","🇦🇪","Émirats arabes unis"],["+593","🇪🇨","Équateur"],["+291","🇪🇷","Érythrée"],["+34","🇪🇸","Espagne"],["+372","🇪🇪","Estonie"],["+1","🇺🇸","États-Unis"],["+251","🇪🇹","Éthiopie"],["+679","🇫🇯","Fidji"],["+358","🇫🇮","Finlande"],["+33","🇫🇷","France"],["+241","🇬🇦","Gabon"],["+220","🇬🇲","Gambie"],["+995","🇬🇪","Géorgie"],["+500","🇬🇸","Géorgie du Sud-et-les Îles Sandwich du Sud"],["+233","🇬🇭","Ghana"],["+350","🇬🇮","Gibraltar"],["+30","🇬🇷","Grèce"],["+1473","🇬🇩","Grenade"],["+299","🇬🇱","Groenland"],["+590","🇬🇵","Guadeloupe"],["+1671","🇬🇺","Guam"],["+502","🇬🇹","Guatemala"],["+44","🇬🇬","Guernesey"],["+224","🇬🇳","Guinée"],["+240","🇬🇶","Guinée équatoriale"],["+245","🇬🇼","Guinée-Bissau"],["+592","🇬🇾","Guyana"],["+594","🇬🇫","Guyane"],["+509","🇭🇹","Haïti"],["+504","🇭🇳","Honduras"],["+852","🇭🇰","Hong Kong"],["+36","🇭🇺","Hongrie"],["+47","🇧🇻","Île Bouvet"],["+61","🇨🇽","Île Christmas"],["+44","🇮🇲","Île de Man"],["+230","🇲🇺","Île Maurice"],["+672","🇳🇫","Île Norfolk"],["+1345","🇰🇾","Îles Caïmans"],["+61","🇨🇨","Îles Cocos"],["+682","🇨🇰","Îles Cook"],["+238","🇨🇻","Îles du Cap-Vert"],["+298","🇫🇴","Îles Féroé"],["+500","🇫🇰","Îles Malouines"],["+1670","🇲🇵","Îles Mariannes du Nord"],["+692","🇲🇭","Îles Marshall"],["+268","🇺🇲","Îles mineures éloignées des États-Unis"],["+64","🇵🇳","Îles Pitcairn"],["+677","🇸🇧","Îles Salomon"],["+1649","🇹🇨","Îles Turques-et-Caïques"],["+1284","🇻🇬","Îles Vierges britanniques"],["+1340","🇻🇮","Îles Vierges des États-Unis"],["+91","🇮🇳","Inde"],["+62","🇮🇩","Indonésie"],["+964","🇮🇶","Irak"],["+98","🇮🇷","Iran"],["+353","🇮🇪","Irlande"],["+354","🇮🇸","Islande"],["+972","🇮🇱","Israël"],["+39","🇮🇹","Italie"],["+1876","🇯🇲","Jamaïque"],["+81","🇯🇵","Japon"],["+44","🇯🇪","Jersey"],["+962","🇯🇴","Jordanie"],["+7","🇰🇿","Kazakhstan"],["+254","🇰🇪","Kenya"],["+996","🇰🇬","Kirghizistan"],["+686","🇰🇮","Kiribati"],["+383","🇽🇰","Kosovo"],["+965","🇰🇼","Koweït"],["+856","🇱🇦","Laos"],["+266","🇱🇸","Lesotho"],["+371","🇱🇻","Lettonie"],["+961","🇱🇧","Liban"],["+231","🇱🇷","Liberia"],["+218","🇱🇾","Libye"],["+423","🇱🇮","Liechtenstein"],["+370","🇱🇹","Lituanie"],["+352","🇱🇺","Luxembourg"],["+853","🇲🇴","Macao"],["+389","🇲🇰","Macédoine du Nord"],["+261","🇲🇬","Madagascar"],["+60","🇲🇾","Malaisie"],["+265","🇲🇼","Malawi"],["+960","🇲🇻","Maldives"],["+223","🇲🇱","Mali"],["+356","🇲🇹","Malte"],["+212","🇲🇦","Maroc"],["+596","🇲🇶","Martinique"],["+222","🇲🇷","Mauritanie"],["+262","🇾🇹","Mayotte"],["+52","🇲🇽","Mexique"],["+691","🇫🇲","Micronésie"],["+373","🇲🇩","Moldavie"],["+377","🇲🇨","Monaco"],["+976","🇲🇳","Mongolie"],["+382","🇲🇪","Monténégro"],["+1664","🇲🇸","Montserrat"],["+258","🇲🇿","Mozambique"],["+264","🇳🇦","Namibie"],["+674","🇳🇷","Nauru"],["+977","🇳🇵","Népal"],["+505","🇳🇮","Nicaragua"],["+227","🇳🇪","Niger"],["+234","🇳🇬","Nigéria"],["+683","🇳🇺","Niue"],["+47","🇳🇴","Norvège"],["+687","🇳🇨","Nouvelle-Calédonie"],["+64","🇳🇿","Nouvelle-Zélande"],["+968","🇴🇲","Oman"],["+256","🇺🇬","Ouganda"],["+998","🇺🇿","Ouzbékistan"],["+92","🇵🇰","Pakistan"],["+680","🇵🇼","Palaos (Palau)"],["+970","🇵🇸","Palestine"],["+507","🇵🇦","Panama"],["+675","🇵🇬","Papouasie-Nouvelle-Guinée"],["+595","🇵🇾","Paraguay"],["+31","🇳🇱","Pays-Bas"],["+599","","Pays-Bas caribéens"],["+51","🇵🇪","Pérou"],["+63","🇵🇭","Philippines"],["+48","🇵🇱","Pologne"],["+689","🇵🇫","Polynésie française"],["+1","🇵🇷","Porto Rico"],["+351","🇵🇹","Portugal"],["+974","🇶🇦","Qatar"],["+236","🇨🇫","République centrafricaine"],["+1","🇩🇴","République dominicaine"],["+262","🇷🇪","Réunion"],["+40","🇷🇴","Roumanie"],["+44","🇬🇧","Royaume-Uni"],["+7","🇷🇺","Russie"],["+250","🇷🇼","Rwanda"],["+2","🇪🇭","Sahara Occidental"],["+590","🇧🇱","Saint-Barthélemy"],["+1869","🇰🇳","Saint-Christophe-et-Niévès"],["+378","🇸🇲","Saint-Marin"],["+590","🇲🇫","Saint-Martin"],["+1721","🇸🇽","Saint-Martin"],["+508","🇵🇲","Saint-Pierre-et-Miquelon"],["+1784","🇻🇨","Saint-Vincent-et-les-Grenadines"],["+2","🇸🇭","Sainte-Hélène, Ascension et Tristan da Cunha"],["+1758","🇱🇨","Sainte-Lucie"],["+503","🇸🇻","Salvador"],["+685","🇼🇸","Samoa"],["+1684","🇦🇸","Samoa américaines"],["+239","🇸🇹","São Tomé et Príncipe"],["+221","🇸🇳","Sénégal"],["+381","🇷🇸","Serbie"],["+248","🇸🇨","Seychelles"],["+232","🇸🇱","Sierra Leone"],["+65","🇸🇬","Singapour"],["+421","🇸🇰","Slovaquie"],["+386","🇸🇮","Slovénie"],["+252","🇸🇴","Somalie"],["+249","🇸🇩","Soudan"],["+211","🇸🇸","Soudan du Sud"],["+94","🇱🇰","Sri Lanka"],["+46","🇸🇪","Suède"],["+41","🇨🇭","Suisse"],["+597","🇸🇷","Surinam"],["+4779","🇸🇯","Svalbard et Jan Mayen"],["+268","🇸🇿","Swaziland"],["+963","🇸🇾","Syrie"],["+992","🇹🇯","Tadjikistan"],["+886","🇹🇼","Taïwan"],["+255","🇹🇿","Tanzanie"],["+235","🇹🇩","Tchad"],["+420","🇨🇿","Tchéquie"],["+262","🇹🇫","Terres australes et antarctiques françaises"],["+246","🇮🇴","Territoire britannique de l'océan Indien"],["+66","🇹🇭","Thaïlande"],["+670","🇹🇱","Timor oriental"],["+228","🇹🇬","Togo"],["+690","🇹🇰","Tokelau"],["+676","🇹🇴","Tonga"],["+1868","🇹🇹","Trinité-et-Tobago"],["+216","🇹🇳","Tunisie"],["+993","🇹🇲","Turkménistan"],["+90","🇹🇷","Turquie"],["+688","🇹🇻","Tuvalu"],["+380","🇺🇦","Ukraine"],["+598","🇺🇾","Uruguay"],["+678","🇻🇺","Vanuatu"],["+58","🇻🇪","Venezuela"],["+84","🇻🇳","Viêt Nam"],["+681","🇼🇫","Wallis-et-Futuna"],["+967","🇾🇪","Yémen"],["+260","🇿🇲","Zambie"],["+263","🇿🇼","Zimbabwe"]];

// Remplit tous les sélecteurs d'indicatif pays (class="phone-code-select") avec la liste ci-dessus,
// triée alphabétiquement (fr), drapeau + indicatif + nom. Garde/force la valeur par défaut sur l'attribut data-default (Algérie).
function populatePhoneCodeSelects(){
  document.querySelectorAll('select.phone-code-select').forEach(select => {
    const defaultDial = select.dataset.default || '+213';
    select.innerHTML = '';
    COUNTRY_PHONE_CODES.forEach(([dial, flag, name]) => {
      const opt = document.createElement('option');
      opt.value = dial;
      opt.textContent = `${flag} ${dial} ${name}`;
      if(dial === defaultDial) opt.selected = true;
      select.appendChild(opt);
    });
  });
}

function normalizePhone(indicatif, saisie){
  let digits = (saisie || '').replace(/\D/g, '');   // ne garde que les chiffres
  digits = digits.replace(/^0+/, '');                // retire le(s) 0 initial(aux) du format local
  return digits ? `${indicatif} ${digits}` : '';
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Barre de progression de lecture ---------- */
  const scrollBar = document.getElementById('scrollProgress');
  if(scrollBar){
    const updateScrollBar = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateScrollBar, { passive:true });
    window.addEventListener('resize', updateScrollBar);
    updateScrollBar();
  }

  /* ---------- Navigation mobile ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------- Barre d'accessibilité ---------- */
  const a11yToggle = document.querySelector('.a11y-toggle');
  const a11yPanel  = document.querySelector('.a11y-panel');
  if(a11yToggle && a11yPanel){
    a11yToggle.addEventListener('click', () => a11yPanel.classList.toggle('open'));
  }

  const body = document.body;
  const applyState = (state) => {
    body.classList.toggle('dark', state.dark);
    body.classList.toggle('contraste-eleve', state.contraste);
    body.classList.remove('texte-lg','texte-xl');
    if(state.taille === 'lg') body.classList.add('texte-lg');
    if(state.taille === 'xl') body.classList.add('texte-xl');
    document.querySelectorAll('[data-a11y]').forEach(btn => {
      const key = btn.dataset.a11y, val = btn.dataset.val;
      let isOn = false;
      if(key === 'dark') isOn = state.dark && val === 'on';
      if(key === 'contraste') isOn = state.contraste && val === 'on';
      if(key === 'taille') isOn = state.taille === val;
      btn.classList.toggle('on', isOn);
    });
  };
  const getState = () => {
    try {
      return JSON.parse(localStorage.getItem('a11yState') || '{"dark":false,"contraste":false,"taille":"normal"}');
    } catch(e) {
      return { dark:false, contraste:false, taille:'normal' };
    }
  };
  const saveState = (s) => {
    try { localStorage.setItem('a11yState', JSON.stringify(s)); } catch(e) { /* localStorage indisponible (ex: file://) */ }
    applyState(s);
  };
  let state = getState();
  applyState(state);

  document.querySelectorAll('[data-a11y]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.a11y, val = btn.dataset.val;
      if(key === 'dark') state.dark = val === 'on' ? !state.dark : false;
      if(key === 'contraste') state.contraste = val === 'on' ? !state.contraste : false;
      if(key === 'taille') state.taille = val;
      saveState(state);
    });
  });

  const speakBtn = document.querySelector('[data-a11y-speak]');
  if(speakBtn){
    speakBtn.addEventListener('click', () => {
      if(!('speechSynthesis' in window)){ alert("La lecture vocale n'est pas disponible sur ce navigateur."); return; }
      const main = document.querySelector('main') || document.body;
      const text = main.innerText.slice(0, 4000);
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'fr-FR';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    });
  }

  /* ---------- Champs téléphone : n'autoriser que chiffres et espaces à la saisie ---------- */
  populatePhoneCodeSelects();
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => {
      const cleaned = input.value.replace(/[^\d\s]/g, '');
      if(cleaned !== input.value) input.value = cleaned;
    });
  });

  /* ---------- Compteur de caractères pour les champs avec maxlength (message, motivation, compétences...) ---------- */
  document.querySelectorAll('[maxlength]').forEach(field => {
    const max = field.getAttribute('maxlength');
    const counter = document.createElement('div');
    counter.className = 'char-counter small';
    counter.style.textAlign = 'right';
    counter.style.marginTop = '4px';
    const updateCounter = () => { counter.textContent = `${field.value.length} / ${max}`; };
    field.insertAdjacentElement('afterend', counter);
    updateCounter();
    field.addEventListener('input', updateCounter);
  });

  /* ---------- Marquer le lien de navigation actif ---------- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.getAttribute('href') === here) a.classList.add('active');
  });

  /* ---------- Animation au défilement ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold:.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Compteurs animés (chiffres clés) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString('fr-FR') + suffix;
        if(p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if('IntersectionObserver' in window){
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting){ animateCount(e.target); io2.unobserve(e.target); } });
      }, { threshold:.4 });
      counters.forEach(c => io2.observe(c));
    } else counters.forEach(animateCount);
  }

  /* ---------- Galerie : filtres + lightbox (délégation, compatible avec les photos ajoutées dynamiquement) ---------- */
  const filterBar = document.querySelector('.filters');
  const galleryGrid = document.querySelector('.gallery-grid');
  let activeFilter = 'tous';
  function applyGalleryFilter(){
    if(!galleryGrid) return;
    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
      item.hidden = !(activeFilter === 'tous' || item.dataset.cat === activeFilter);
    });
  }
  if(filterBar){
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if(!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyGalleryFilter();
    });
  }
  // Ré-applique le filtre courant quand des photos sont ajoutées dynamiquement (ex: depuis l'admin)
  if(galleryGrid && 'MutationObserver' in window){
    new MutationObserver(applyGalleryFilter).observe(galleryGrid, { childList:true });
  }

  const lightbox = document.querySelector('.lightbox');
  if(lightbox){
    const lbImg = lightbox.querySelector('img');
    document.addEventListener('click', (e) => {
      const img = e.target.closest('.gallery-item img');
      if(!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
    });
    lightbox.addEventListener('click', (e) => { if(e.target !== lbImg) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') lightbox.classList.remove('open'); });
    const lbClose = lightbox.querySelector('.lightbox-close');
    if(lbClose) lbClose.addEventListener('click', () => lightbox.classList.remove('open'));
  }

  /* ---------- FAQ accordéon ---------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Page Don : montants et méthodes ---------- */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('montant-perso');
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if(customAmount) customAmount.value = btn.dataset.amount;
    });
  });
  if(customAmount){
    customAmount.addEventListener('input', () => amountBtns.forEach(b => b.classList.remove('active')));
  }
  const payChips = document.querySelectorAll('.pay-chip');
  payChips.forEach(chip => {
    chip.addEventListener('click', () => {
      payChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  /* ---------- Barre de progression des dons ---------- */
  const fill = document.querySelector('.progress-fill');
  if(fill){
    const goal = parseInt(fill.dataset.goal, 10);
    const current = parseInt(fill.dataset.current, 10);
    const pct = Math.min(100, Math.round((current / goal) * 100));
    if('IntersectionObserver' in window){
      const io3 = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting){ fill.style.width = pct + '%'; io3.unobserve(e.target); } });
      }, { threshold:.4 });
      io3.observe(fill);
    } else fill.style.width = pct + '%';
  }

  /* ---------- Soumission des formulaires (démo, sans backend) ---------- */
  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-msg');
      if(msg){
        msg.classList.add('ok');
        form.querySelectorAll('input, textarea, select').forEach(f => { if(f.type !== 'submit') f.value=''; });
      }
    });
  });

});