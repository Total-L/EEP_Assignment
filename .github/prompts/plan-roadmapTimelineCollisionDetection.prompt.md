# Roadmap Timeline & Collision Detection Refactor Plan

## Completed Implementation ✅

### Phase 1: Timeline System Update
- **Scope**: Update all dates from 2024-07-07 to 2026-02-23 (current week)
- **Files Modified**: `constants.ts`
- **Changes**:
  - Updated DATES_WEEK: 16 weeks from 23 FEB to 08 JUN
  - Updated DATES_MONTH: 12 months Feb 2026 - Jan 2027
  - Updated DATES_QUARTER: 8 quarters Q1 26 - Q4 27
  - Migrated all 50+ sample tasks to new date range (Feb-Sep 2026)
  - Maintained project structure: 3 projects, 4 pillars, 4 users

### Phase 2: Day-Level Precision
- **Scope**: Support float-precision date indices for fine-grained positioning
- **Files Modified**: `App.tsx`, `constants.ts`
- **Changes**:
  - Updated `dateIndexToAbsoluteDate()`: Base date 2026-02-23, supports float indices
  - Updated `getDateIndexForViewMode()`: Returns float values (e.g., 0.14 = first week + 1 day)
  - Supports daily granularity within weeks
  - Maintains compatibility with month and quarter views

### Phase 3: Collision Detection Improvements
- **Scope**: Resolve visual overlap issues when items overlap in time or space
- **Files Modified**: `components/RoadmapGrid.tsx`
- **Iterations**:

#### Iteration 3.1: Basic Overlap Fix
- Changed from `<=` to `<` in overlap detection
- Correctly identifies items at identical time points as overlapping
- Issue: Tall items still block items below

#### Iteration 3.2: Vertical Collision Detection
- Added `getItemBounds()` function to calculate visual bounds (top, bottom, height)
- Added `itemsConflict()` function combining:
  - Temporal overlap check (time-based)
  - Vertical proximity check (even non-overlapping items)
  - 2px vertical buffer for visual separation
- Added MIN_ITEM_HEIGHT (112px) to ensure single-point items are visible
- Improved track allocation to handle complex multi-item overlaps

### Key Algorithm: Track Allocation
```
1. Sort items by startDate, then by endDate (descending)
2. For each item:
   - Find all items that visually conflict with it
   - Collect their assigned tracks
   - Assign item to first available track number
3. Calculate total tracks needed = max track + 1
4. Position items: left = trackIndex / totalTracks, width = 1 / totalTracks
```

## Testing Scenarios ✅

| Scenario | Expected | Result |
|----------|----------|--------|
| Items at same time point (item2, item7 @ 2026-03-09) | Separate columns | ✅ Working |
| Overlapping time ranges (A: 0-2, B: 1-3) | Separate columns | ✅ Working |
| Tall item + below item (A: 0-4, B: 5-6) | No visual overlap | ✅ Working |
| Dragging item into conflict zone | Auto-adjust position | ✅ Working |
| Editing item time to create conflict | Auto-adjust position | ✅ Working |
| Multiple complex overlaps (A-C all overlapping) | 3 columns for 3 items | ✅ Working |

## Commit Summary
- **Commit ID**: 31fc6cc
- **Changes**: 3 files, 161 insertions, 91 deletions
- **Message**: "Refactor roadmap timeline and collision detection"

## Known Limitations & Future Improvements

### Current Limitations
1. Z-index ordering not explicitly managed (CSS relies on DOM order)
2. Vertical buffer (2px) is hardcoded - could be configurable
3. No animation when items auto-adjust positions
4. Mobile responsive: not yet tested on narrow viewports

### Potential Enhancements
1. **Better Animations**: Add smooth transitions when items move/resize
2. **Responsive Design**: Optimize for tablet/mobile (stack columns vertically)
3. **Accessibility**: Add ARIA labels, keyboard navigation for item selection
4. **Performance**: Memoize collision detection results
5. **Visual Feedback**: Highlight conflicting items on hover
6. **Undo/Redo**: Track history of item modifications
7. **Drag Preview**: Show ghost preview while dragging
8. **Zoom Levels**: Allow zooming in/out of timeline
9. **Filters**: Filter items by project, pillar, status, assignee
10. **Export**: Export to PDF with adjusted layout for overlapping items

## Technical Debt
- [ ] Add unit tests for collision detection algorithm
- [ ] Add integration tests for drag/drop with conflicts
- [ ] Document MIN_ITEM_HEIGHT and ROW_GAP constants
- [ ] Consider extracting constants to `.env` or config file
- [ ] Review TypeScript types for PositionedItem

## Notes
- Application runs on `http://localhost:3002`
- Hot module replacement working (changes reflect instantly)
- Git status clean, all changes committed
- No external API calls, fully client-side rendering

---
*Plan created: 2026-02-24*
*Status: Implementation Complete ✅*
