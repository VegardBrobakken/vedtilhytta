// Run-once seeder: writes the two initial price sections into the `priceSections`
// Firestore collection so they can be managed from /admin like everything else.
//
// It signs in as an admin user (auth == admin in this project) to satisfy the
// `allow write: if request.auth != null` Firestore rule, and it is idempotent:
// if the collection already has documents it does nothing.
//
// Usage:
//   node --env-file=.env.local scripts/seed-price-sections.mjs <admin-email> <admin-password>
// or with env vars:
//   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... node --env-file=.env.local scripts/seed-price-sections.mjs

import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

// The two sections currently hardcoded in src/pages/Prices.tsx, preserving their
// local image paths and descriptive alt text.
const SECTIONS = [
  {
    title: 'Småsekk - 60L',
    price: 120,
    unit: 'per sekk ink.mva',
    order: 0,
    images: [
      { src: '/img/IMG_0445.jpeg', alt: 'Ved i sekk stablet ved hytta' },
      { src: '/img/IMG_0731.jpeg', alt: 'Nærbilde av tørr bjørkeved i sekk' },
    ],
  },
  {
    title: 'Storsekk - 1000L',
    price: 1450,
    unit: 'per sekk ink.mva',
    order: 1,
    images: [
      { src: '/img/IMG_0350.jpeg', alt: 'Storsekk med tørr bjørkeved' },
      { src: '/img/IMG_9592.jpeg', alt: 'Bjørkeved lagret i store sekker' },
    ],
  },
]

async function main() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      'Missing Firebase config. Run with: node --env-file=.env.local scripts/seed-price-sections.mjs <email> <password>',
    )
    process.exit(1)
  }

  const email = process.argv[2] ?? process.env.SEED_ADMIN_EMAIL
  const password = process.argv[3] ?? process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    console.error(
      'Usage: node --env-file=.env.local scripts/seed-price-sections.mjs <admin-email> <admin-password>',
    )
    process.exit(1)
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)

  await signInWithEmailAndPassword(auth, email, password)

  const existing = await getDocs(collection(db, 'priceSections'))
  if (!existing.empty) {
    console.log(
      `priceSections already seeded (${existing.size} section(s)), skipping.`,
    )
    process.exit(0)
  }

  for (const section of SECTIONS) {
    const docRef = await addDoc(collection(db, 'priceSections'), section)
    console.log(`Added "${section.title}" → ${docRef.id}`)
  }

  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
