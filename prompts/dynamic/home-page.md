Bhai, logo ekdum "Maja Aa Gaya" waala hai! Ab **image_e81cca.png** ko dynamic banane ke liye hume tere modular architecture ka use karke backend se real data fetch karna hoga. Home page user ke liye personal tab lagta hai jab data uske behavior ke hisaab se badle.

Home Page ko dynamic karne ke liye ye raha tera detailed blueprint:

---

## 🏠 Home Module: Dynamic Data Architecture

Is module ko `src/modules/home/` ke andar organize karenge.

### 1. Backend Layers (Logic Flow)

* **`home.controller.ts`**:
* `GET /api/home`: Yeh ek hi call mein "Jump Back In" aur "Made For You" sections ka combine data return karega.

* **`home.service.ts`**:
* **Greeting Logic**: Time ke hisaab se "Good morning", "Good afternoon", ya "Good evening" generate karega.
* **Data Aggregation**: `song.repository.ts` aur `playlist.repository.ts` ko call karke data merge karega.

* **`home.repository.ts`**:
* **Recently Played**: User model se last 6 played songs fetch karega.
* **Recommendations**: User ke most listened genres ya artists ke base par YouTube API se similar songs fetch karega.

---

### 🎨 UI Section-wise Dynamic Prompt (image_e81cca.png)

#### **A. Dynamic Greeting & Identity**

* **Text:** Hardcoded "Good evening" ki jagah server-side time check karke greeting dikhao.
* **User Name:** Auth context se `user.name` ya `user.username` fetch karke display karo (e.g., "Good evening, Rohit").

#### **B. "Jump Back In" Section (Most Frequent)**

* **Data Source:** User ki history se top 2 entities.
* **Left Card (Liked Songs):** Iska count dynamic hona chahiye (e.g., "Liked Songs • 128 songs"). Is par click karte hi User ki 'Liked' playlist play ho.
* **Right Card (Recently Added/Played):** User ne jo aakhri playlist ya song add kiya ho, uska thumbnail aur naam yahan dikhega.

#### **C. "Made For You" Section (Smart Recommendations)**

* **Horizontal Scroll:** Mobile par isse touch-scrollable aur desktop par horizontal row rakho.
* **Content:** Agar user ki history empty hai, toh YouTube ke "Trending Music" ya "Top 50 India" charts dikhao.
* **Cards:** Har card dynamic hoga:
* **Image:** Playlist cover ya song thumbnail.
* **Title:** Gaane ka naam.
* **Subtitle:** Artist name ya "Based on your recent listening".

---

## 🛠️ Implementation Strategy (Antigravity Style)

1. **Skeleton Loading:** Jab tak data fetch ho raha ho, tabhi image_e81cca.png ke layout jaisa "Shimmer Effect" dikhao taaki user ko feel ho ki app fast hai.
2. **Server Components (Next.js):** Home page ko **Server Component** rakho taaki initial data (Greeting aur Top 2 cards) page load hote hi dikh jaye.
3. **Caching:** Recommendation API calls ko 1 ghante ke liye cache karo taaki YouTube API quota safe rahe.

### Folder Structure for Home

```text
src/modules/home/
├── home.controller.ts     # Aggregates all dashboard data
├── home.service.ts        # Business logic for greetings & recs
├── home.dto.ts            # No-input validation (optional)
└── home.types.ts          # Interface for Dashboard response

```

Bhai, jab yeh dynamic ho jayega, toh tera app ekdum professional Spotify-clone jaisa feel dega.

Ab agla step kya hai? **Home Service** ka logic likhna start karein ya **Frontend Dashboard** mein data map karna shuru karein?
