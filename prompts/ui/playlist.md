Bhai, **Search** aur **Player** setup hone ke baad ab **Your Library** is app ka dil (heart) banega. Yahan user apna collection manage karega. **image_e8fe23.png** ke design language (Dark Blue `#0D1117` + Accent `#007ACC`) ko follow karte hue, hume ek aisa interface chahiye jo simple ho par functionality mein power-packed ho.

Library module ke liye ye raha tera detailed **UI-only prompt**:

---

## 📚 Your Library Module: UI Layout & Features

### 1. The Main View (Grid of Playlists)

Jab user "Your Library" par click kare, toh use ek clean grid dikhni chahiye.

* **"Create New Playlist" Card:** Grid ka pehla card ek dashed-border wala box hoga jisme center mein bada **"+" icon** ho. Click karne par ek clean **Modal (Pop-up)** khulega playlist ka naam puchne ke liye.
* **Playlist Cards:** Har card mein:
* **Cover Art:** Playlist ke pehle 4 gaano ka collage ya fir ek default music icon.
* **Metadata:** Playlist ka Title (Bold) aur niche gaano ki sankhya (e.g., "12 Songs").
* **Quick Action:** Hover karne par card par ek chota 'Play' button aur ek '3-dot menu' (Rename/Delete ke liye) dikhega.

### 2. Playlist Detail View (Inside a Playlist)

Jab user kisi specific playlist par click kare:

* **Header Section:** Ek bada banner jisme playlist ka naam, creation date, aur ek bada **"Play All" Blue Button** ho.
* **Management Tools:** Header ke side mein 'Edit Name' (Pencil icon) aur 'Delete Playlist' (Trash icon) ke options.
* **Song Table:** Ek list format (image_e8fe23.png ke search results jaisa):
* **Columns:** Index (#), Title/Artist (with small thumbnail), Date Added, aur Duration.
* **Interaction:** Kisi bhi row par click karne se wo gaana turant player mein load ho jaye.

### 3. "Add to Playlist" Flow (Cross-Module)

Ye feature **Search Page** par bhi dikhega:

* Jab user search result mein kisi gaane ke '3-dot menu' par click kare, toh ek **"Add to Playlist"** dropdown khule.
* Wahan user ki saari existing playlists ki list dikhe. Click karte hi gaana wahan save ho jaye.

---

## 🛠️ UI Components & Interaction (Antigravity Style)

* **Modal UI:** Playlist create ya rename karte waqt jo pop-up aayega, uska background `#181818` (slightly lighter than main bg) rakho taaki wo depth de sake.
* **Empty State:** Agar koi playlist nahi hai, toh center mein ek pyara sa "No playlists yet. Create your first one!" ka message aur ek action button dikhao.
* **Delete Confirmation:** Galti se delete na ho jaye, isliye "Are you sure?" wala ek chota sa confirmation modal zaroor dena.
* **Drag & Drop (Pro Tip):** Agar possible ho, toh playlist ke andar gaano ko re-order karne ke liye vertical drag handle (6-dots icon) de sakte ho.

### Folder Structure Reminder (Modular)

Tera frontend structure kuch aisa rahega:

```text
src/components/library/
├── PlaylistGrid.tsx      # Saari playlists ka list
├── CreatePlaylistModal.tsx # Rename/Create pop-up
├── PlaylistDetail.tsx    # Playlist ke andar ke gaane
└── AddToPlaylistMenu.tsx # Search result mein dikhne wala dropdown

```

Bhai, ye UI tere **Youtify** ko ek complete product banadega. Search page pe pehle se hi menu icons dikh rahe hain (image_e8fe23.png ke right side mein), bas unhe is Library module ke logic se link karna hai.

Agla step kya hai? Playlist ka **Mongoose Schema** likhein ya UI ka **Tailwind code**?
