# AWIT — Mise en place de l'espace admin (Firebase)

Le site utilise **Firebase** (comme pour AutoDrive) : Firestore pour stocker les données, Authentication pour protéger l'accès admin. Aucun serveur à héberger — tout tourne depuis les fichiers statiques du site, y compris sur Vercel/Netlify.

## 1. Créer le projet Firebase

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com) et créez un nouveau projet (ex. `awit-tlemcen`).
2. Dans **Compilation > Authentication**, activez le fournisseur **Email/Mot de passe**.
3. Dans **Compilation > Firestore Database**, créez une base **en mode production**.
4. Dans **Paramètres du projet > Vos applications**, ajoutez une application Web et copiez la config (`apiKey`, `authDomain`, etc.).

## 2. Configurer le site

Ouvrez `firebase-config.js` à la racine du site et remplacez les valeurs `REMPLACEZ_MOI` par celles de votre projet :

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## 3. Créer votre compte admin

Dans la console Firebase : **Authentication > Users > Add user**, créez votre email/mot de passe. C'est ce compte qui vous servira à vous connecter sur `admin-login.html`.

> Pour ajouter plusieurs membres de l'équipe, répétez l'opération : tout utilisateur créé dans Authentication peut se connecter au dashboard.

## 4. Règles de sécurité Firestore (important)

Par défaut, une base "production" bloque tout accès. Allez dans **Firestore Database > Règles** et collez ceci :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Actualités et galerie : visibles par tous, modifiables seulement par un admin connecté
    match /actualites/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /galerie/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Bénévoles, messages, dons : n'importe qui peut envoyer (formulaire du site),
    // mais seul un admin connecté peut lire, modifier ou supprimer
    match /benevoles/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /messages/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /dons/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

Cliquez sur **Publier**.

## 5. Ajouter des photos (actualités & galerie)

Depuis l'admin, les images se collent sous forme de **lien direct** (URL) — pas d'envoi de fichier. Le plus simple pour héberger vos photos et obtenir ce lien :

1. Allez sur [imgbb.com](https://imgbb.com) (gratuit, pas besoin de compte pour un usage simple).
2. Glissez votre photo, uploadez-la.
3. Une fois en ligne, copiez le lien **"Lien direct"** (celui qui se termine par `.jpg` ou `.png`).
4. Collez ce lien dans le champ "Image (URL)" de l'admin.

Vous pouvez aussi utiliser n'importe quel autre lien d'image déjà en ligne (Facebook, Google Drive en partage public, etc.), du moment que c'est un lien direct vers le fichier image.

## 6. Se connecter

Rendez-vous sur `votredomaine.com/admin-login.html` (le lien n'apparaît nulle part dans le menu public — comme pour AutoDrive, l'accès admin est volontairement discret).

## Ce que le dashboard permet aujourd'hui

- **Actualités** : publier/modifier/supprimer — apparaissent automatiquement sur `actualites.html`.
- **Galerie** : ajouter/modifier/supprimer des photos — apparaissent automatiquement sur `galerie.html`, dans la bonne catégorie de filtre.
- **Bénévoles** : consulter les candidatures envoyées depuis `benevole.html`, marquer comme "contacté".
- **Messages** : consulter les messages envoyés depuis `contact.html`, marquer comme "lu".
- **Dons** : consulter les dons déclarés depuis `don.html` (déclaration + virement bancaire — pas de paiement en ligne automatique), marquer comme "reçu" une fois le virement vérifié sur votre compte.

## Limites actuelles

- Pas de paiement en ligne automatique (CIB/Edahabia/Stripe) : les dons restent des virements bancaires classiques, simplement suivis dans l'admin.
- Un seul niveau d'accès admin (pas de rôles différenciés entre membres de l'équipe).
- Si vous voulez plus tard un vrai paiement en ligne, il faudra passer par un prestataire (SATIM/CIB pour l'Algérie, ou Stripe/PayPal à l'international) — dites-le-moi le moment venu.
