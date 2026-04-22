ut u# Venture Feature Updates - Analysis Notes + Chatbot

## Previous
1-4. ✅ Notes, chatbot, scrolling fixed.

## New: Planning Guide PDF
1. [ ] Install html2canvas jspdf.
2. [ ] Create PlanningGuide.tsx.
3. [ ] Add Download button to ResultsPanel top rec card.
4. [ ] Test download.
5. [ ] Complete.

**Progress**: Starting PDF guide.

## Plan Breakdown
1. ✅ Create `frontend/src/components/Chatbot.tsx` - New component with input, messages state, rule-based responses using PredictResponse data.
2. ✅ Edit `frontend/src/components/ResultsPanel.tsx` - Add AnalysisNotes section in DataState after ranked list (3-4 dynamic bullets from anchors/competitors/top recs).
3. ✅ Edit `frontend/src/app/explore/page.tsx` - Import Chatbot, add <Chatbot data={data} /> at panel bottom when data present.
4. ✅ Test: /explore functional (notes, chatbot, scrolling OK post-fixes).
5. [ ] attempt_completion

**Progress**: Complete, duplicate import removed, app live.
