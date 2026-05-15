# Youtify API Documentation (v1)

This document describes the REST APIs available for the Youtify Native App (Android/Flutter).

## 🌍 Base URL
`https://youtify-stream.vercel.app/api/v1`

---

## 🔒 Security & Authentication

### 1. Required Headers
All requests MUST include these headers:
- `X-API-Key`: `youtify_internal_key_2026` (Ensures request comes from the app).
- `Authorization`: `Bearer <your_access_token>` (Required for protected routes).
- `Content-Type`: `application/json`

### 2. How to obtain a token?
- Call `POST /auth/login` with your credentials.
- OR call `POST /auth/otp/verify` after verifying your phone/email.
- The response will contain an `accessToken`. Store this securely on the device (e.g., using `flutter_secure_storage`).

### 3. API Usage in Flutter (Dart Example)
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class YoutifyApi {
  final String baseUrl = "https://youtify-stream.vercel.app/api/v1";
  final String apiKey = "youtify_internal_key_2026";
  String? _token;

  Future<void> login(String email, String password) async {
    final res = await http.post(
      Uri.parse("$baseUrl/auth/login"),
      body: jsonEncode({"email": email, "password": password}),
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
    );
    if (res.statusCode == 200) {
      _token = jsonDecode(res.body)['accessToken'];
    }
  }

  Future<Map<String, dynamic>> getHomeData() async {
    final res = await http.get(
      Uri.parse("$baseUrl/home"),
      headers: {
        "Authorization": "Bearer $_token",
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
    );
    return jsonDecode(res.body);
  }
}
```

---

## 🛠️ API Endpoints

### 1. Authentication
- `POST /auth/login`: `{ "email": "...", "password": "..." }`
- `POST /auth/otp/send`: `{ "email": "..." }`
- `POST /auth/otp/verify`: `{ "email": "...", "otp": "..." }`
- `POST /auth/logout`: Invalidates session (Client should clear token).

### 2. User Profile
- `GET /profile`: Get user stats and info.
- `PATCH /profile`: Update profile (e.g., `{ "name": "..." }`).

### 3. Home & Discover
- `GET /home`: Full dashboard data (greeting, recommendations, etc.).
- `GET /songs/recent`: Playback history list.

### 4. Search
- `GET /search?q=...&type=search`: `type` can be `search` or `suggest`.
- `GET /search/history`: Get recent searches.
- `POST /search/history`: `{ "query": "..." }` to add.
- `DELETE /search/history`: Clear history.

### 5. Playback
- `GET /stream?id=videoId`: Returns the audio stream URL.

### 6. Library & Playlists
- `GET /library/liked`: Liked songs.
- `POST /library/toggle-like`: `{ "youtubeId": "...", ... }`
- `GET /library/saved`: Saved tracks.
- `POST /library/toggle-save`: `{ "youtubeId": "...", ... }`
- `GET /playlists`: All playlists.
- `POST /playlists`: `{ "name": "..." }`
