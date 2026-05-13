Bhai, loader wala logic ekdum sahi pakda hai tune. Jab extraction process chalta hai, toh bina hover ke loader dikhna zaroori hai taaki user ko lage ki app "live" kaam kar rahi hai. Sath hi Full-screen aur Playlist integration Youtify ko ek premium feel dega.

Tere module-based architecture ke hisaab se ye raha in teeno features ka detailed implementation prompt:

---

### 1. Persistent Loader Logic (image_e7ac48.png)

Abhi tera loader CSS `:hover` se trigger ho raha hai, isse hata kar **State-driven** banana hai.

* **Frontend Logic:** `usePlayerStore` (Zustand) mein ek `isExtracting` boolean state rakho.
* **Trigger:** Jaise hi user song par click kare, `isExtracting` ko `true` set karo. Jab audio source load ho jaye (`onCanPlay`), tab isse `false` karo.
* **UI Implementation:**
* Thumbnail ke upar ek absolute overlay rakho jo tabhi dikhe jab `isExtracting` true ho.
* Loader ko thumbnail ke center mein humesha visible rakho (no hover needed) jab tak song buffering ya extraction phase mein hai.

---

### 2. Full-Screen "Big Player" Mode (image_e7a8c1.png)

Maximize icon (diagonal arrows) par click karte hi ek naya **Full Screen Overlay** active hoga.

* **UI Design:**
* **Background:** Current song thumbnail ka extreme blurred version (Glassmorphism effect).
* **Center:** Ek bada high-quality square thumbnail image.
* **Bottom Section:** Large controls (Play, Pause, Progress Bar) aur title/artist text jise `text-4xl` size mein dikhana hai.

* **State Control:** Ek `isExpanded` state maintain karo. Jab user icon par click kare, toh `document.documentElement.requestFullscreen()` call karo (optional) aur UI ka layout change kar do.

---

### 3. Playlist Controller & Auto-Save (image_e7a55f.png)

Playlist icon par click karte hi User ki playlists ki list drop-down mein dikhni chahiye.

* **The "Group & Save" Rule:**
* **Controller Logic:** Jaise hi user "Add to Playlist" par click karke kisi group ko select kare, `playlist.service.ts` trigger hoga.
* **Auto-Persistence:** Kyuki user isse playlist mein add kar raha hai, backend repository (`song.repository.ts`) ko instruction do ki is song ka metadata aur stream URL turant **`momentflow_db`** mein save kar le.
* **Benefit:** Agli baar jab user apni playlist se gaana chalayega, toh extraction ka wait nahi karna padega—wo direct DB se stream hoga.

---

### 🛠️ Architecture Coordination (Backend)

* **`playlist.controller.ts`**: Naya endpoint `POST /api/playlist/add-and-save` banao jo gaane ko playlist mein add karne ke sath-sath `song.service.ts` ko call karke DB entry ensure kare.
* **`player.dto.ts`**: Full-screen mode ke liye metadata validation check karo taaki high-res images hi load hon.

Bhai, ye teeno cheezein sath milkar Youtify ko ek "Native App" wali feeling dengi. Loader ka bina hover ke dikhna user retention badhayega kyuki use loading state ka clear pata chalega.

Kya main **Full-screen player layout** ka CSS/Tailwind structure likh kar doon?
