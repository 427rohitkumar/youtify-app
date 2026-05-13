Bhai, humara Search, Player, aur Library ekdum setup ho chuke hain. Ab baari hai **Profile Page** ki jo ek user ka personal command center hoga. Kyunki hum **image_e8fe23.png** wali VS Code Dark Blue theme follow kar rahe hain, profile page ko hum kaafi sleek aur minimal rakhenge, bina kisi faltu ke shor-sharabe ke.

Iske liye ye raha ek detailed responsive UI prompt:

---

## 👤 Profile Module: Responsive UI Design

### 1. The Hero Section (Top Identity)

* **Avatar:** Ek bada circular container (`w-32 h-32` ya `w-40 h-40`). Isme user ki profile picture ho, ya fir ek stylish gradient background ke upar user ke naam ka pehla letter (e.g., **"R"** for Rohit).
* **User Info:** Avatar ke thik niche (mobile mein) ya side mein (desktop mein):
* **Display Name:** Bada aur bold text (`text-3xl` or `4xl`).
* **Email ID:** Uske niche muted gray text mein email.
* **Role Badge:** Ek chota sa sleek badge (e.g., "Software Engineer" ya "Pro User") jisme `#007ACC` ka border ho.

### 2. Stats Overview (The Quick Look)

Profile header ke niche ek 3-column grid (Mobile pe single column) jahan user ki activity ka summary dikhe:

* **Playlists:** Total count jo user ne create ki hain.
* **Liked Songs:** Total songs jo library mein hain.
* **Join Date:** "Member since 2024" jaisa ek simple tag.

### 3. Settings & Management (Interactive Section)

Ek clean list ya vertical tabs jisme user apne account ko manage kar sake:

* **Edit Profile:** Name change karne ka option.
* **Security:** Password reset trigger karne ka button (jo OTP system tune pehle socha tha).
* **Theme Toggle:** Blue accent ko customize karne ka option (Optional).
* **Logout:** Sabse niche ek prominent Red-tinted button "Logout" ke liye.

---

## 📱 Responsive Strategy (Antigravity Logic)

* **Mobile View:**
* Sari cheezein **Center Aligned** hongi.
* Bottom Navigation pinned rahegi taaki user easily doosre pages pe ja sake.
* Settings ki list full-width hogi taaki touch target bada rahe.

* **Desktop View:**
* **Left Sidebar** (image_e8fe23.png wala) hamesha visible rahega.
* Profile header **Left Aligned** hoga with avatar on the left and text on the right.
* Content area mein thoda extra padding (`p-12`) hoga taaki design "saans le sake" (breathable layout).

---

## 🛠️ UI Components (Tailwind Standard)

* **Glassmorphism:** Profile cards ke liye `bg-opacity-10` aur `backdrop-blur-md` ka use karna taaki wo background ke dark blue gradient ke saath blend ho jaye.
* **Hover States:** Buttons aur settings items pe hover karte hi `#007ACC` ka ek soft glow aana chahiye.

### Folder Structure (Modular)

```text
src/components/profile/
├── ProfileHeader.tsx    # Avatar aur Name section
├── ProfileStats.tsx     # Stats cards (Playlists/Songs)
├── ProfileActions.tsx   # Edit/Security buttons
└── LogoutButton.tsx     # Strict logout logic component

```

Bhai, ye profile page tere **Youtify** app ko ek complete "Personal App" wali feel dega. Sabse best part ye hai ki ye image_e8fe23.png wale **Bottom Player** ke saath ekdum perfect match karega.

Ab agla move kya hai? Profile ka **Update API (Controller/Service)** likhein ya seedha **Home Page** ka Final Dashbaord finish karein?
