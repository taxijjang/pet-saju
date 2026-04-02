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
  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
  const mobileQuery = window.matchMedia("(max-width: 680px)");
  const preparedCache = new Map();
  const state = {
    currentX: 0.83,
    currentY: 0.34,
    targetX: 0.83,
    targetY: 0.34,
    animationFrame: 0
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function shouldUseHeroPretext() {
    return !mobileQuery.matches && !coarsePointerQuery.matches;
  }

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
      ? clamp(width * 0.098, 40, 54)
      : clamp(width * 0.098, 50, 72);
    const orbX = clamp(width * state.currentX, width * 0.64, width * 0.88);
    const orbY = clamp(height * state.currentY, height * 0.2, height * 0.68);
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
    if (!shouldUseHeroPretext()) {
      heroCopy.classList.remove("hero-pretext-ready");
      cancelAnimation();
      return;
    }

    heroCopy.classList.add("hero-pretext-ready");
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
    state.targetX = 0.83;
    state.targetY = 0.34;
    kickAnimation();
  }

  function handlePointerMove(event) {
    if (reducedMotionQuery.matches || !finePointerQuery.matches) {
      return;
    }

    const bounds = heroStage.getBoundingClientRect();
    state.targetX = clamp((event.clientX - bounds.left) / bounds.width, 0.64, 0.88);
    state.targetY = clamp((event.clientY - bounds.top) / bounds.height, 0.2, 0.68);
    kickAnimation();
  }

  function mount() {
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
  coarsePointerQuery.addEventListener("change", () => {
    preparedCache.clear();
    resetTargets();
    render();
  });
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

const secondaryMobileQuery = window.matchMedia("(max-width: 680px)");
const secondaryPreparedCache = new Map();

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getPreparedText(text, fontString) {
  const locale = document.documentElement.lang || "ko";
  const cacheKey = `${locale}::${fontString}::${text}`;
  const cached = secondaryPreparedCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  setLocale(locale);
  const prepared = prepareWithSegments(text, fontString);
  secondaryPreparedCache.set(cacheKey, prepared);
  return prepared;
}

function mountSecondaryPretext(target, options) {
  if (!target || !target.parentElement) {
    return;
  }

  const shell = document.createElement("div");
  shell.className = `pretext-shell ${options.shellClass}`.trim();

  const canvas = document.createElement("canvas");
  canvas.className = "pretext-canvas";
  shell.append(canvas);

  let orb = null;
  if (options.orb) {
    orb = document.createElement("div");
    orb.className = "pretext-orb";
    shell.append(orb);
  }

  target.before(shell);
  const context = canvas.getContext("2d");
  if (!context) {
    shell.remove();
    return;
  }

  function getText() {
    return target.textContent.replace(/\s+/g, " ").trim();
  }

  function getAvailableWidth() {
    const shellWidth = Math.floor(shell.getBoundingClientRect().width);
    if (shellWidth > 0) {
      return shellWidth;
    }

    const targetWidth = Math.floor(target.getBoundingClientRect().width);
    if (targetWidth > 0) {
      return targetWidth;
    }

    const parentRectWidth = target.parentElement ? target.parentElement.getBoundingClientRect().width : 0;
    const parentStyles = target.parentElement ? getComputedStyle(target.parentElement) : null;
    const paddingLeft = parentStyles ? Number.parseFloat(parentStyles.paddingLeft) || 0 : 0;
    const paddingRight = parentStyles ? Number.parseFloat(parentStyles.paddingRight) || 0 : 0;
    const parentContentWidth = Math.floor(parentRectWidth - paddingLeft - paddingRight);

    if (parentContentWidth > 0) {
      return parentContentWidth;
    }

    return options.minWidth;
  }

  function buildLayout(width) {
    const text = getText();
    const styles = getComputedStyle(target);
    const fontFamily = styles.fontFamily;
    const fontWeight = Number.parseInt(styles.fontWeight, 10) || 700;
    let fontSize = secondaryMobileQuery.matches
      ? clampValue(width * options.mobileFontScale, options.mobileMinFont, options.mobileMaxFont)
      : clampValue(width * options.desktopFontScale, options.desktopMinFont, options.desktopMaxFont);
    let stageHeight = options.minHeight(width);
    let bestLayout = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const fontString = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const prepared = getPreparedText(text, fontString);
      const paddingX = secondaryMobileQuery.matches ? options.mobilePaddingX : options.desktopPaddingX;
      const topPad = secondaryMobileQuery.matches ? options.mobilePaddingTop : options.desktopPaddingTop;
      const bottomPad = secondaryMobileQuery.matches ? options.mobilePaddingBottom : options.desktopPaddingBottom;
      const lineHeight = Math.round(fontSize * options.lineHeight);
      const fullWidth = width - paddingX * 2;
      const orbRadius = options.orb
        ? (secondaryMobileQuery.matches ? options.mobileOrbRadius(width) : options.desktopOrbRadius(width))
        : 0;
      const orbX = width * options.orbX;
      const orbY = stageHeight * options.orbY;
      const lines = [];
      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      let baselineY = topPad + fontSize;
      let complete = false;

      while (baselineY <= stageHeight - bottomPad + 4) {
        const lineCenterY = baselineY - fontSize * 0.42;
        let maxWidth = fullWidth;

        if (options.orb && lineCenterY >= orbY - orbRadius - fontSize * 0.2 && lineCenterY <= orbY + orbRadius + fontSize * 0.1) {
          const cutoff = orbX - orbRadius - paddingX - 14;
          maxWidth = Math.min(fullWidth, Math.max(width * options.minWidthRatio, cutoff));
        }

        const line = layoutNextLine(prepared, cursor, maxWidth);
        if (line === null) {
          complete = true;
          break;
        }

        lines.push({
          text: line.text.trimEnd(),
          y: baselineY,
          maxWidth
        });
        cursor = line.end;
        baselineY += lineHeight;
      }

      const neededHeight = topPad + lines.length * lineHeight + bottomPad;
      bestLayout = {
        text,
        fontString,
        fontSize,
        lines,
        stageHeight,
        paddingX,
        topPad,
        lineHeight,
        orbRadius,
        orbX,
        orbY,
        fullWidth,
        complete
      };

      if (complete && neededHeight <= stageHeight + 4) {
        break;
      }

      const expandedHeight = clampValue(neededHeight + 14, options.minHeight(width), options.maxHeight(width));
      if (expandedHeight > stageHeight + 2) {
        stageHeight = expandedHeight;
      } else {
        fontSize = Math.max(options.mobileMinFont, fontSize * 0.92);
      }
    }

    return bestLayout;
  }

  function render() {
    const text = getText();
    if (!text) {
      shell.hidden = true;
      shell.classList.remove("pretext-active");
      target.classList.remove("pretext-fallback-hidden");
      return;
    }

    shell.hidden = false;
    shell.classList.add("pretext-active");
    const width = getAvailableWidth();
    const layout = buildLayout(width);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    shell.style.height = `${layout.stageHeight}px`;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(layout.stageHeight * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${layout.stageHeight}px`;
    target.classList.add("pretext-fallback-hidden");

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, layout.stageHeight);
    context.textBaseline = "alphabetic";
    context.font = layout.fontString;

    if (orb) {
      const size = layout.orbRadius * 2;
      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.transform = `translate(${layout.orbX - layout.orbRadius}px, ${layout.orbY - layout.orbRadius}px)`;
    }

    layout.lines.forEach((line, index) => {
      const x = layout.paddingX + (index % 2 === 1 ? options.lineNudge : 0);
      const gradient = context.createLinearGradient(x, 0, x + line.maxWidth, 0);
      gradient.addColorStop(0, options.startColor);
      gradient.addColorStop(options.midStop, options.midColor);
      gradient.addColorStop(1, options.endColor);

      context.save();
      context.fillStyle = options.shadowColor;
      context.fillText(line.text, x + 1.5, line.y + 1.5);
      context.fillStyle = gradient;
      context.fillText(line.text, x, line.y);
      context.restore();
    });
  }

  const mutationObserver = new MutationObserver(() => {
    secondaryPreparedCache.clear();
    render();
  });
  mutationObserver.observe(target, {
    subtree: true,
    childList: true,
    characterData: true
  });

  const langObserver = new MutationObserver(() => {
    secondaryPreparedCache.clear();
    render();
  });
  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  const resizeObserver = new ResizeObserver(() => {
    render();
  });
  resizeObserver.observe(target.parentElement);

  secondaryMobileQuery.addEventListener("change", () => {
    secondaryPreparedCache.clear();
    render();
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(render);
  } else {
    render();
  }
}

mountSecondaryPretext(document.querySelector("#result-title"), {
  shellClass: "result-pretext-shell",
  orb: true,
  minWidth: 240,
  desktopFontScale: 0.06,
  mobileFontScale: 0.08,
  desktopMinFont: 28,
  desktopMaxFont: 42,
  mobileMinFont: 24,
  mobileMaxFont: 34,
  desktopPaddingX: 18,
  mobilePaddingX: 16,
  desktopPaddingTop: 16,
  mobilePaddingTop: 14,
  desktopPaddingBottom: 16,
  mobilePaddingBottom: 14,
  desktopOrbRadius: (width) => clampValue(width * 0.1, 28, 42),
  mobileOrbRadius: (width) => clampValue(width * 0.1, 22, 34),
  orbX: 0.83,
  orbY: 0.34,
  minWidthRatio: 0.54,
  lineHeight: 1.08,
  lineNudge: 3,
  startColor: "#2f261f",
  midColor: "#2f261f",
  endColor: "#ff6b45",
  midStop: 0.72,
  shadowColor: "rgba(255, 140, 107, 0.12)",
  minHeight: (width) => (secondaryMobileQuery.matches ? clampValue(width * 0.28, 72, 108) : clampValue(width * 0.18, 82, 132)),
  maxHeight: (width) => (secondaryMobileQuery.matches ? clampValue(width * 0.56, 140, 196) : clampValue(width * 0.34, 140, 220))
});

mountSecondaryPretext(document.querySelector("#type-name"), {
  shellClass: "mini-pretext-shell",
  orb: false,
  minWidth: 160,
  desktopFontScale: 0.088,
  mobileFontScale: 0.1,
  desktopMinFont: 24,
  desktopMaxFont: 34,
  mobileMinFont: 22,
  mobileMaxFont: 30,
  desktopPaddingX: 12,
  mobilePaddingX: 12,
  desktopPaddingTop: 10,
  mobilePaddingTop: 10,
  desktopPaddingBottom: 10,
  mobilePaddingBottom: 10,
  desktopOrbRadius: () => 0,
  mobileOrbRadius: () => 0,
  orbX: 0,
  orbY: 0,
  minWidthRatio: 1,
  lineHeight: 1.04,
  lineNudge: 2,
  startColor: "#2f261f",
  midColor: "#2f261f",
  endColor: "#ff7a55",
  midStop: 0.82,
  shadowColor: "rgba(255, 217, 128, 0.16)",
  minHeight: (width) => (secondaryMobileQuery.matches ? clampValue(width * 0.18, 48, 84) : clampValue(width * 0.15, 52, 90)),
  maxHeight: (width) => (secondaryMobileQuery.matches ? clampValue(width * 0.3, 74, 118) : clampValue(width * 0.28, 80, 126))
});

mountSecondaryPretext(document.querySelector("#rhythm-title"), {
  shellClass: "mini-pretext-shell soft",
  orb: false,
  minWidth: 160,
  desktopFontScale: 0.08,
  mobileFontScale: 0.1,
  desktopMinFont: 22,
  desktopMaxFont: 32,
  mobileMinFont: 20,
  mobileMaxFont: 28,
  desktopPaddingX: 12,
  mobilePaddingX: 12,
  desktopPaddingTop: 10,
  mobilePaddingTop: 10,
  desktopPaddingBottom: 10,
  mobilePaddingBottom: 10,
  desktopOrbRadius: () => 0,
  mobileOrbRadius: () => 0,
  orbX: 0,
  orbY: 0,
  minWidthRatio: 1,
  lineHeight: 1.04,
  lineNudge: 2,
  startColor: "#2f261f",
  midColor: "#2f261f",
  endColor: "#48bba6",
  midStop: 0.84,
  shadowColor: "rgba(122, 211, 195, 0.14)",
  minHeight: (width) => (secondaryMobileQuery.matches ? clampValue(width * 0.18, 48, 84) : clampValue(width * 0.15, 52, 90)),
  maxHeight: (width) => (secondaryMobileQuery.matches ? clampValue(width * 0.3, 74, 118) : clampValue(width * 0.28, 80, 126))
});

const sectionHeadingTargets = [
  { selector: "#form-section-title", endColor: "#ff7a55", shadowColor: "rgba(255, 217, 128, 0.18)" },
  { selector: "#result-section-title", endColor: "#48bba6", shadowColor: "rgba(122, 211, 195, 0.16)" }
];

sectionHeadingTargets.forEach(({ selector, endColor, shadowColor }) => {
  mountSecondaryPretext(document.querySelector(selector), {
    shellClass: "section-pretext-shell",
    orb: false,
    minWidth: 180,
    desktopFontScale: 0.046,
    mobileFontScale: 0.065,
    desktopMinFont: 24,
    desktopMaxFont: 34,
    mobileMinFont: 21,
    mobileMaxFont: 28,
    desktopPaddingX: 10,
    mobilePaddingX: 8,
    desktopPaddingTop: 8,
    mobilePaddingTop: 6,
    desktopPaddingBottom: 8,
    mobilePaddingBottom: 6,
    desktopOrbRadius: () => 0,
    mobileOrbRadius: () => 0,
    orbX: 0,
    orbY: 0,
    minWidthRatio: 1,
    lineHeight: 1.04,
    lineNudge: 2,
    startColor: "#2f261f",
    midColor: "#2f261f",
    endColor,
    midStop: 0.86,
    shadowColor,
    minHeight: (width) => (secondaryMobileQuery.matches ? clampValue(width * 0.16, 44, 84) : clampValue(width * 0.11, 46, 86)),
    maxHeight: (width) => (secondaryMobileQuery.matches ? clampValue(width * 0.42, 76, 154) : clampValue(width * 0.24, 84, 152))
  });
});
