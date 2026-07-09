// ==========================================================================
// admin.js — Logique du tableau de bord admin AWIT (Firebase Auth + Firestore)
// ==========================================================================

// ---------- Garde d'authentification ----------
auth.onAuthStateChanged((user) => {
  if(!user){
    window.location.href = "admin-login.html";
    return;
  }
  document.getElementById('authGate').style.display = 'none';
  document.getElementById('adminShell').style.display = 'flex';
  document.getElementById('userEmail').textContent = user.email;
  initDashboard();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut().then(() => window.location.href = "admin-login.html");
});

// ---------- Navigation entre panneaux ----------
document.querySelectorAll('.admin-nav button[data-panel]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.admin-nav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.panel).classList.add('active');
  });
});

function fmtDate(ts){
  if(!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
}

// Affiche un texte libre (message, motivation, compétences...) phrase par phrase,
// une phrase par ligne, pour une lecture plus facile dans les tableaux admin.
function formatSentences(text){
  if(!text || !text.trim()) return '—';
  const escaped = text.trim()
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sentences = escaped.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  return sentences.join('<br>');
}
// Enveloppe un contenu dans un bloc à largeur fixe : dans un tableau HTML en
// disposition automatique, un simple max-width sur <td> ne suffit pas toujours
// à forcer le retour à la ligne — un enfant à largeur fixe, si.
function wrapText(html){
  return `<div style="width:220px; white-space:normal; overflow-wrap:break-word;">${html}</div>`;
}

// Construit un bouton WhatsApp à partir d'un numéro stocké (ex: "+213 55 12 34 56")
// et pré-remplit le message avec "Salut Prénom,". Retourne une chaîne vide si aucun numéro n'est disponible.
const WA_ICON_SVG = '<svg viewBox="0 0 32 32" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M16.001 3C9.11 3 3.5 8.611 3.5 15.5c0 2.316.633 4.484 1.734 6.35L3 29l7.335-2.19A12.44 12.44 0 0 0 16.001 28C22.892 28 28.5 22.389 28.5 15.5S22.892 3 16.001 3zm0 22.7c-1.99 0-3.86-.55-5.46-1.51l-.39-.23-4.35 1.3 1.32-4.24-.25-.4a10.18 10.18 0 0 1-1.57-5.42c0-5.64 4.6-10.24 10.24-10.24 5.63 0 10.24 4.6 10.24 10.24 0 5.63-4.61 10.24-10.24 10.24zm5.6-7.67c-.31-.15-1.82-.9-2.1-1-.28-.1-.49-.15-.69.15-.2.31-.79 1-.97 1.2-.18.21-.36.23-.66.08-.31-.15-1.3-.48-2.47-1.53-.91-.81-1.53-1.82-1.71-2.12-.18-.31-.02-.47.13-.62.14-.14.31-.36.46-.54.15-.18.2-.31.31-.51.1-.21.05-.39-.02-.54-.08-.15-.69-1.67-.95-2.28-.25-.6-.5-.52-.69-.53-.18-.01-.39-.01-.6-.01-.2 0-.54.08-.82.39-.28.31-1.08 1.05-1.08 2.57 0 1.51 1.1 2.98 1.26 3.19.15.21 2.17 3.32 5.27 4.65.74.32 1.31.51 1.76.65.74.23 1.41.2 1.94.12.59-.09 1.82-.74 2.08-1.46.26-.71.26-1.32.18-1.45-.08-.13-.28-.2-.59-.36z"/></svg>';
function waBtn(telephone, nom){
  if(!telephone) return '';
  const digits = telephone.replace(/[^\d]/g, ''); // garde uniquement les chiffres pour wa.me
  if(!digits) return '';
  const prenom = (nom || '').trim().split(' ')[0] || '';
  const message = `Salut ${prenom},`.trim();
  const text = encodeURIComponent(message);
  return `<a href="https://wa.me/${digits}?text=${text}" target="_blank" rel="noopener" class="wa-btn" title="Contacter sur WhatsApp">${WA_ICON_SVG} WhatsApp</a>`;
}

let initDone = false;
function initDashboard(){
  if(initDone) return;
  initDone = true;
  loadActualites();
  loadPhotos();
  loadBenevoles();
  loadMessages();
  loadDons();
}

// ==========================================================================
// TABLEAU DE BORD — statistiques (mises à jour en temps réel par chaque listener ci-dessous)
// ==========================================================================
const statsData = { actualites:0, benevoles:0, messages:0, dons:0, benevolesNouveaux:0, messagesNouveaux:0, donsNouveaux:0 };
function updateStatsDisplay(){
  document.getElementById('statActualites').textContent = statsData.actualites;
  document.getElementById('statBenevoles').textContent = statsData.benevoles;
  document.getElementById('statMessages').textContent = statsData.messages;
  document.getElementById('statDons').textContent = statsData.dons;
  updateBadge('badgeBenevoles', statsData.benevolesNouveaux);
  updateBadge('badgeMessages', statsData.messagesNouveaux);
  updateBadge('badgeDons', statsData.donsNouveaux);
}
function updateBadge(id, n){
  const el = document.getElementById(id);
  if(n > 0){ el.textContent = n; el.style.display = 'inline-block'; }
  else{ el.style.display = 'none'; }
}

// ==========================================================================
// ACTUALITES
// ==========================================================================
const actuForm = document.getElementById('actuForm');
document.getElementById('newActuBtn').addEventListener('click', () => {
  actuForm.reset(); document.getElementById('actuId').value = '';
  actuForm.style.display = 'block';
});
document.getElementById('cancelActuBtn').addEventListener('click', () => actuForm.style.display = 'none');

actuForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('actuUploadStatus');
  const id = document.getElementById('actuId').value;
  const imgUrl = document.getElementById('actuImgUrl').value.trim();
  try{
    const payload = {
      titre: document.getElementById('actuTitre').value.trim(),
      tag: document.getElementById('actuTag').value,
      texte: document.getElementById('actuTexte').value.trim(),
      image: imgUrl || '',
      date: firebase.firestore.FieldValue.serverTimestamp()
    };
    if(id){
      await db.collection('actualites').doc(id).update(payload);
    } else {
      await db.collection('actualites').add(payload);
    }
    status.textContent = "";
    actuForm.style.display = 'none';
  }catch(err){
    status.textContent = "Erreur : " + err.message;
  }
});

let actuSnap = null;
function loadActualites(){
  const tbody = document.getElementById('actuTableBody');
  db.collection('actualites').orderBy('date', 'desc').onSnapshot(snap => {
    actuSnap = snap;
    statsData.actualites = snap.size;
    updateStatsDisplay();
    if(snap.empty){ tbody.innerHTML = '<tr><td colspan="5" class="admin-empty">Aucune actualité pour le moment. Cliquez sur "+ Nouvelle actualité" pour commencer.</td></tr>'; return; }
    tbody.innerHTML = '';
    snap.forEach(doc => {
      const a = doc.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${a.image ? `<img class="thumb" src="${a.image}" alt="">` : '—'}</td>
        <td>${a.titre || ''}</td>
        <td><span class="tag">${a.tag || ''}</span></td>
        <td>${fmtDate(a.date)}</td>
        <td class="row-actions">
          <button data-edit="${doc.id}">Modifier</button>
          <button data-del="${doc.id}" class="danger">Supprimer</button>
        </td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => editActu(b.dataset.edit, actuSnap)));
    tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => delDoc('actualites', b.dataset.del)));
  }, err => {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty">Impossible de charger les actualités : ${err.message}</td></tr>`;
  });
}
function editActu(id, snap){
  const doc = snap.docs.find(d => d.id === id);
  const a = doc.data();
  document.getElementById('actuId').value = id;
  document.getElementById('actuTitre').value = a.titre || '';
  document.getElementById('actuTag').value = a.tag || 'Événement';
  document.getElementById('actuTexte').value = a.texte || '';
  document.getElementById('actuImgUrl').value = a.image || '';
  actuForm.style.display = 'block';
  actuForm.scrollIntoView({ behavior:'smooth' });
}

// ==========================================================================
// GALERIE
// ==========================================================================
const photoForm = document.getElementById('photoForm');
document.getElementById('newPhotoBtn').addEventListener('click', () => {
  photoForm.reset(); document.getElementById('photoId').value = '';
  photoForm.style.display = 'block';
});
document.getElementById('cancelPhotoBtn').addEventListener('click', () => photoForm.style.display = 'none');

photoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('photoUploadStatus');
  const id = document.getElementById('photoId').value;
  const imgUrl = document.getElementById('photoImgUrl').value.trim();
  try{
    if(!imgUrl){ status.textContent = "Ajoutez le lien de l'image."; return; }
    const payload = {
      legende: document.getElementById('photoLegende').value.trim(),
      categorie: document.getElementById('photoCat').value,
      image: imgUrl,
      date: firebase.firestore.FieldValue.serverTimestamp()
    };
    if(id){
      await db.collection('galerie').doc(id).update(payload);
    } else {
      await db.collection('galerie').add(payload);
    }
    status.textContent = "";
    photoForm.style.display = 'none';
  }catch(err){
    status.textContent = "Erreur : " + err.message;
  }
});

let photosSnap = null;
function loadPhotos(){
  const tbody = document.getElementById('photoTableBody');
  db.collection('galerie').orderBy('date', 'desc').onSnapshot(snap => {
    photosSnap = snap;
    if(snap.empty){ tbody.innerHTML = '<tr><td colspan="4" class="admin-empty">Aucune photo ajoutée depuis l\'admin. Les photos du site de départ restent visibles dans galerie.html.</td></tr>'; return; }
    tbody.innerHTML = '';
    snap.forEach(doc => {
      const p = doc.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img class="thumb" src="${p.image}" alt=""></td>
        <td>${p.legende || ''}</td>
        <td><span class="tag">${p.categorie || ''}</span></td>
        <td class="row-actions">
          <button data-edit="${doc.id}">Modifier</button>
          <button data-del="${doc.id}" class="danger">Supprimer</button>
        </td>`;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => editPhoto(b.dataset.edit, photosSnap)));
    tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => delDoc('galerie', b.dataset.del)));
  }, err => {
    tbody.innerHTML = `<tr><td colspan="4" class="admin-empty">Impossible de charger la galerie : ${err.message}</td></tr>`;
  });
}
function editPhoto(id, snap){
  const doc = snap.docs.find(d => d.id === id);
  const p = doc.data();
  document.getElementById('photoId').value = id;
  document.getElementById('photoLegende').value = p.legende || '';
  document.getElementById('photoCat').value = p.categorie || 'ateliers';
  document.getElementById('photoImgUrl').value = p.image || '';
  photoForm.style.display = 'block';
  photoForm.scrollIntoView({ behavior:'smooth' });
}

// ==========================================================================
// FILTRES MOIS / ANNÉE (partagés entre bénévoles, messages, dons)
// ==========================================================================
const MOIS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function docDateParts(ts){
  if(!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return { mois: d.getMonth(), annee: d.getFullYear() };
}

function populateFilterOptions(items, moisSelectId, anneeSelectId){
  const moisSelect = document.getElementById(moisSelectId);
  const anneeSelect = document.getElementById(anneeSelectId);
  const anneesPresentes = new Set();
  items.forEach(it => { const p = docDateParts(it.data.date); if(p) anneesPresentes.add(p.annee); });

  if(moisSelect.options.length <= 1){
    MOIS_FR.forEach((nom, i) => {
      const opt = document.createElement('option');
      opt.value = i; opt.textContent = nom;
      moisSelect.appendChild(opt);
    });
  }
  const currentAnneeOptions = new Set(Array.from(anneeSelect.options).map(o => o.value));
  Array.from(anneesPresentes).sort((a,b) => b - a).forEach(an => {
    if(!currentAnneeOptions.has(String(an))){
      const opt = document.createElement('option');
      opt.value = an; opt.textContent = an;
      anneeSelect.appendChild(opt);
    }
  });
}

function filterByMoisAnnee(items, moisSelectId, anneeSelectId){
  const mois = document.getElementById(moisSelectId).value;
  const annee = document.getElementById(anneeSelectId).value;
  if(mois === '' && annee === '') return items;
  return items.filter(it => {
    const p = docDateParts(it.data.date);
    if(!p) return false;
    if(mois !== '' && p.mois !== Number(mois)) return false;
    if(annee !== '' && p.annee !== Number(annee)) return false;
    return true;
  });
}

// ==========================================================================
// BENEVOLES (lecture + changement de statut + filtre mois/année)
// ==========================================================================
let benevolesCache = [];
function loadBenevoles(){
  const tbody = document.getElementById('benevolesTableBody');
  db.collection('benevoles').orderBy('date', 'desc').onSnapshot(snap => {
    benevolesCache = snap.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    statsData.benevoles = snap.size;
    statsData.benevolesNouveaux = benevolesCache.filter(b => (b.data.statut || 'nouveau') === 'nouveau').length;
    updateStatsDisplay();
    populateFilterOptions(benevolesCache, 'filterMoisBenevoles', 'filterAnneeBenevoles');
    renderBenevoles();
  }, err => {
    tbody.innerHTML = `<tr><td colspan="8" class="admin-empty">Impossible de charger les candidatures : ${err.message}</td></tr>`;
  });
}
function renderBenevoles(){
  const tbody = document.getElementById('benevolesTableBody');
  const items = filterByMoisAnnee(benevolesCache, 'filterMoisBenevoles', 'filterAnneeBenevoles');
  if(items.length === 0){ tbody.innerHTML = '<tr><td colspan="8" class="admin-empty">Aucune candidature pour cette période.</td></tr>'; return; }
  tbody.innerHTML = '';
  items.forEach(({ id, data: b }) => {
    const statut = b.statut || 'nouveau';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${b.prenom || ''} ${b.nom || ''}</strong><br><span class="small">${fmtDate(b.date)}</span></td>
      <td>${b.email || ''}<br><span class="small">${b.telephone || ''}</span></td>
      <td>${b.ville || '—'}</td>
      <td>${b.competences ? wrapText(formatSentences(b.competences)) : '—'}</td>
      <td>${b.disponibilites || '—'}</td>
      <td>${b.motivation ? wrapText(formatSentences(b.motivation)) : '—'}</td>
      <td><span class="pill ${statut==='contacté' ? 'pill-done' : 'pill-new'}">${statut}</span></td>
      <td class="row-actions">
        <button data-toggle="${id}" data-current="${statut}">${statut==='contacté' ? 'Marquer nouveau' : 'Marquer contacté'}</button>
        ${waBtn(b.telephone, b.prenom || b.nom)}
        <button data-del="${id}" class="danger">Supprimer</button>
      </td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
    const next = b.dataset.current === 'contacté' ? 'nouveau' : 'contacté';
    db.collection('benevoles').doc(b.dataset.toggle).update({ statut: next });
  }));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => delDoc('benevoles', b.dataset.del)));
}
document.getElementById('filterMoisBenevoles').addEventListener('change', renderBenevoles);
document.getElementById('filterAnneeBenevoles').addEventListener('change', renderBenevoles);
document.getElementById('resetFilterBenevoles').addEventListener('click', () => {
  document.getElementById('filterMoisBenevoles').value = '';
  document.getElementById('filterAnneeBenevoles').value = '';
  renderBenevoles();
});

// ==========================================================================
// MESSAGES (lecture + changement de statut + filtre mois/année)
// ==========================================================================
let messagesCache = [];
function loadMessages(){
  const tbody = document.getElementById('messagesTableBody');
  db.collection('messages').orderBy('date', 'desc').onSnapshot(snap => {
    messagesCache = snap.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    statsData.messages = snap.size;
    statsData.messagesNouveaux = messagesCache.filter(m => (m.data.statut || 'nouveau') === 'nouveau').length;
    updateStatsDisplay();
    populateFilterOptions(messagesCache, 'filterMoisMessages', 'filterAnneeMessages');
    renderMessages();
  }, err => {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty">Impossible de charger les messages : ${err.message}</td></tr>`;
  });
}
function renderMessages(){
  const tbody = document.getElementById('messagesTableBody');
  const items = filterByMoisAnnee(messagesCache, 'filterMoisMessages', 'filterAnneeMessages');
  if(items.length === 0){ tbody.innerHTML = '<tr><td colspan="5" class="admin-empty">Aucun message pour cette période.</td></tr>'; return; }
  tbody.innerHTML = '';
  items.forEach(({ id, data: m }) => {
    const statut = m.statut || 'nouveau';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${m.nom || ''}</strong><br><span class="small">${fmtDate(m.date)}</span></td>
      <td>${m.email || ''}<br><span class="small">${m.telephone || ''}</span></td>
      <td><strong>${m.sujet || ''}</strong><br><span class="small">${wrapText(formatSentences(m.message))}</span></td>
      <td><span class="pill ${statut==='lu' ? 'pill-done' : 'pill-new'}">${statut}</span></td>
      <td class="row-actions">
        <button data-toggle="${id}" data-current="${statut}">${statut==='lu' ? 'Marquer non lu' : 'Marquer lu'}</button>
        ${waBtn(m.telephone, m.nom)}
        <button data-del="${id}" class="danger">Supprimer</button>
      </td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
    const next = b.dataset.current === 'lu' ? 'nouveau' : 'lu';
    db.collection('messages').doc(b.dataset.toggle).update({ statut: next });
  }));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => delDoc('messages', b.dataset.del)));
}
document.getElementById('filterMoisMessages').addEventListener('change', renderMessages);
document.getElementById('filterAnneeMessages').addEventListener('change', renderMessages);
document.getElementById('resetFilterMessages').addEventListener('click', () => {
  document.getElementById('filterMoisMessages').value = '';
  document.getElementById('filterAnneeMessages').value = '';
  renderMessages();
});

// ==========================================================================
// DONS (lecture + changement de statut + filtre mois/année)
// ==========================================================================
let donsCache = [];
function loadDons(){
  const tbody = document.getElementById('donsTableBody');
  db.collection('dons').orderBy('date', 'desc').onSnapshot(snap => {
    donsCache = snap.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    statsData.dons = snap.size;
    statsData.donsNouveaux = donsCache.filter(d => (d.data.statut || 'déclaré') === 'déclaré').length;
    updateStatsDisplay();
    populateFilterOptions(donsCache, 'filterMoisDons', 'filterAnneeDons');
    renderDons();
  }, err => {
    tbody.innerHTML = `<tr><td colspan="6" class="admin-empty">Impossible de charger les dons : ${err.message}</td></tr>`;
  });
}
function renderDons(){
  const tbody = document.getElementById('donsTableBody');
  const items = filterByMoisAnnee(donsCache, 'filterMoisDons', 'filterAnneeDons');
  if(items.length === 0){ tbody.innerHTML = '<tr><td colspan="6" class="admin-empty">Aucun don pour cette période.</td></tr>'; return; }
  tbody.innerHTML = '';
  items.forEach(({ id, data: d }) => {
    const statut = d.statut || 'déclaré';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${d.nom || ''}</strong><br><span class="small">${fmtDate(d.date)}</span></td>
      <td>${d.email || ''}<br><span class="small">${d.telephone || ''}</span></td>
      <td><strong>${d.montant || ''} DA</strong></td>
      <td>${d.methode || ''}</td>
      <td><span class="pill ${statut==='reçu' ? 'pill-done' : 'pill-new'}">${statut}</span></td>
      <td class="row-actions">
        <button data-toggle="${id}" data-current="${statut}">${statut==='reçu' ? 'Marquer déclaré' : 'Marquer reçu'}</button>
        ${waBtn(d.telephone, d.nom)}
        <button data-del="${id}" class="danger">Supprimer</button>
      </td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
    const next = b.dataset.current === 'reçu' ? 'déclaré' : 'reçu';
    db.collection('dons').doc(b.dataset.toggle).update({ statut: next });
  }));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => delDoc('dons', b.dataset.del)));
}
document.getElementById('filterMoisDons').addEventListener('change', renderDons);
document.getElementById('filterAnneeDons').addEventListener('change', renderDons);
document.getElementById('resetFilterDons').addEventListener('click', () => {
  document.getElementById('filterMoisDons').value = '';
  document.getElementById('filterAnneeDons').value = '';
  renderDons();
});

// ---------- Suppression générique ----------
function delDoc(collection, id){
  if(!confirm("Confirmer la suppression ? Cette action est définitive.")) return;
  db.collection(collection).doc(id).delete();
}
