# Introduction to n8n — production brief and design plan

The user explicitly selected C:/Users/hecin/ai-video-editor as the production workspace. Final project: projects/introduction-n8n/. This input folder retains supplied recordings and working preparation files. Preserve the completed n8n reference and all earlier videos.

## Brief

Instagram Reel, 1080 × 1920, 30 fps, Darija narration. Six original recordings audio1.ogg through audio6.ogg, concatenated without trimming, reordering, time stretching, or rewriting. Decoded duration 98.026667 seconds. Final picture holds 0.75 seconds after narration. Show short Arabic keywords and technical names, never full subtitles.

## Design tokens

- Canvas #161719; panel #222427; control #2C2F33.
- Primary #F2F1ED; secondary #B7B9BE; outline #727780.
- Coral #EE795B for active workflow nodes and cursor actions; green #72B894 for completed actions.
- Noto Sans Arabic Bold for centered Arabic headings, Noto Sans Arabic Regular for app labels; Arial for compact English product names.
- Caption centered around y=360–470; outlined app window x=90, y=620, w=870, h=790, with offset depth and coral node-bot perched at the top. Useful content remains above y=1590 and left of x=960.

```
        short Arabic heading
        technical keyword

                         node-bot
    +----- app window --------+
    | one animated demo       |
    |                          |
    | input -> action -> result|
    +--------------------------+
       current workflow stage
```

## Review against brief

Follow the approved n8n composition, adapting color item by item. This is an intentionally specified dark style, not an invented dashboard theme. Make the morning Telegram briefing the recurring example instead of reusing the reference video's lead-form story. Retain the original coral bot silhouette. Use a single app demonstration per beat, purposeful packet travel and connecting nodes. No background texture filter, looping bounce, camera shake, dense paragraph cards, or narration captions. Weather and appointment data are illustrative UI examples.

## Storyboard and narration cues

| Seconds | Visual | Keywords |
|---|---|---|
| 0–5.24 | Morning phone message, weather information appears | صباحك واجد |
| 5.24–9.10 | Appointment rows and umbrella warning | الطقس والمواعيد |
| 9.10–12.65 | Briefing delivered automatically | وحده! |
| 12.65–17.80 | n8n identity, coral nodes connect | n8n / أتمتة |
| 17.80–23.15 | Clock, weather, calendar, Telegram become connected | اربط تطبيقاتك |
| 23.15–27.27 | One workflow assembled once | مرة وحدة |
| 27.27–30.23 | Trigger starts another execution | يتنفّذ تلقائياً |
| 30.23–36.13 | Connected workflow overview | Workflow |
| 36.13–37.97 | Single node selected | Node / خطوة |
| 37.97–42.35 | Trigger selected and switched on | Trigger / البداية |
| 42.35–45.05 | Clock and 07:00 schedule | كل صباح |
| 45.05–48.33 | Individual action executes | Action |
| 48.33–54.61 | Cursor connects nodes; no-code result | بلا كود من الصفر |
| 54.61–60.11 | Schedule trigger set to 07:00 | Schedule Trigger |
| 60.11–65.33 | Weather API returns illustrated local forecast | Weather API |
| 65.33–68.81 | Calendar returns today's appointments | Google Calendar |
| 68.81–72.79 | Records merge into Telegram message | Telegram |
| 72.79–77.06 | Ready morning briefing | برنامج نهارك واجد |
| 77.06–80.12 | Workflow expands toward AI | أكثر من أتمتة |
| 80.12–87.42 | AI agent connected to model, tools and memory | AI Agents |
| 87.42–93.09 | Series path starts from simple workflow | من الصفر |
| 93.09–95.65 | Path reaches an AI agent | خطوة بخطوة |
| 95.65–end | Follow call to action, n8n workflow retained | تابع السلسلة |

## Review and export

Revision after user review: add the exact opening title “سلسلة تعلم n8n” from the first frame through the first 9.1 seconds, fading out over the final 0.35 seconds. Center it above the original hook in an outlined dark badge with the existing coral accent. Keep the approved hook, narration, scene timings, and later scenes intact. Preserve the first approved export as exports/introduction-n8n-instagram-v1.mp4.

Build representative portrait stills and an opening preview, critique composition and Arabic readability, then export H.264/AAC MP4. Verify type checking, full decode, 1080 × 1920, 30 fps, duration, sequential source sample identity, and audio cross-correlation throughout each supplied recording. Review scene and transition stills. Video-perception MCP tools unavailable; do not claim continuous audiovisual playback review. Whisper small ran locally on CPU because the configured GPU environment is missing.
