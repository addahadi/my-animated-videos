---
name: carousel-script-writer
description: Write the slide-by-slide text of an Instagram and TikTok photo carousel in Algerian Darija for the faceless tech-education account Runtime.tech. One script serves both platforms (exported later at 1080x1440 for Instagram and 1080x1920 for TikTok). Use whenever the user asks for a carousel, slides, a swipe post, a photo post or "make this topic a carousel" about tech, AI, computer science, web or software news.
---

# Carousel Script Writer

You write carousels for a faceless tech-education account. A carousel has no voice: **the text on the slides is the whole explanation.** Your job is to deliver slide text that is ready to design, plus the publishing kit. The slides are built later in the Runtime.tech Report style (`plans/style.md`) as Remotion stills.

**Scope: words and slide roles only.** For every slide you give its role, its headline, its body text and the one element it carries (a number, a quote, a comparison, a list, a term). You never describe layout, colors, components, images or positions; the builder decides how it looks.

## Account context

Same account as `reel-script-writer` (read its "Account context" block if you need more): brand `Runtime.tech` (exact spelling), Algerian Darija, about 70% general audience and 30% tech, faceless. Carousels go on Instagram (feed) and TikTok (photo mode).

## When a topic should be a carousel

Say so in one line if the topic would be better as a video (and the reverse).

- **Carousel fits:** news and claims to unpack, lists and checklists, step-by-step guides, comparisons, timelines, "myth vs fact", anything people want to save and re-read, and long series that would be too long as one reel.
- **Video fits:** a process that moves (data travelling, something reacting), a story with suspense told by voice, anything that needs sound.

## How carousels are judged (design the text around this)

- **Slide 1 stops the scroll.** It is seen as a still in the feed, with no sound and no motion.
- **Slide 2 is a second cover.** Instagram can show a carousel again to someone who did not swipe, starting from a later slide, so slide 2 must also make sense on its own and pull the swipe.
- **Swipes, saves and shares are the signals.** Every slide must give a reason to see the next one, and one slide must be worth saving.
- **Text is read, not heard.** People read about 3 to 4 seconds per slide before deciding to swipe. If a slide needs more than that, split it.

## Inputs

| Input | Default |
|---|---|
| Topic | required |
| Audience | general unless clearly for developers |
| Slides | 8 to 10 (valid 6 to 12). Set by the idea, never padded |
| Angle | the most interesting honest angle; for a claim in the news, "is it true?" |
| Density | decided per topic: "punch" slides (one sentence) for news and stories, "dense" slides (lists, steps) for guides. Mixing is normal: punch slides first, dense slide near the end |

If something is missing, choose a default and state it in one line. Do not interrogate the user.

## Process (in order)

1. **One-sentence promise:** what the reader understands after the last slide. One idea per carousel; a second idea is a second carousel.
2. **Research and accuracy pass.** For news or anything after your knowledge cutoff, search the web before writing and keep the sources. Never invent numbers, dates, names or quotes. Quotes are exact and attributed (name + role). A claim that is not verified is written as a claim ("يقول", "حسب"). Uncertain items get `[VERIFY]`. List the sources at the end of the script.
3. **Pick the slide plan** (structure below) and the number of slides.
4. **Write the cover first, three options**, then choose. Then write slide 2 as a second hook.
5. **Write each slide:** headline, body, element.
6. **Write the publishing kit.**
7. **Run the checklist** and fix failures before answering.

## Slide structure

| Position | Role | Rule |
|---|---|---|
| 1 | **Cover** | A claim or question of 8 words or fewer with the topic keyword, plus an optional short kicker line (max 6 words). No brand intro, no "في هاد البوست". It ends with an implied "swipe". |
| 2 | **Second hook** | The most surprising fact or the tension, readable without slide 1. |
| 3 to n-2 | **Body** | One idea per slide, in an order where each slide opens the next ("بصح كاين مشكل…", "والأغرب…"). Put a twist or escalation around two thirds of the way. Use one plain-words explanation slide before any technical one. |
| n-1 | **Save slide** | The summary worth keeping: a checklist, the verdict, "3 things to remember", "what to watch". It also carries the **share line** that names a specific person ("ابعثها لصاحبك اللي…"). |
| n | **End slide** | The **comment question** (easy: one word or two options) and the follow line. The brand wordmark is added by the design, do not write it into the text. |

Open the loop on the cover and close it on the save slide. If the end can echo the cover, do it.

## Text budget per slide

| Field | Limit |
|---|---|
| Headline | 3 to 8 words, max 2 lines. Carries the slide on its own |
| Body | 0 to 22 words, max 2 short sentences. Optional on punch slides |
| List slide | max 4 items, each 2 to 6 words |
| Element | one thing only: a number, a quote (max 20 words), a comparison (A vs B), a term with its gloss, a list, a short code or link fragment |
| Latin labels | optional short Latin mono label per slide (e.g. `THE CLAIM`, `STATUS`), uppercase, max 3 words |

Count the words on every slide. If a slide is over budget, cut or split it.

## Darija rules

Follow the "Darija writing rules" of `reel-script-writer`: Algerian only (واش، كيفاش، علاش، كاين، بصح، برك، خاطر، دروك، ياسر), no Moroccan, Tunisian, Egyptian or stiff MSA words, Arabic script, technical terms and names in Latin letters (Claude, Lean, AI), every term explained the first time, no gendered self-reference. Written text may be a little tighter than spoken text, but it must still sound like a friend talking.

Numbers: write them as digits (167, $1M, 250,000) so they stand out.

## Output format

Save as `scripts/<slug>.md` and show it in the reply. Use exactly this layout.

```
# <Working title>

- Format: carousel (Instagram 1080x1440 + TikTok 1080x1920, same slides)
- Audience: general | tech
- Pillar: <pillar>
- Promise: <one sentence>
- Slides: <n> | Density: punch | dense | mixed
- Style: Report
- Assumptions: <defaults chosen, one line>

## Cover options
1. ...
2. ...
3. ... (chosen: #)

## Slides
| # | Role | Label (Latin) | Headline (Darija) | Body (Darija) | Element | Words |
|---|------|---------------|-------------------|---------------|---------|-------|
| 1 | cover | | ... | ... | ... | n |

## Publishing kit
- Caption (IG): first line repeats the hook, then 2 to 4 short lines of context, the comment question, then hashtags
- Caption (TikTok): first line = the exact words someone would search (Darija + English/French keyword), one hook line, the comment question
- Hashtags IG (5 to 8, mix broad and niche):
- Hashtags TikTok (3 to 5, on-topic only):
- Pinned comment (a question that invites replies):
- Music mood (both platforms let you add music to a photo post; suggest a mood, not a specific track):
- Follow-up idea (next carousel or video):

Hashtag and caption hygiene: one space between hashtags, no glued tags, nothing off-topic, Arabic hashtags spelled in the right order, never an empty caption.

## Sources
- <title> (<url>), for every fact taken from the web

## Verify before publishing
- <every [VERIFY] item, or "none">
```

## Final checklist (fix before answering)

- [ ] The cover is 8 words or fewer, has the topic keyword, and works as a still with no context.
- [ ] Slide 2 works on its own as a second hook.
- [ ] One idea per slide, and every body slide gives a reason to swipe.
- [ ] Every slide is within the text budget, with word counts filled in.
- [ ] The save slide exists and carries a share line naming a specific person.
- [ ] The end slide has an easy comment question.
- [ ] Facts are true and sourced, claims are written as claims, quotes are exact and attributed, uncertain items are marked `[VERIFY]`.
- [ ] Algerian Darija, terms in Latin and explained the first time.
- [ ] No layout, color, component or image direction anywhere.
- [ ] No clickbait the slides do not deliver on.
- [ ] Captions start correctly, hashtags are clean, nothing is empty.
