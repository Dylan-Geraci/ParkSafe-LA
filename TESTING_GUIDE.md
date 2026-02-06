# Phase 3 Testing Guide

## Quick Start
```bash
cd frontend
npm start
```

The app will open at http://localhost:3000

---

## Test Scenarios

### 1. Basic Functionality ✅
**Test the core features still work:**

1. Open http://localhost:3000
2. Fill in form:
   - ZIP: 90001
   - Day: Monday
   - Hour: 11
   - AM/PM: AM
3. Click "Analyze Risk"
4. ✅ Verify:
   - Loading skeleton appears
   - Results cards populate
   - Risk score animates
   - Timeline chart appears
   - Search saved to history

---

### 2. PDF Export 📄

**Test PDF generation:**

1. Complete a risk analysis (see test 1)
2. After results appear, look for "Download PDF" button
3. Click the button
4. ✅ Verify:
   - Button shows loading state
   - Success toast appears: "PDF report downloaded successfully!"
   - PDF file downloads to your computer
   - Open PDF and check:
     - Header: "ParkSafe-LA Risk Analysis Report"
     - Timestamp is current
     - Input parameters are correct (ZIP, day, time)
     - Risk score matches (with colored badge)
     - Risk factors with progress bars
     - All recommendations listed
     - Disclaimer at bottom
     - Page number in footer

**Test different risk levels:**
- High Risk: ZIP 90001, Monday 11 AM
- Medium Risk: ZIP 90210, Wednesday 2 PM
- Low Risk: ZIP 90210, Sunday 7 AM

PDF colors should change based on risk level.

---

### 3. Shareable URLs 🔗

**Test URL sharing:**

1. Complete a risk analysis
2. Click "Share Link" button
3. ✅ Verify:
   - Success toast: "Shareable link copied to clipboard!"
   - Button shows checkmark icon briefly
4. Open a new incognito/private browser window
5. Paste the URL and press Enter
6. ✅ Verify:
   - Form pre-fills with the same data
   - ZIP code, day, hour, and AM/PM all match

**Test the URL format:**
Should look like:
```
http://localhost:3000/?zip=90001&day=Monday&hour=11&ampm=AM
```

**Test URL updates:**
1. Complete an analysis
2. Check browser address bar
3. ✅ Verify URL contains parameters

**Test invalid URLs:**
Try these URLs and verify they don't crash:
- `http://localhost:3000/?zip=invalid`
- `http://localhost:3000/?zip=90001` (missing params)
- `http://localhost:3000/?zip=90001&day=Funday&hour=99&ampm=XM`

App should gracefully ignore invalid parameters.

---

### 4. Offline Detection 📡

**Test offline banner:**

1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Go to Network tab
3. Change dropdown from "Online" to "Offline"
4. ✅ Verify:
   - Orange banner appears at top
   - Message: "You're offline. Check your internet connection."
   - Warning icon visible
5. Try to submit the form
6. ✅ Verify:
   - Form submission prevented
   - Toast error: "You are offline. Please check your connection."
7. Change DevTools back to "Online"
8. ✅ Verify:
   - Teal banner appears: "You're back online!"
   - Banner auto-dismisses after ~3 seconds

**Test form disabled state:**
- While offline, submit button should be disabled or loading

---

### 5. Error Handling 🛡️

**Test timeout (requires backend modification):**

Option A - Simulate slow network:
1. Open DevTools → Network tab
2. Change to "Slow 3G" or "Fast 3G"
3. Submit form
4. Wait and observe
5. If it takes >30 seconds, should show timeout error

Option B - Without backend:
- Error handling is in code, will trigger on actual timeouts

**Test network errors:**
1. Stop your backend server
2. Submit the form
3. ✅ Verify error message appears (not generic "Error occurred")
4. ✅ Verify retry button works

**Test validation errors:**
1. Try to submit empty form
2. ✅ Verify validation prevents submission
3. Try invalid ZIP (4 digits)
4. ✅ Verify validation feedback

---

### 6. Error Boundary 🚨

**Test React error catching:**

⚠️ **Warning:** This will temporarily break your app. Only do if comfortable editing code.

1. Open `src/App.js`
2. Add this line inside the return statement (around line 105):
   ```javascript
   {Math.random() > 0.5 && throw new Error('Test error')}
   ```
3. Save file
4. Refresh browser
5. ✅ Verify:
   - App doesn't crash to blank white screen
   - Error boundary fallback UI appears
   - Shows: "Oops! Something went wrong"
   - "Reload Page" button visible
6. Click reload button
7. ✅ Verify page reloads
8. **Remove the error line from code**

---

### 7. Integration Tests 🔄

**Test complete user flow:**

1. Open fresh browser (incognito)
2. Visit shared URL: `http://localhost:3000/?zip=90001&day=Monday&hour=11&ampm=AM`
3. ✅ Verify form pre-fills
4. Click "Analyze Risk"
5. ✅ Verify results appear
6. Click "Download PDF"
7. ✅ Verify PDF downloads correctly
8. Click "Share Link"
9. ✅ Verify link copies
10. Open another tab with the link
11. ✅ Verify same form data
12. Check search history
13. ✅ Verify entry saved
14. Click history item
15. ✅ Verify form reloads

**Test timeline interaction + export:**
1. Complete analysis
2. Click a bar on timeline chart
3. ✅ Verify form updates
4. Submit new analysis
5. Download PDF
6. ✅ Verify PDF has new time

---

### 8. Mobile Responsiveness 📱

**Test on mobile viewport:**

1. Open DevTools (F12)
2. Click device toolbar icon (toggle device mode)
3. Select iPhone 12 Pro or similar
4. Test all features:
   - Form input
   - Results display
   - PDF export button
   - Share button
   - Timeline chart
   - Search history
   - Offline banner

✅ Verify:
- Everything fits on screen
- No horizontal scroll
- Buttons are tappable
- Text is readable
- Modals/toasts appear correctly

**Test different sizes:**
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full HD)

---

### 9. Accessibility ♿

**Keyboard navigation:**
1. Use only keyboard (Tab, Enter, Space)
2. Navigate through form
3. ✅ Verify focus visible
4. Submit with Enter key
5. Tab to export/share buttons
6. ✅ Verify tooltips appear on focus

**Screen reader (optional):**
1. Enable VoiceOver (Mac: Cmd+F5) or NVDA (Windows)
2. Navigate through app
3. ✅ Verify announcements make sense

**Reduced motion:**
1. Enable reduced motion in OS settings
2. Refresh app
3. ✅ Verify animations are minimal

---

### 10. Performance 🚀

**Test build size:**
```bash
npm run build
```

Check output:
- Main bundle should be ~350KB gzipped
- ✅ Reasonable for features included

**Test loading speed:**
1. Open DevTools → Network tab
2. Refresh page
3. Check load time
4. ✅ Should load in <2 seconds on good connection

---

## Common Issues & Solutions

### Issue: PDF doesn't download
- **Check:** Browser popup blocker
- **Fix:** Allow popups for localhost

### Issue: Clipboard doesn't work
- **Check:** Browser permissions
- **Note:** Won't work on non-HTTPS in some browsers

### Issue: Offline banner doesn't appear
- **Check:** DevTools Network tab is set to Offline
- **Try:** Physically disconnect WiFi

### Issue: Form doesn't pre-fill from URL
- **Check:** URL parameters are formatted correctly
- **Try:** Clear browser cache and reload

### Issue: Build fails
- **Run:** `npm install` to ensure all dependencies
- **Check:** Node version (should be 14+)

---

## Success Criteria

✅ **Phase 3 is fully functional if:**

- [ ] PDF downloads with correct data
- [ ] Share button copies URL
- [ ] Shared URLs pre-fill form
- [ ] Offline banner works
- [ ] Error messages are clear
- [ ] App doesn't crash on errors
- [ ] All features work on mobile
- [ ] No console errors in normal use

---

## Next Steps After Testing

1. **If bugs found:** Create list and fix
2. **If all works:** Ready for Phase 4 (visual polish) or deployment
3. **Document findings:** Note any UX improvements needed

---

## Quick Command Reference

```bash
# Start dev server
npm start

# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build

# Update browser data (fix warning)
npx update-browserslist-db@latest

# Check for dependency updates
npm outdated
```

---

## Browser Testing Checklist

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

All Phase 3 features should work in all modern browsers.

---

## Automated Testing (Future)

Consider adding:
- Jest unit tests for utilities
- React Testing Library for components
- Cypress/Playwright for E2E tests
- Visual regression tests

For now, manual testing is sufficient for portfolio project.
