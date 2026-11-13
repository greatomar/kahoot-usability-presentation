# HTML vs final PPTX comparison

The HTML deck is the design source of truth. The final PPTX was opened and corrected in **DeckCraft**, saved to `final/`, and rendered for a slide-by-slide comparison.

## Files

| Item | Path |
|---|---|
| Final HTML | `final/kahoot-usability-presentation-final.html` |
| Final PPTX | `final/kahoot-usability-presentation-final.pptx` |
| HTML renders | `comparison/html/slide-01.png … slide-12.png` |
| PPTX renders | `comparison/pptx-final/slide-1.png … slide-12.png` |
| Side-by-side images | `comparison/side-by-side/slide-01.png … slide-12.png` |
| All-slides comparison sheet | `comparison/comparison-montage.png` |

Each side-by-side image has **HTML on the left** and **final PPTX on the right**.

## Mismatches found and corrected in DeckCraft

1. **Slide 2 — screenshot order**
   - PPTX had the five phones in left-to-right source order.
   - HTML reads right-to-left: الرئيسية → الاستكشاف → الانضمام → الإنشاء → المكتبة.
   - The entire image/caption group was mirrored to match the HTML order.

2. **Slide 4 — group labels**
   - PPTX labels were shortened to “High School” / “Middle School”.
   - Updated to “High School Students” / “Middle School Students” to match HTML.

3. **Slide 11 — accent dots**
   - PPTX bullet markers used the red accent.
   - Changed to the HTML lavender `#B79BE8`.

4. **Slide 11 — round-trip repair**
   - The first DeckCraft export distorted slide 11’s card geometry.
   - The slide was re-imported from the clean native build and the dot colour was re-applied; the exported deck now renders correctly.

## Remaining intentional difference

- **Slide 6 — task steps**: HTML uses pill/chip steps; PPTX uses numbered editable lines. Content, order, and meaning are identical. This is the only visible layout adaptation kept for native PowerPoint editability.

All other slides use the same content, data, hierarchy, colours, logos, screenshots, tables, and icon-only footer.

## Validation

- HTML QA: 12 slides, no overflow, no console errors, fully offline.
- PPTX `slides_test.py`: **no overflow detected**.
- PPTX `detect_font.py`: **no missing or substituted fonts**.
- Final PPTX opens as 12 slides and all tables/charts/text remain native and editable.
