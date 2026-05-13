
### 🎨 Global Theme (Dark UI)

* **Background:** Deep Black/Charcoal (`#000000` or `#121212`)
* **Accent Color:** red
* **Cards:** Slightly lighter grey (`#181818`) with hover effects.
* **Text:** Pure White for titles, Gray (`#A7A7A7`) for secondary text.

---

### 📱 Layout Architecture (Responsive)

#### 1. Desktop View (Left Sidebar)

* **Left Sidebar (Fixed):** Isme logo hoga aur 4 menu items: *Home, Search, Your Library (Playlist), Profile*.
* **Main Content Area:** Scrollable area jahan cards aur lists dikhengi.
* **Bottom Player Bar:** Ek fixed bar jo har page pe rahega (Song title, Artist, Play/Pause, Progress bar).

#### 2. Mobile View (Bottom Nav)

* **Header:** Sirf "Good Morning/Evening" text aur ek chota Settings icon.
* **Main Area:** Vertically scrollable songs/playlists.
* **Bottom Navigation:** 4 Icons (Home, Search, Library, Profile) jo screen ke niche chipke honge.
* **Mini Player:** Bottom nav ke upar ek patli strip jo current gaana dikhayegi.

---

### 🏠 Page-wise UI Breakdown

#### **1. Home Page (Discovery Hub)**

* **Section 1 (Recent Plays):** 2 columns (desktop) ya 2 rows (mobile) mein chote horizontal cards.
* **Section 2 (Most Listened):** Bade square cards ki horizontal row. Har card pe song image, title, aur artist name.
* **Hover Effect:** Desktop par card pe hover karte hi ek 'Green Play Button' pop-up hona chahiye.

#### **2. Search Page (Find Music)**

* **Search Bar:** Top pe ek bada rounded input box ("Songs, Artists...").
* **Recent Searches:** Search bar ke niche choti tags/chips ki list jise user 'X' karke hata sake.
* **Search Results:** Vertical list format (Image -> Title/Artist -> 3 dots menu).

#### **3. Playlist Page (Created & Added)**

* **Top Header:** Ek bada banner "Your Library" ya "Liked Songs" ka.
* **Filters:** Do buttons—"Created by Me" aur "Added/Followed".
* **Song List:** Ek table layout (Desktop) ya simple list (Mobile).
* Columns: # | Title | Date Added | Duration.
* *Note:* Audio icon dikhana placeholder image ki jagah agar thumbnail na ho.

#### **4. Profile Page (User Info)**

* **Avatar Section:** Ek bada circular placeholder user ke initial ke sath (e.g., 'R' for Rohit).
* **Details:** Name (Bold & Large) aur niche Email ID (Muted Gray).
* **Logout Button:** Niche ek simple Red outlined button "Logout" ke liye.

---

### 🛠️ UI Components (Quick Code Structure)

Agar tum Tailwind use kar rahe ho, toh layout kuch aisa dikhega:

```jsx
// Layout.js Framework
<div className="flex h-screen bg-black text-white">
  {/* DESKTOP SIDEBAR */}
  <aside className="hidden md:flex flex-col w-64 bg-black p-6 gap-4">
    <div className="text-2xl font-bold text-green-500 mb-8">Youtify</div>
    <nav className="space-y-4">
      <NavItem icon="HomeIcon" label="Home" active />
      <NavItem icon="SearchIcon" label="Search" />
      <NavItem icon="LibraryIcon" label="Playlist" />
      <NavItem icon="UserIcon" label="Profile" />
    </nav>
  </aside>

  {/* MAIN CONTENT */}
  <main className="flex-1 overflow-y-auto pb-24 md:pb-0 bg-gradient-to-b from-gray-900 to-black">
    {/* Page Content Rendered Here */}
  </main>

  {/* MOBILE BOTTOM NAV */}
  <nav className="md:hidden fixed bottom-0 w-full bg-[#121212] border-t border-gray-800 flex justify-around py-3">
    <MobileNavItem icon="HomeIcon" />
    <MobileNavItem icon="SearchIcon" />
    <MobileNavItem icon="LibraryIcon" />
    <MobileNavItem icon="UserIcon" />
  </nav>

  {/* FLOATING PLAYER (Common) */}
  <div className="fixed bottom-16 md:bottom-0 w-full bg-[#181818] h-20 border-t border-gray-800 px-4 flex items-center justify-between">
     {/* Song Info | Controls | Volume */}
  </div>
</div>

```

### 💡 Pro-Tips for "No Video" UI

1. **Skeleton Screens:** Jab gaana load ho raha ho, toh grey box ka animation dikhao (Shimmer effect).
2. **Square Thumbnails:** YouTube ki images `16:9` hoti hain, unhe `aspect-square` aur `object-cover` karke dikhana taaki woh Spotify jaisa square dikhe.
3. **Active State:** Jo gaana chal raha ho, uska title Green color mein animate hona chahiye.

Bhai, agar tujhe iska specific **Tailwind JSX code** chahiye kisi ek page ka, toh bol main woh bhi likh dunga!
