import { layoutNextLine, prepareWithSegments, setLocale } from "https://esm.sh/@chenglou/pretext@0.0.4";

const heroCopy = document.querySelector(".hero-copy");
const heroHeading = heroCopy?.querySelector(".hero-heading-fallback");
const heroStage = heroCopy?.querySelector(".hero-pretext-stage");
const heroCanvas = heroStage?.querySelector(".hero-pretext-canvas");
const heroOrb = heroStage?.querySelector(".hero-pretext-orb");
const heroContext = heroCanvas?.getContext("2d");

if (!heroCopy || !heroHeading || !heroStage || !heroCanvas || !heroOrb || !heroContext) {
  // Keep the fallback hero intact when the enhanced layer cannot boot.
} else {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(pointer: fine)");
  const mobileQuery = window.matchMedia("(max-width: 680px)");
  const preparedCache = new Map();
  const state = {
    currentX: 0.76,
    currentY: 0.36,
    targetX: 0.76,
    targetY: 0.36,
    animationFrame: 0
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function getHeroText() {
    const parts = Array.from(heroHeading.querySelectorAll(".hero-line"))
      .map((line) => line.textContent.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    return parts.join(" ");
  }

  function getPrepared(text, fontString) {
    const locale = document.documentElement.lang || "ko";
    const cacheKey = `${locale}::${fontString}::${text}`;
    const cached = preparedCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    setLocale(locale);
    const prepared = prepareWithSegments(text, fontString);
    preparedCache.set(cacheKey, prepared);
    return prepared;
  }

  function getMetrics(width) {
    const styles = getComputedStyle(heroHeading);
    const fontFamily = styles.fontFamily;
    const fontWeight = Number.parseInt(styles.fontWeight, 10) || 700;
    const baseSize = mobileQuery.matches
      ? clamp(width * 0.115, 38, 56)
      : clamp(width * 0.108, 54, 78);
    const minSize = mobileQuery.matches ? 32 : 42;

    return {
      fontFamily,
      fontWeight,
      baseSize,
      minSize
    };
  }

  function getTargetHeight(width) {
    return mobileQuery.matches
      ? clamp(width * 0.56, 196, 282)
      : clamp(width * 0.45, 252, 338);
  }

  function flowLines(prepared, width, height, fontSize) {
    const leftPad = mobileQuery.matches ? 18 : 22;
    const topPad = mobileQuery.matches ? 18 : 24;
    const rightPad = mobileQuery.matches ? 18 : 24;
    const bottomPad = mobileQuery.matches ? 18 : 22;
    const lineHeight = Math.round(fontSize * (mobileQuery.matches ? 1.05 : 1.06));
    const orbRadius = mobileQuery.matches
      ? clamp(width * 0.11, 44, 58)
      : clamp(width * 0.11, 58, 78);
    const orbX = clamp(width * state.currentX, width * 0.58, width * 0.84);
    const orbY = clamp(height * state.currentY, height * 0.22, height * 0.72);
    const fullWidth = width - leftPad - rightPad;
    const lines = [];
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let baselineY = topPad + fontSize;
    let complete = false;

    while (baselineY <= height - bottomPad + 4) {
      const lineCenterY = baselineY - fontSize * 0.42;
      let maxWidth = fullWidth;

      if (lineCenterY >= orbY - orbRadius - fontSize * 0.25 && lineCenterY <= orbY + orbRadius + fontSize * 0.12) {
        const cutoff = orbX - orbRadius - leftPad - 18;
        maxWidth = Math.min(fullWidth, Math.max(width * 0.42, cutoff));
      }

      const line = layoutNextLine(prepared, cursor, maxWidth);
      if (line === null) {
        complete = true;
        break;
      }

      lines.push({
        text: line.text.trimEnd(),
        width: line.width,
        maxWidth,
        y: baselineY
      });

      cursor = line.end;
      baselineY += lineHeight;
    }

    return {
      lines,
      complete,
      leftPad,
      rightPad,
      topPad,
      bottomPad,
      lineHeight,
      orbRadius,
      orbX,
      orbY
    };
  }

  function buildLayout(width) {
    const text = getHeroText();
    const metrics = getMetrics(width);
    let stageHeight = getTargetHeight(width);
    let fontSize = metrics.baseSize;
    let bestLayout = null;
    let fontString = "";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      fontString = `${metrics.fontWeight} ${fontSize}px ${metrics.fontFamily}`;
      const prepared = getPrepared(text, fontString);
      const layout = flowLines(prepared, width, stageHeight, fontSize);
      const neededHeight = layout.topPad + layout.lines.length * layout.lineHeight + layout.bottomPad;
      bestLayout = { ...layout, fontSize, fontString, text };

      if (layout.complete && neededHeight <= stageHeight + 6) {
        break;
      }

      const expandedHeight = clamp(neededHeight + 18, getTargetHeight(width), mobileQuery.matches ? 304 : 360);
      if (expandedHeight > stageHeight + 4) {
        stageHeight = expandedHeight;
      } else {
        fontSize = Math.max(metrics.minSize, fontSize * 0.92);
      }
    }

    return {
      ...bestLayout,
      stageHeight
    };
  }

  function positionOrb(layout) {
    const size = layout.orbRadius * 2;
    heroOrb.style.width = `${size}px`;
    heroOrb.style.height = `${size}px`;
    heroOrb.style.transform = `translate(${layout.orbX - layout.orbRadius}px, ${layout.orbY - layout.orbRadius}px)`;
  }

  function paint(layout, width, height) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    heroCanvas.width = Math.round(width * dpr);
    heroCanvas.height = Math.round(height * dpr);
    heroCanvas.style.width = `${width}px`;
    heroCanvas.style.height = `${height}px`;
    heroContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    heroContext.clearRect(0, 0, width, height);
    heroContext.textBaseline = "alphabetic";
    heroContext.font = layout.fontString;

    layout.lines.forEach((line, index) => {
      const intersectsOrb = line.maxWidth < width - layout.leftPad - layout.rightPad - 18;
      const x = layout.leftPad + (intersectsOrb ? 2 : 0) + (index % 2 === 1 ? 4 : 0);
      const gradient = heroContext.createLinearGradient(x, 0, x + line.maxWidth, 0);
      gradient.addColorStop(0, "#2f261f");
      gradient.addColorStop(intersectsOrb ? 0.76 : 1, "#2f261f");
      gradient.addColorStop(1, intersectsOrb ? "#ff6b45" : "#2f261f");

      heroContext.save();
      heroContext.fillStyle = "rgba(255, 140, 107, 0.15)";
      heroContext.fillText(line.text, x + 2, line.y + 2);
      heroContext.fillStyle = gradient;
      heroContext.fillText(line.text, x, line.y);
      heroContext.restore();
    });
  }

  function render() {
    const width = Math.max(320, Math.floor(heroCopy.clientWidth));
    const layout = buildLayout(width);
    heroStage.style.height = `${layout.stageHeight}px`;
    positionOrb(layout);
    paint(layout, width, layout.stageHeight);
  }

  function cancelAnimation() {
    if (state.animationFrame) {
      cancelAnimationFrame(state.animationFrame);
      state.animationFrame = 0;
    }
  }

  function animate() {
    const dx = state.targetX - state.currentX;
    const dy = state.targetY - state.currentY;

    state.currentX += dx * 0.16;
    state.currentY += dy * 0.16;
    render();

    if (Math.abs(dx) < 0.002 && Math.abs(dy) < 0.002) {
      state.currentX = state.targetX;
      state.currentY = state.targetY;
      cancelAnimation();
      render();
      return;
    }

    state.animationFrame = requestAnimationFrame(animate);
  }

  function kickAnimation() {
    if (reducedMotionQuery.matches || !finePointerQuery.matches) {
      render();
      return;
    }

    if (!state.animationFrame) {
      state.animationFrame = requestAnimationFrame(animate);
    }
  }

  function resetTargets() {
    state.targetX = 0.76;
    state.targetY = 0.36;
    kickAnimation();
  }

  function handlePointerMove(event) {
    if (reducedMotionQuery.matches || !finePointerQuery.matches) {
      return;
    }

    const bounds = heroStage.getBoundingClientRect();
    state.targetX = clamp((event.clientX - bounds.left) / bounds.width, 0.58, 0.84);
    state.targetY = clamp((event.clientY - bounds.top) / bounds.height, 0.22, 0.72);
    kickAnimation();
  }

  function mount() {
    heroCopy.classList.add("hero-pretext-ready");
    render();
  }

  const heroObserver = new MutationObserver(() => {
    preparedCache.clear();
    render();
  });
  heroObserver.observe(heroHeading, {
    subtree: true,
    childList: true,
    characterData: true
  });

  const langObserver = new MutationObserver(() => {
    preparedCache.clear();
    render();
  });
  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  const resizeObserver = new ResizeObserver(() => {
    render();
  });
  resizeObserver.observe(heroCopy);

  heroStage.addEventListener("pointermove", handlePointerMove);
  heroStage.addEventListener("pointerleave", resetTargets);
  window.addEventListener("resize", render);
  reducedMotionQuery.addEventListener("change", resetTargets);
  mobileQuery.addEventListener("change", () => {
    preparedCache.clear();
    resetTargets();
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(mount);
  } else {
    mount();
  }
}
