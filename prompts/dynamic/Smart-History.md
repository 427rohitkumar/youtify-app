Bhai, yeh idea ekdum pro-level hai! Isse hum **"Auto-Caching"** aur **"Smart History Management"** kahte hain. Jab ek baar song metadata aur audio cache database mein aa jayega, toh humein YouTube API ke quota ki chinta nahi karni padegi aur player instantly load hoga.

**image_e80a44.png** ke bottom player ko dhyan mein rakhte hue, is smart logic ka detail prompt ye raha:

---

### 🧠 Smart Persistence Strategy

Is logic ko implement karne ke liye hume **`src/modules/player/`** aur **`src/modules/song/`** modules ko coordinate karna hoga.

#### 1. Backend Layer: The "Smart Cache" Logic

* **`song.repository.ts`**: Yeh check karega ki `youtube_id` pehle se DB mein exist karta hai ya nahi. Agar nahi, toh metadata aur stream link ko **`momentflow_db`** mein save karega.
* **`history.service.ts`**: Yeh user ke listening behavior ko track karega.

#### 2. The 60% Auto-Save Rule (Frontend Trigger)

* **Logic:** Frontend player (Zustand store) mein ek listener hoga jo `currentTime` aur `duration` ko monitor karega.
* **Trigger:** Jaise hi `(currentTime / duration) >= 0.6` hoga, ek silent POST request `api/songs/auto-save` par jayegi.
* **Action:**
* Song ko `liked_songs` ya `most_listened` category mein mark kar diya jayega.
* User ke **"Recent Searches"** aur **"Jump Back In"** (image_e80a44.png reference) sections mein yeh song top par aa jayega.

---

### 🎨 UI Enhancements for Auto-Save

image_e80a44.png ke player bar mein ye chote badlav honge:

* **Saving Indicator:** Jab 60% complete ho aur data save ho raha ho, toh song title ke side mein ek chota sa 'Checkmark' ya 'Cloud' icon animate ho sakta hai.
* **Manual Save Button:** Title ke side mein ek 'Heart' ya 'Save' icon do, taaki user 60% ka wait kiye bina khud bhi save kar sake.

---

### 🛠️ Data Flow for Zero-Wait Streaming

1. **Check Phase:** Jab user kisi song pe click kare, toh frontend pehle check karega: *"Kya yeh song mere DB mein hai?"*
2. **Fast Track:** Agar DB mein hai, toh direct serverless endpoint se streaming link uthayega (No YouTube API call).
3. **Slow Track (First time only):** Agar DB mein nahi hai, toh YouTube Data API se metadata fetch karega aur stream start karega. Background mein 60% mark cross hote hi DB populate ho jayega.

### 📁 Updated Schema Requirement (`song.model.ts`)

```typescript
{
  youtubeId: String,   // Unique identifier
  title: String,
  thumbnail: String,
  streamUrl: String,   // Cached stream link or path
  listenCount: Number, // Tracking popularity
  isAutoSaved: Boolean // To distinguish from manual playlists
}

```

Bhai, isse Youtify ka UX ekdum smooth ho jayega. User ko lagega hi nahi ki backend pe extraction chal raha hai.

Agla step kya hai? **60% logic ka Frontend Hook** likhna start karein?
