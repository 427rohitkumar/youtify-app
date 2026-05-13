Bhai, Search Page ka concept ekdum clear hai. Isse implement karne ke liye hume **YouTube Data API v3** ka use karna hoga aur **Debouncing** jaise concepts lagane honge taaki API quota jaldi khatam na ho.

image_e9d892.png ke design language aur tere **Module-Based Layered Architecture** ko follow karte hue, ye raha ek detailed Technical aur UI Prompt:

---

### 📂 Module: `src/modules/search/`

Bhai, tere strict rules ke hisaab se har file ka role ye rahega:

1. **`search.controller.ts`**: Yeh query parameters (`q`) ko extract karega aur `search.dto.ts` ke saath validate karke service ko handover karega.
2. **`search.service.ts`**: Yeh core logic handle karega. Jab user type karega, toh yeh YouTube API ko call karke results fetch karega aur unhe clean objects (Song title, Thumbnail, VideoID) mein convert karega.
3. **`search.repository.ts`**: Jab user kisi song pe click karega, toh yeh database (`momentflow_db`) mein us search query ko "Recent Search" mein save karega.
4. **`search.dto.ts`**: Zod schema jo check karega ki search string khali na ho aur usme koi malicious characters na hon.

---

### 🎨 Search Page UI Detail Prompt

**Theme:** Dark Blue VS Code style (`#0D1117`) matching image_e9d892.png.

#### 1. Search Bar & Suggestions (The "Header")

* **Input Box:** Ek bada, rounded search bar top center mein. Jab user type kare (`onChange`), toh ek dropdown menu niche open ho (Suggestions).
* **Suggestions Dropdown:** Semi-transparent dark background ke sath, jahan user ke typing ke basis pe YouTube ke recommended keywords dikhen. Hover karne par background `#007ACC` (blue) ho jaye.

#### 2. Default State (Recent Searches)

* Jab input khali ho, toh ek section dikhao: **"Recent Searches"**.
* Har recent search ek horizontal chip ya small card jaisa ho jiske side mein ek 'X' (Remove) button ho.

#### 3. Result State (The "Grid/List")

* Search press karne ke baad, results ko ek clean list mein dikhao.
* **Thumbnail:** YouTube ki image ko `aspect-square` mein dikhana (Spotify feel ke liye).
* **Metadata:** Title white mein, aur niche channel/artist name grey mein.
* **Audio Focus:** Har result pe ek "Play" icon ho. Click karte hi, wo video ID hamare `extract` module pe jaye aur audio stream niche wale player (image_e9d892.png) mein start ho jaye.

#### 4. Interaction (Module Coordination)

* Jab user kisi song pe click kare, toh **Search Service** database (`search.repository.ts`) ko trigger karegi taaki wo user ke profile mein "Recent Searches" update kar sake.

---

### 🛠️ Technical Implementation Tip

* **Debouncing (300ms):** Har keystroke pe API call mat karna. User jab ruk jaye (300ms ke liye), tabhi search trigger ho.
* **Extraction:** Frontend se YouTube URL mat bhejna, sirf `videoId` bhejna. Backend pe `ytdl-core` ya tera dedicated extraction logic usse `.m4a` link mein convert karega.
* **Zustand Store:** Ek `useSearchStore` banao jo `results`, `suggestions`, aur `isSearching` (loading state) ko handle kare.

Bhai, ye layout tere architecture ko 100% follow karega. Kya main Search Page ke **Zod DTO** ya **Service logic** ka snippet generate karun?
