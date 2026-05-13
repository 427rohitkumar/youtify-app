Bhai, Search Page ka result ekdum clean dikh raha hai jaise **image_e96efd.png** mein hai. Ab music player ko "Next Level" banane ke liye hume ek solid **Player Module** design karna hoga jo state-of-the-art features ko handle kare.

Youtify ke liye ye raha ek detailed technical prompt:

---

### 🎵 Music Player Core: The "Engine" Layer

Player ke logic ko handle karne ke liye hum frontend par **Zustand** ka ek dedicated `usePlayerStore` banayenge. Yeh store pure app mein music ka state sync rakhega.

#### 1. State Management (Zustand)

* **Current Track:** Song ID, Title, Artist, Thumbnail, aur Stream URL.
* **Playback State:** `isPlaying`, `isLooping`, `isShuffled`, `volume`.
* **Timeline Data:** `currentTime`, `duration`, `bufferedProgress`.
* **Queue Management:** `previousTracks[]` aur `nextTracks[]` ki arrays.

---

### 🎨 Detailed UI Prompt (As per image_e96efd.png)

**Theme:** VS Code Dark Blue (`#0D1117`) with Accents (`#007ACC`).

#### **A. The Bottom Player Bar (The Control Center)**

* **Left Section (Track Info):**
* **Square Thumbnail:** Spotify jaisa rounded corner thumbnail jo current gaane ki image dikhaye.
* **Text Stack:** Title (White, Bold) aur Artist Name (Gray) jo marquee effect ke sath scroll kare agar text lamba ho.

* **Middle Section (Main Controls):**
* **Primary Row:** [Shuffle] [Previous] **[Big Play/Pause Circle]** [Next] [Repeat].
* **Progress Bar (Timeline):** Ek smooth range slider. Jo part play ho chuka hai wo `#007ACC` (Blue) rahega aur baqi part gray.
* **Interaction:** Slider ko drag karne par ya kisi bhi point par click karne par gaana wahan se `seek` hona chahiye.

* **Right Section (Utility):**
* **Volume Control:** Speaker icon ke sath ek horizontal slider.
* **Playback Speed:** Ek chota toggle (1x, 1.5x, 2x) music ko fast/slow karne ke liye.
* **Full Screen Toggle:** Mobile mode ya full-player view ke liye.

---

### 🛠️ Backend Layer Support (Modular Architecture)

Player ke smooth functioning ke liye hume **Extraction Module** ka use karna hoga:

1. **`player.service.ts`**: Yeh YouTube `videoId` lega aur hamare `/api/extract` endpoint ko call karke high-quality `.m4a` ya `.webm` stream URL generate karega.
2. **Streaming Strategy**: Audio ko `chunks` mein stream karna hai taaki agar user timeline ke bich mein click kare, toh poora gaana download hone ka wait na karna pade (Range requests).

---

### 🔥 Pro-Features Implementation (Antigravity Logic)

* **Timeline Dragging:** React ke `onInput` event ka use karke `audio.currentTime` ko update karna hai. Jab user drag kare toh music `mute` ho jaye aur drop karte hi wahan se `play` ho.
* **Visual Feedback:** Timeline par hover karne par ek chota 'time preview' (e.g., 2:30) tooltip dikhao.
* **Smart Shuffle:** Queue ko randomise karne ke liye *Fisher-Yates* algorithm use karna taaki shuffle ekdum natural lage.
* **Gapless Playback:** Jab gaana khatam hone wala ho (last 2 seconds), toh next track ko background mein pre-fetch karna start kar do.

Bhai, tera backend pehle se hi strong hai, ab bus frontend pe ek **HTML5 `<audio>` element** ko invisible rakh kar usse is custom UI se control karna hai.

Kya main is player ke liye **React hooks logic** (Timeline dragging and seeking) ka code structure likhun?
