# Yuna session summary

## 04.10.2026, Sunday

1. **OKX 401 error (code 50123)**
   - **Challenge:** The first buy order was rejected because the API key had no trading permission.
   - **Solution:** After tracing the error to the key's permissions on OKX's side, I set up a demo key with USDT trading enabled (only BTC was selected), and orders later went through.

2. **Awkward gap and full-width stretch**
   - **Challenge:** The hero cards left a gap above Open Orders, and the content ran edge to edge.
   - **Solution:** I centred the page with a `max-w-5xl` wrapper, made the left column a flex column so the hero cards grow, and dropped `h-full` and `pt-2`.

3. **Drawer not animating**
   - **Challenge:** The settings drawer snapped open and closed instead of sliding.
   - **Solution:** I transitioned the `translate` property instead of `transform`, since Tailwind v4 uses `translate`, and added a smoother easing curve.

**Still open:** the sell branch's `continue` skips the 10-second sleep when I hold no BTC, so the loop would call OKX nonstop in that case.