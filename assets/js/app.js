const fluidDb = {
      "Вода (20°C)": { rho: 998, mu: 1.0 },
      "Мляко цяло (~20°C)": { rho: 1030, mu: 2.0 },
      "Мляко обезмаслено (~20°C)": { rho: 1035, mu: 1.7 },
      "Суроватка (~20°C)": { rho: 1025, mu: 1.3 },
      "Сметана 20% (~20°C)": { rho: 1010, mu: 5.0 },
      "Ръчно въвеждане": { rho: 1000, mu: 1.0 }
    };

    const pipeSeries = {
      "DIN EN 10357, серия A (DIN 11850)": [
        { dn: "DN10", od: 13.0, t: 1.5 },
        { dn: "DN15", od: 19.0, t: 1.5 },
        { dn: "DN20", od: 23.0, t: 1.5 },
        { dn: "DN25", od: 29.0, t: 1.5 },
        { dn: "DN32", od: 35.0, t: 1.5 },
        { dn: "DN40", od: 41.0, t: 1.5 },
        { dn: "DN50", od: 53.0, t: 1.5 },
        { dn: "DN65", od: 70.0, t: 2.0 },
        { dn: "DN80", od: 85.0, t: 2.0 },
        { dn: "DN100", od: 104.0, t: 2.0 }
      ],
      "DIN EN 10357, серия D (ISO 2037)": [
        { dn: "1\" (≈DN25)", od: 25.0, t: 1.2 },
        { dn: "1 1/4\" (≈DN32)", od: 32.0, t: 1.2 },
        { dn: "1 1/2\" (≈DN40)", od: 38.0, t: 1.2 },
        { dn: "2\" (≈DN50)", od: 51.0, t: 1.2 },
        { dn: "2 1/2\" (≈DN65)", od: 63.5, t: 1.6 },
        { dn: "3\" (≈DN80)", od: 76.1, t: 1.6 },
        { dn: "4\" (≈DN100)", od: 101.6, t: 2.0 }
      ]
    };

    const elbowLibrary = {
      "DIN 11852 | 90° санитарно коляно EN 10357-A (табличен R)": {
        k: 0.60,
        lOverD: 30,
        radiusD: 1.5,
        radiusMmByDn: {
          DN10: 26,
          DN15: 35,
          DN20: 40,
          DN25: 50,
          DN32: 55,
          DN40: 60,
          DN50: 70,
          DN65: 80,
          DN80: 90,
          DN100: 100
        },
        source: "DIN 11852 / EN 10357-A каталожни размери: табличен радиус R по DN"
      },
      "Crane TP-410 | 90° long radius welded (R/D≈1.5)": {
        k: 0.45,
        lOverD: 30,
        radiusD: 1.5,
        source: "Crane TP-410 (референтни индустриални стойности)"
      },
      "Crane TP-410 | 90° short radius welded (R/D≈1.0)": {
        k: 0.90,
        lOverD: 50,
        radiusD: 1.0,
        source: "Crane TP-410 (референтни индустриални стойности)"
      },
      "Idelchik | 90° smooth elbow (типично)": {
        k: 0.60,
        lOverD: 35,
        radiusD: 1.5,
        source: "Idelchik handbook (типичен диапазон, уточнява се по геометрия)"
      },
      "Ръчно въвеждане": {
        k: 0.90,
        lOverD: 30,
        radiusD: 1.5,
        source: "Потребителски вход"
      }
    };

    const fittingLibrary11852 = {
      "DIN 11852 | Гладко коляно/елемент (типично)": {
        k: 1.20,
        source: "Референтни локални съпротивления за санитарни фитинги (Crane/Idelchik, типичен диапазон)"
      },
      "DIN 11852 | По-консервативна стойност": {
        k: 1.50,
        source: "Консервативна проектна стойност при неизвестна геометрия/състояние"
      },
      "Ръчно въвеждане": {
        k: 1.50,
        source: "Потребителски вход"
      }
    };

    const fittingLibrary11851 = {
      "DIN 11851 | Резбово съединение (типично)": {
        k: 0.80,
        source: "Референтни локални съпротивления за резбови връзки (типична оценка)"
      },
      "DIN 11851 | По-консервативна стойност": {
        k: 1.10,
        source: "Консервативна проектна стойност при повишени локални загуби"
      },
      "Ръчно въвеждане": {
        k: 0.80,
        source: "Потребителски вход"
      }
    };

    const fittingLibrary32676 = {
      "DIN 32676 | Tri-clamp (типично)": {
        k: 0.20,
        source: "Референтни локални съпротивления за клампови връзки (типична оценка)"
      },
      "DIN 32676 | По-консервативна стойност": {
        k: 0.35,
        source: "Консервативна проектна стойност при по-неблагоприятни връзки"
      },
      "Ръчно въвеждане": {
        k: 0.20,
        source: "Потребителски вход"
      }
    };

    const routeComponentLibrary = [
      { key: "butterflySmall", label: "Butterfly valve fully open (DN25-DN50)", zeta: 0.50 },
      { key: "butterflyLarge", label: "Butterfly valve fully open (DN65-DN100)", zeta: 0.35 },
      { key: "ballValve", label: "Ball valve fully open", zeta: 0.10 },
      { key: "gateValve", label: "Gate valve fully open", zeta: 0.20 },
      { key: "checkSwing", label: "Check valve (swing type)", zeta: 2.50 },
      { key: "checkLift", label: "Check valve (lift type)", zeta: 8.00 },
      { key: "diaphragm", label: "Diaphragm valve fully open", zeta: 2.30 },
      { key: "din11852Fitting", label: "DIN 11852 санитарен фитинг/тройник (типично)", zeta: 1.20 },
      { key: "din11851Thread", label: "DIN 11851 резбово съединение (типично)", zeta: 0.80 },
      { key: "din32676Clamp", label: "DIN 32676 клампово съединение (типично)", zeta: 0.20 },
      { key: "sharpEntry", label: "Sharp entry (tank->pipe)", zeta: 0.50 },
      { key: "sharpExit", label: "Sharp exit (pipe->tank)", zeta: 1.00 },
      { key: "roundedEntry", label: "Rounded entry", zeta: 0.05 }
    ];

    const fluidSelect = document.getElementById("fluid");
    const rhoInput = document.getElementById("rho");
    const muInput = document.getElementById("mu");
    const pipeStandardSelect = document.getElementById("pipeStandard");
    const pipeSizeSelect = document.getElementById("pipeSize");
    const elbowTypeSelect = document.getElementById("elbowType");
    const elbowSourceInfo = document.getElementById("elbowSourceInfo");
    const lib11852Select = document.getElementById("lib11852");
    const lib11851Select = document.getElementById("lib11851");
    const lib32676Select = document.getElementById("lib32676");
    const lib11852Info = document.getElementById("lib11852Info");
    const lib11851Info = document.getElementById("lib11851Info");
    const lib32676Info = document.getElementById("lib32676Info");
    const pipeIdInfo = document.getElementById("pipeIdInfo");
    const calcBtn = document.getElementById("calcBtn");
    const exportWordBtn = document.getElementById("exportWordBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    const resetAllBtn = document.getElementById("resetAllBtn");
    const profileTable = document.getElementById("profileTable");
    const recommendationBox = document.getElementById("recommendationBox");
    const FORM_STATE_KEY = "coilCalcFormState";
    const CIP_LINKED_KEY = "coilCalcCipLinked";
    const PUMP_MODE_KEY = "coilCalcPumpMode";
    const PUMP_LINK_KEY_PREFIX = "coilCalcPumpLinked";
    const PUMP_STATE_KEY_PREFIX = "coilCalcPumpState";
    const ROUTE_STATE_KEY = "coilCalcRouteState";
    const ROUTE_MODE_KEY = "coilCalcRouteMode";
    const ROUTE_MODE_STATE_KEY_PREFIX = "coilCalcRouteModeState";
    const DEFAULT_PIPE_STANDARD = "DIN EN 10357, серия A (DIN 11850)";
    const DEFAULT_ELBOW_TYPE = "DIN 11852 | 90° санитарно коляно EN 10357-A (табличен R)";
    const V_YELLOW_MAX = 1.2;
    const V_GREEN_MAX = 2.5;
    let lastProtocolData = null;
    let lastFormulaLines = [];
    let lastHoldUpCipData = null;
    let lastCipPumpData = null;
    let lastRoutePumpData = null;
    const lastRoutePumpDataByMode = { process: null, cip: null };
    let routeHasUserResult = false;
    let currentPumpMode = "process";
    let currentRouteMode = "process";
    let protocolLogoFile = null;
    let protocolTitleUserEdited = false;

    function fmt(value, digits = 3) {
      const shownDigits = Math.max(0, Math.min(3, digits));
      return Number.isFinite(value) ? value.toLocaleString("bg-BG", { maximumFractionDigits: shownDigits }) : "—";
    }

    function fmtPrecise(value, digits = 6) {
      return Number.isFinite(value) ? value.toLocaleString("bg-BG", { maximumFractionDigits: digits }) : "—";
    }

    function formatInputValue(id, value) {
      const numeric = typeof value === "number" ? value : parseFloat(value);
      if (!Number.isFinite(numeric)) return value;
      const smallValueIds = new Set(["pumpMu"]);
      const digits = smallValueIds.has(id) ? 6 : 3;
      const rounded = Number(numeric.toFixed(digits));
      return String(rounded);
    }

    function escapeAttr(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function rangeTone(value, min, max) {
      if (!Number.isFinite(value)) return "out";
      if (value < min || value > max) return "out";
      const span = max - min;
      const lowWarn = min + 0.15 * span;
      const highWarn = max - 0.15 * span;
      if (value < lowWarn || value > highWarn) return "warn";
      return "ok";
    }

    function velocityTone(value) {
      if (!Number.isFinite(value) || value <= 0) return "out";
      if (value <= V_YELLOW_MAX) return "warn";
      if (value <= V_GREEN_MAX) return "ok";
      return "out";
    }

    function pressureTone(valueBar) {
      if (!Number.isFinite(valueBar)) return "out";
      if (valueBar <= 1.5) return "ok";
      if (valueBar <= 3.0) return "warn";
      return "out";
    }

    function cipRegimeTone(re) {
      if (!Number.isFinite(re) || re < 2300) return "out";
      if (re <= 10000) return "warn";
      return "ok";
    }

    function cipRegimeText(re) {
      if (!Number.isFinite(re) || re < 2300) return "Ламинарен - НЕЕФЕКТИВНО миене";
      if (re <= 10000) return "Преходен - НЕНАДЕЖДНО миене";
      return "Турбулентен - Ефективно миене";
    }

    function cipVerdict(velocity, re) {
      if (velocity < 1.2 || re < 10000) return { label: "FAIL", tone: "out" };
      if (velocity < 1.5 || re <= 12000) return { label: "MARGINAL", tone: "warn" };
      return { label: "PASS", tone: "ok" };
    }

    function buildCipCheck(dInnerM, cipMinVelocity) {
      const rho = 980;
      const mu = 0.000430;
      const area = Math.PI * Math.pow(dInnerM, 2) / 4;
      const re = (rho * cipMinVelocity * dInnerM) / mu;
      const qMinLh = cipMinVelocity * area * 3600 * 1000;
      const verdict = cipVerdict(cipMinVelocity, re);

      return {
        rho,
        mu,
        re,
        qMinLh,
        regime: cipRegimeText(re),
        regimeTone: cipRegimeTone(re),
        verdict: verdict.label,
        verdictTone: verdict.tone
      };
    }

    function cipFluidProperties(tempC) {
      const t = Math.min(80, Math.max(65, Number.isFinite(tempC) ? tempC : 65));
      const ratio = (t - 65) / 15;
      return {
        tempC: t,
        rho: 980 + ratio * (972 - 980),
        mu: 0.000430 + ratio * (0.000355 - 0.000430)
      };
    }

    function colebrookWhite(re, eps, d) {
      if (!Number.isFinite(re) || re <= 0 || !Number.isFinite(d) || d <= 0) return 0;
      if (re < 2300) return 64 / re;
      let lambda = 0.02;
      for (let i = 0; i < 24; i += 1) {
        const denominator = -2 * Math.log10((eps / (3.71 * d)) + (2.51 / (re * Math.sqrt(lambda))));
        const next = 1 / Math.pow(denominator, 2);
        if (!Number.isFinite(next) || next <= 0) break;
        if (Math.abs(next - lambda) < 1e-7) {
          lambda = next;
          break;
        }
        lambda = next;
      }
      return lambda;
    }

    function bindGlobalTooltips() {
      const tooltip = document.getElementById("globalTooltip");
      if (!tooltip) return;
      let pinnedTrigger = null;

      function placeTooltip(trigger) {
        const text = trigger.dataset.tip || "";
        if (!text) return;
        tooltip.textContent = text;
        tooltip.classList.add("visible");

        const rect = trigger.getBoundingClientRect();
        const tipRect = tooltip.getBoundingClientRect();
        const margin = 12;
        let left = rect.right - tipRect.width;
        let top = rect.bottom + 8;

        if (left < margin) left = margin;
        if (left + tipRect.width > window.innerWidth - margin) {
          left = window.innerWidth - tipRect.width - margin;
        }
        if (top + tipRect.height > window.innerHeight - margin) {
          top = rect.top - tipRect.height - 8;
        }
        if (top < margin) top = margin;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      }

      function hideTooltip() {
        tooltip.classList.remove("visible");
        if (pinnedTrigger) {
          pinnedTrigger.setAttribute("aria-expanded", "false");
          pinnedTrigger = null;
        }
      }

      function tipFromEvent(event) {
        return event.target.closest?.(".info-tip[data-tip]");
      }

      document.addEventListener("mouseover", event => {
        const trigger = tipFromEvent(event);
        if (!trigger || trigger.contains(event.relatedTarget)) return;
        placeTooltip(trigger);
      });
      document.addEventListener("mouseout", event => {
        const trigger = tipFromEvent(event);
        if (!trigger || trigger.contains(event.relatedTarget) || pinnedTrigger === trigger) return;
        hideTooltip();
      });
      document.addEventListener("focusin", event => {
        const trigger = tipFromEvent(event);
        if (trigger) placeTooltip(trigger);
      });
      document.addEventListener("focusout", event => {
        const trigger = tipFromEvent(event);
        if (trigger && pinnedTrigger !== trigger) hideTooltip();
      });
      document.addEventListener("click", event => {
        const trigger = tipFromEvent(event);
        if (!trigger) {
          if (pinnedTrigger) hideTooltip();
          return;
        }
        event.preventDefault();
        if (pinnedTrigger === trigger && tooltip.classList.contains("visible")) {
          hideTooltip();
          return;
        }
        if (pinnedTrigger) pinnedTrigger.setAttribute("aria-expanded", "false");
        pinnedTrigger = trigger;
        pinnedTrigger.setAttribute("aria-expanded", "true");
        placeTooltip(trigger);
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape") hideTooltip();
      });

      window.addEventListener("scroll", hideTooltip, true);
      window.addEventListener("resize", hideTooltip);
    }

    function applyRangeClass(el, tone) {
      el.classList.remove("range-ok", "range-warn", "range-out");
      el.classList.add(tone === "ok" ? "range-ok" : tone === "warn" ? "range-warn" : "range-out");
    }

    function updateInputBoundaryColors(values) {
      applyRangeClass(document.getElementById("roughness"), rangeTone(values.roughness_mm, 0.0005, 0.1));
      applyRangeClass(document.getElementById("kElbow"), rangeTone(values.kElbow, 0.1, 2.0));
      applyRangeClass(document.getElementById("leqElbowLD"), rangeTone(values.leqElbowLD, 5, 120));
      applyRangeClass(document.getElementById("elbowRadiusD"), rangeTone(values.elbowRadiusD, 0.5, 5.0));
      applyRangeClass(document.getElementById("targetSpeed"), velocityTone(values.targetSpeed));
      applyRangeClass(document.getElementById("cipMin"), velocityTone(values.cipMin));
      applyRangeClass(document.getElementById("cipMax"), velocityTone(values.cipMax));
      if (document.getElementById("k11852")) applyRangeClass(document.getElementById("k11852"), rangeTone(values.k11852, 0.05, 8.0));
      if (document.getElementById("k11851")) applyRangeClass(document.getElementById("k11851"), rangeTone(values.k11851, 0.05, 8.0));
      if (document.getElementById("k32676")) applyRangeClass(document.getElementById("k32676"), rangeTone(values.k32676, 0.05, 8.0));
    }

    function manualChecked(id) {
      return document.getElementById(id)?.checked || false;
    }

    function libraryOrManual(manualId, inputId, library, selectEl, key) {
      const manualValue = parseFloat(document.getElementById(inputId).value);
      if (manualChecked(manualId)) return manualValue;
      const selected = library[selectEl.value];
      return selected && Number.isFinite(selected[key]) ? selected[key] : manualValue;
    }

    function pipeDnKey(pipe) {
      const match = pipe?.dn?.match(/DN\s*\d+/i);
      return match ? match[0].replace(/\s+/g, "").toUpperCase() : "";
    }

    function resolveElbowGeometry(pipe, radiusD, radiusMmByDn) {
      const dMm = pipe ? pipe.od - 2 * pipe.t : 0;
      const dnKey = pipeDnKey(pipe);
      const tabularRadiusMm = radiusMmByDn && Number.isFinite(radiusMmByDn[dnKey])
        ? radiusMmByDn[dnKey]
        : null;

      if (dMm > 0 && tabularRadiusMm > 0) {
        return {
          radiusM: tabularRadiusMm / 1000,
          radiusD: tabularRadiusMm / dMm,
          radiusMm: tabularRadiusMm,
          isTabular: true,
          dnKey
        };
      }

      const fallbackRadiusD = Number.isFinite(radiusD) && radiusD > 0 ? radiusD : 1.5;
      return {
        radiusM: dMm > 0 ? (fallbackRadiusD * dMm) / 1000 : 0,
        radiusD: fallbackRadiusD,
        radiusMm: dMm > 0 ? fallbackRadiusD * dMm : 0,
        isTabular: false,
        dnKey
      };
    }

    function syncManualMode(inputIds, isManual) {
      inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.disabled = !isManual;
      });
    }

    function updateManualControls() {
      const manualElbow = manualChecked("manualElbowData");
      const selectedElbow = elbowLibrary[elbowTypeSelect.value];
      if (!manualElbow && selectedElbow) {
        document.getElementById("kElbow").value = selectedElbow.k;
        document.getElementById("leqElbowLD").value = selectedElbow.lOverD;
        document.getElementById("elbowRadiusD").value = selectedElbow.radiusD;
      }
      syncManualMode(["kElbow", "leqElbowLD", "elbowRadiusD"], manualElbow);

      const manual52 = manualChecked("manual11852");
      const selected52 = lib11852Select ? fittingLibrary11852[lib11852Select.value] : null;
      if (!manual52 && selected52) document.getElementById("k11852").value = selected52.k;
      syncManualMode(["k11852"], manual52);

      const manual51 = manualChecked("manual11851");
      const selected51 = lib11851Select ? fittingLibrary11851[lib11851Select.value] : null;
      if (!manual51 && selected51) document.getElementById("k11851").value = selected51.k;
      syncManualMode(["k11851"], manual51);

      const manual32676 = manualChecked("manual32676");
      const selected32676 = lib32676Select ? fittingLibrary32676[lib32676Select.value] : null;
      if (!manual32676 && selected32676) document.getElementById("k32676").value = selected32676.k;
      syncManualMode(["k32676"], manual32676);
    }

    function fillFluids() {
      Object.keys(fluidDb).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        fluidSelect.appendChild(opt);
      });
      fluidSelect.value = "Вода (20°C)";
      fluidSelect.addEventListener("change", () => {
        const data = fluidDb[fluidSelect.value];
        if (fluidSelect.value !== "Ръчно въвеждане") {
          rhoInput.value = data.rho;
          muInput.value = data.mu;
        }
      });
    }

    function fillStandards() {
      Object.keys(pipeSeries).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        pipeStandardSelect.appendChild(opt);
      });

      pipeStandardSelect.value = DEFAULT_PIPE_STANDARD;
      pipeStandardSelect.addEventListener("change", fillPipeSizes);
      fillPipeSizes();
    }

    function fillElbowLibrary() {
      Object.keys(elbowLibrary).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        elbowTypeSelect.appendChild(opt);
      });
      elbowTypeSelect.value = DEFAULT_ELBOW_TYPE;
      updateElbowFromLibrary();
      elbowTypeSelect.addEventListener("change", updateElbowFromLibrary);
    }

    function fillFittingLibraries() {
      if (!lib11852Select || !lib11851Select || !lib32676Select) return;
      fillOneFittingLibrary(lib11852Select, fittingLibrary11852, "DIN 11852 | По-консервативна стойност", update11852FromLibrary);
      fillOneFittingLibrary(lib11851Select, fittingLibrary11851, "DIN 11851 | Резбово съединение (типично)", update11851FromLibrary);
      fillOneFittingLibrary(lib32676Select, fittingLibrary32676, "DIN 32676 | Tri-clamp (типично)", update32676FromLibrary);
    }

    function fillOneFittingLibrary(selectEl, library, defaultKey, onChangeFn) {
      Object.keys(library).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        selectEl.appendChild(opt);
      });
      selectEl.value = defaultKey;
      onChangeFn();
      selectEl.addEventListener("change", onChangeFn);
    }

    function update11852FromLibrary() {
      if (!lib11852Select || !lib11852Info) return;
      const selected = fittingLibrary11852[lib11852Select.value];
      if (!selected) return;
      if (!manualChecked("manual11852")) {
        document.getElementById("k11852").value = selected.k;
      }
      lib11852Info.textContent = `Източник: ${selected.source}`;
      updateManualControls();
    }

    function update11851FromLibrary() {
      if (!lib11851Select || !lib11851Info) return;
      const selected = fittingLibrary11851[lib11851Select.value];
      if (!selected) return;
      if (!manualChecked("manual11851")) {
        document.getElementById("k11851").value = selected.k;
      }
      lib11851Info.textContent = `Източник: ${selected.source}`;
      updateManualControls();
    }

    function update32676FromLibrary() {
      if (!lib32676Select || !lib32676Info) return;
      const selected = fittingLibrary32676[lib32676Select.value];
      if (!selected) return;
      if (!manualChecked("manual32676")) {
        document.getElementById("k32676").value = selected.k;
      }
      lib32676Info.textContent = `Източник: ${selected.source}`;
      updateManualControls();
    }

    function updateElbowFromLibrary() {
      const selected = elbowLibrary[elbowTypeSelect.value];
      if (!selected) return;
      if (!manualChecked("manualElbowData")) {
        document.getElementById("kElbow").value = selected.k;
        document.getElementById("leqElbowLD").value = selected.lOverD;
        document.getElementById("elbowRadiusD").value = selected.radiusD;
      }
      const selectedPipe = pipeSeries[pipeStandardSelect.value]?.[parseInt(pipeSizeSelect.value, 10)];
      const dMm = selectedPipe ? selectedPipe.od - 2 * selectedPipe.t : 0;
      const geometry = resolveElbowGeometry(
        selectedPipe,
        manualChecked("manualElbowData") ? parseFloat(document.getElementById("elbowRadiusD").value) : selected.radiusD,
        manualChecked("manualElbowData") ? null : selected.radiusMmByDn
      );
      const radiusD = manualChecked("manualElbowData")
        ? parseFloat(document.getElementById("elbowRadiusD").value)
        : geometry.radiusD;
      const lOverD = manualChecked("manualElbowData")
        ? parseFloat(document.getElementById("leqElbowLD").value)
        : selected.lOverD;
      const kValue = manualChecked("manualElbowData")
        ? parseFloat(document.getElementById("kElbow").value)
        : selected.k;
      const arcMm = dMm > 0 ? (Math.PI / 2) * geometry.radiusMm : 0;
      const leqMm = dMm > 0 ? lOverD * dMm : 0;
      const radiusText = geometry.isTabular
        ? `R=${fmt(geometry.radiusMm, 1)} mm`
        : `R/D=${fmt(radiusD, 2)}`;
      const detailText = [
        `Избрано коляно: ${elbowTypeSelect.value}`,
        `K=${fmt(kValue, 2)}`,
        `L/D=${fmt(lOverD, 1)}`,
        geometry.isTabular
          ? `Табличен радиус по ос: R=${fmt(geometry.radiusMm, 1)} mm за ${geometry.dnKey}; ефективно R/D=${fmt(radiusD, 2)}`
          : `Радиус: R/D=${fmt(radiusD, 2)}`,
        `Дължина по ос на 1 коляно: ${fmt(arcMm, 1)} mm (${fmt(arcMm / 1000, 3)} m)`,
        `Еквивалентна дължина за загуби: ${fmt(leqMm, 0)} mm (${fmt(leqMm / 1000, 3)} m). Това е хидравлична дължина, не реален габарит.`,
        `Източник: ${selected.source}`
      ].join(" | ");
      elbowSourceInfo.innerHTML = `
        <span><strong>Коляно:</strong> K=${fmt(kValue, 2)} | ${radiusText} | Lдъга=${fmt(arcMm, 1)} mm</span>
        <span class="info-tip" tabindex="0" aria-label="Пояснение" data-tip="${escapeAttr(detailText)}">i</span>
      `;
      updateManualControls();
    }

    function fillPipeSizes() {
      pipeSizeSelect.innerHTML = "";
      const selected = pipeSeries[pipeStandardSelect.value];
      selected.forEach((p, idx) => {
        const id = p.od - 2 * p.t;
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = `${p.dn} | ${p.od.toFixed(1)} × ${p.t.toFixed(1)} mm (ID≈${id.toFixed(1)} mm)`;
        pipeSizeSelect.appendChild(opt);
      });
      pipeSizeSelect.selectedIndex = 2;
      updatePipeIdInfo();
    }

    function updatePipeIdInfo() {
      const p = pipeSeries[pipeStandardSelect.value][parseInt(pipeSizeSelect.value, 10)];
      const id = p.od - 2 * p.t;
      const pipeDetail = `Избран DN: ${p.dn}. OD=${fmt(p.od, 1)} mm, s=${fmt(p.t, 1)} mm. Светъл отвор: ID = OD - 2·s = ${fmt(id, 1)} mm.`;
      pipeIdInfo.innerHTML = `
        <span><strong>${p.dn}</strong> | ID ${fmt(id, 1)} mm</span>
        <span class="info-tip" tabindex="0" aria-label="Пояснение" data-tip="${escapeAttr(pipeDetail)}">i</span>
      `;
      if (elbowTypeSelect.value) updateElbowFromLibrary();
    }

    function seriesAPipes() {
      return pipeSeries[DEFAULT_PIPE_STANDARD] || [];
    }

    function routeDefaultSegment() {
      const components = {};
      routeComponentLibrary.forEach(component => {
        components[component.key] = { count: 0, zeta: component.zeta };
      });
      return {
        dnIndex: 3,
        length: 10,
        elbows90: 2,
        elbow90Zeta: 0.60,
        elbows45: 0,
        elbow45Zeta: 0.35,
        teeThrough: 0,
        teeThroughZeta: 0.30,
        teeBranch: 0,
        teeBranchZeta: 0.70,
        plateHxSections: [],
        optionsOpen: false,
        expansionZeta: "",
        contractionZeta: "",
        components
      };
    }

    function routeSegmentCount() {
      return document.querySelectorAll(".route-segment").length;
    }

    function routeDnOptions(selectedIndex) {
      return seriesAPipes().map((pipe, idx) => {
        const id = pipe.od - 2 * pipe.t;
        const selected = idx === Number(selectedIndex) ? " selected" : "";
        return `<option value="${idx}"${selected}>${pipe.dn} | ID ${id.toFixed(1)} mm</option>`;
      }).join("");
    }

    function routeComponentRows(segment, index) {
      return routeComponentLibrary.map(component => {
        const data = segment.components?.[component.key] || { count: 0, zeta: component.zeta };
        return `
          <div class="component-label">${component.label}<br>ζ=${fmt(component.zeta, 2)}</div>
          <input class="route-component-count" data-route-index="${index}" data-component="${component.key}" type="number" min="0" step="1" value="${escapeAttr(formatInputValue("", data.count ?? 0))}" aria-label="${escapeAttr(component.label)} брой" />
          <input class="route-component-zeta" data-route-index="${index}" data-component="${component.key}" type="number" min="0" step="0.01" value="${escapeAttr(formatInputValue("", data.zeta ?? component.zeta))}" aria-label="${escapeAttr(component.label)} ζ" />
        `;
      }).join("");
    }

    function normalizePlateHxSections(segment) {
      if (Array.isArray(segment.plateHxSections)) {
        return segment.plateHxSections.map((section, idx) => ({
          plates: section?.plates ?? "",
          zeta: parseRouteNumber(section?.zeta, idx === 0 ? 2.00 : 0)
        }));
      }
      const count = Math.max(0, Math.round(parseRouteNumber(segment.plateHxSections, 0)));
      const zeta = parseRouteNumber(segment.plateHxSectionZeta, 2.00);
      return Array.from({ length: count }, () => ({ plates: "", zeta }));
    }

    function routePlateHxRows(segment, segmentIndex) {
      const sections = normalizePlateHxSections(segment);
      if (!sections.length) {
        return `<div class="component-label">Няма добавени секции</div><div class="component-label">-</div><div class="component-label">-</div>`;
      }
      return sections.map((section, sectionIndex) => `
        <div class="component-label">Секция ${sectionIndex + 1}</div>
        <input class="route-plate-hx-plates" data-section-index="${sectionIndex}" type="number" min="0" step="1" value="${escapeAttr(formatInputValue("", section.plates ?? ""))}" aria-label="Пластинчат топлообменик секция ${sectionIndex + 1} брой пластини" />
        <input class="route-plate-hx-zeta" data-section-index="${sectionIndex}" type="number" min="0" step="0.01" value="${escapeAttr(formatInputValue("", section.zeta ?? 0))}" aria-label="Пластинчат топлообменик секция ${sectionIndex + 1} ζ" />
      `).join("");
    }

    function routeSegmentHtml(segment, index) {
      return `
        <div class="route-segment" data-route-index="${index}">
          <div class="route-segment-title">
            <span>Сегмент ${index + 1}</span>
            <span>EN 10357 Series A</span>
          </div>
          <div class="form-row">
            <div class="field">
              <label>DN</label>
              <select class="route-dn">${routeDnOptions(segment.dnIndex)}</select>
            </div>
            <div class="field">
              <label>Length [m]</label>
              <input class="route-length" type="number" min="0" step="0.1" value="${escapeAttr(formatInputValue("", segment.length))}" />
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label>90° колена DIN 11852 - брой</label>
              <input class="route-elbows90" type="number" min="0" step="1" value="${escapeAttr(formatInputValue("", segment.elbows90))}" />
            </div>
            <div class="field">
              <label>ζ за 1 коляно 90° [-]</label>
              <input class="route-elbow90-zeta" type="number" min="0" step="0.01" value="${escapeAttr(formatInputValue("", segment.elbow90Zeta ?? 0.60))}" />
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label>45° колена DIN 11852 - брой</label>
              <input class="route-elbows45" type="number" min="0" step="1" value="${escapeAttr(formatInputValue("", segment.elbows45))}" />
            </div>
            <div class="field">
              <label>ζ за 1 коляно 45° [-]</label>
              <input class="route-elbow45-zeta" type="number" min="0" step="0.01" value="${escapeAttr(formatInputValue("", segment.elbow45Zeta ?? 0.35))}" />
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label>Тройници прав поток - брой</label>
              <input class="route-tee-through" type="number" min="0" step="1" value="${escapeAttr(formatInputValue("", segment.teeThrough))}" />
            </div>
            <div class="field">
              <label>ζ за 1 тройник прав поток [-]</label>
              <input class="route-tee-through-zeta" type="number" min="0" step="0.01" value="${escapeAttr(formatInputValue("", segment.teeThroughZeta ?? 0.30))}" />
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label>Тройници отклонение - брой</label>
              <input class="route-tee-branch" type="number" min="0" step="1" value="${escapeAttr(formatInputValue("", segment.teeBranch))}" />
            </div>
            <div class="field">
              <label>ζ за 1 тройник отклонение [-]</label>
              <input class="route-tee-branch-zeta" type="number" min="0" step="0.01" value="${escapeAttr(formatInputValue("", segment.teeBranchZeta ?? 0.70))}" />
            </div>
          </div>
          <details${segment.optionsOpen ? " open" : ""}>
            <summary>Опционални съпротивления: арматура, фитинги, пластинчат топлообменик</summary>
            <div class="component-grid">
              <div class="component-label">Компонент</div>
              <div class="component-label">Брой</div>
              <div class="component-label">ζ override</div>
              ${routeComponentRows(segment, index)}
              <div class="component-label">Sudden expansion (A1->A2)<br>ζ=(1-A1/A2)²; празно = auto</div>
              <input type="number" min="0" step="1" value="1" readonly />
              <input class="route-expansion-zeta" type="number" min="0" step="0.01" value="${escapeAttr(segment.expansionZeta === undefined || segment.expansionZeta === "" ? "" : formatInputValue("", segment.expansionZeta))}" aria-label="Sudden expansion ζ override" />
              <div class="component-label">Sudden contraction (A1->A2)<br>ζ=0.5×(1-A2/A1); празно = auto</div>
              <input type="number" min="0" step="1" value="1" readonly />
              <input class="route-contraction-zeta" type="number" min="0" step="0.01" value="${escapeAttr(segment.contractionZeta === undefined || segment.contractionZeta === "" ? "" : formatInputValue("", segment.contractionZeta))}" aria-label="Sudden contraction ζ override" />
            </div>
            <div class="component-grid plate-hx-grid">
              <div class="component-label">Пластинчат топлообменик</div>
              <div class="component-label">Брой пластини</div>
              <div class="component-label">ζ секция</div>
              ${routePlateHxRows(segment, index)}
            </div>
            <div class="button-row secondary">
              <button class="ghost route-add-plate-hx-section" type="button" data-route-index="${index}">Добави секция</button>
              <button class="ghost route-remove-plate-hx-section" type="button" data-route-index="${index}">Премахни секция</button>
            </div>
          </details>
        </div>
      `;
    }

    function parseRouteNumber(value, fallback = 0) {
      const numeric = parseFloat(value);
      return Number.isFinite(numeric) ? numeric : fallback;
    }

    function getRouteSegmentsState() {
      return Array.from(document.querySelectorAll(".route-segment")).map(segmentEl => {
        const components = {};
        routeComponentLibrary.forEach(component => {
          const countEl = segmentEl.querySelector(`.route-component-count[data-component="${component.key}"]`);
          const zetaEl = segmentEl.querySelector(`.route-component-zeta[data-component="${component.key}"]`);
          components[component.key] = {
            count: parseRouteNumber(countEl?.value, 0),
            zeta: parseRouteNumber(zetaEl?.value, component.zeta)
          };
        });
        const plateHxSections = Array.from(segmentEl.querySelectorAll(".route-plate-hx-zeta")).map(zetaEl => {
          const sectionIndex = zetaEl.dataset.sectionIndex;
          const platesEl = segmentEl.querySelector(`.route-plate-hx-plates[data-section-index="${sectionIndex}"]`);
          return {
            plates: platesEl?.value ?? "",
            zeta: parseRouteNumber(zetaEl.value, 0)
          };
        });
        return {
          dnIndex: parseInt(segmentEl.querySelector(".route-dn")?.value, 10) || 0,
          length: parseRouteNumber(segmentEl.querySelector(".route-length")?.value, 0),
          elbows90: parseRouteNumber(segmentEl.querySelector(".route-elbows90")?.value, 0),
          elbow90Zeta: parseRouteNumber(segmentEl.querySelector(".route-elbow90-zeta")?.value, 0.60),
          elbows45: parseRouteNumber(segmentEl.querySelector(".route-elbows45")?.value, 0),
          elbow45Zeta: parseRouteNumber(segmentEl.querySelector(".route-elbow45-zeta")?.value, 0.35),
          teeThrough: parseRouteNumber(segmentEl.querySelector(".route-tee-through")?.value, 0),
          teeThroughZeta: parseRouteNumber(segmentEl.querySelector(".route-tee-through-zeta")?.value, 0.30),
          teeBranch: parseRouteNumber(segmentEl.querySelector(".route-tee-branch")?.value, 0),
          teeBranchZeta: parseRouteNumber(segmentEl.querySelector(".route-tee-branch-zeta")?.value, 0.70),
          plateHxSections,
          optionsOpen: Boolean(segmentEl.querySelector("details")?.open),
          expansionZeta: segmentEl.querySelector(".route-expansion-zeta")?.value ?? "",
          contractionZeta: segmentEl.querySelector(".route-contraction-zeta")?.value ?? "",
          components
        };
      });
    }

    function saveRouteState() {
      const state = {
        mode: currentRouteMode,
        feedsPump: routeHasUserResult,
        segments: getRouteSegmentsState()
      };
      saveRouteModeInputs();
      localStorage.setItem(ROUTE_STATE_KEY, JSON.stringify(state));
    }

    function loadRouteState() {
      const raw = localStorage.getItem(ROUTE_STATE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (_err) {
        return null;
      }
    }

    function routeModeInputKey(mode = currentRouteMode) {
      return `${ROUTE_MODE_STATE_KEY_PREFIX}:${mode}`;
    }

    function getRouteModeInputs() {
      return {
        flow: document.getElementById("routeFlow")?.value,
        rho: document.getElementById("routeRho")?.value,
        mu: document.getElementById("routeMu")?.value,
        roughness: document.getElementById("routeRoughness")?.value
      };
    }

    function saveRouteModeInputs(mode = currentRouteMode) {
      localStorage.setItem(routeModeInputKey(mode), JSON.stringify(getRouteModeInputs()));
    }

    function loadRouteModeInputs(mode = currentRouteMode, fallback = null) {
      let state = fallback;
      const raw = localStorage.getItem(routeModeInputKey(mode));
      if (raw) {
        try {
          state = JSON.parse(raw);
        } catch (_err) {
        }
      }
      if (!state) return;
      setControlValue("routeFlow", state.flow);
      setControlValue("routeRho", state.rho);
      setControlValue("routeMu", state.mu);
      setControlValue("routeRoughness", state.roughness);
    }

    function setRouteMode(mode, { markUserResult = false } = {}) {
      saveRouteModeInputs(currentRouteMode);
      currentRouteMode = mode === "cip" ? "cip" : "process";
      localStorage.setItem(ROUTE_MODE_KEY, currentRouteMode);
      document.querySelectorAll("[data-route-mode]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.routeMode === currentRouteMode);
      });
      loadRouteModeInputs(currentRouteMode);
      renderRouteCalc({ markUserResult });
    }

    function renderRouteSegments(segments = null) {
      const target = document.getElementById("routeSegments");
      if (!target) return;
      const data = (segments && segments.length ? segments : [routeDefaultSegment()]).slice(0, 10);
      target.innerHTML = data.map(routeSegmentHtml).join("");
      target.querySelectorAll("input, select").forEach(el => {
        el.addEventListener("input", () => {
          saveRouteState();
          renderRouteCalc({ markUserResult: true });
        });
        el.addEventListener("change", () => {
          saveRouteState();
          renderRouteCalc({ markUserResult: true });
        });
      });
      target.querySelectorAll(".route-add-plate-hx-section").forEach(btn => {
        btn.addEventListener("click", () => {
          const segmentsState = getRouteSegmentsState();
          const segmentIndex = parseInt(btn.dataset.routeIndex, 10);
          if (!segmentsState[segmentIndex]) return;
          segmentsState[segmentIndex].plateHxSections.push({ plates: "", zeta: 0 });
          segmentsState[segmentIndex].optionsOpen = true;
          renderRouteSegments(segmentsState);
          saveRouteState();
          renderRouteCalc({ markUserResult: true });
        });
      });
      target.querySelectorAll(".route-remove-plate-hx-section").forEach(btn => {
        btn.addEventListener("click", () => {
          const segmentsState = getRouteSegmentsState();
          const segmentIndex = parseInt(btn.dataset.routeIndex, 10);
          if (!segmentsState[segmentIndex]?.plateHxSections.length) return;
          segmentsState[segmentIndex].plateHxSections.pop();
          segmentsState[segmentIndex].optionsOpen = true;
          renderRouteSegments(segmentsState);
          saveRouteState();
          renderRouteCalc({ markUserResult: true });
        });
      });
    }

    function frictionFactorTurbulent(re, eps, d) {
      const rel = eps / d;
      return 0.25 / Math.pow(Math.log10((rel / 3.7) + (5.74 / Math.pow(re, 0.9))), 2);
    }

    function frictionFactor(re, eps, d) {
      if (re <= 0) return 0;
      if (re < 2300) return 64 / re;
      if (re >= 4000) return frictionFactorTurbulent(re, eps, d);

      const fLam = 64 / re;
      const fTurb = frictionFactorTurbulent(4000, eps, d);
      const alpha = (re - 2300) / (4000 - 2300);
      return fLam + alpha * (fTurb - fLam);
    }

    function calculateForPipe(pipe, inputs) {
      const d_mm = pipe.od - 2 * pipe.t;
      if (d_mm <= 0) return null;

      const d = d_mm / 1000;
      const area = Math.PI * Math.pow(d, 2) / 4;
      const velocity = inputs.q / area;
      const volume = inputs.q * inputs.t;
      const volume_l = volume * 1000;
      const volumePerMeter_l_m = area * 1000;
      const retention_s_l = volume_l > 0 ? inputs.t / volume_l : 0;
      const length = volume / area;

      const straightSegment = Number.isFinite(inputs.segment) && inputs.segment > 0 ? inputs.segment : length;
      const elbowGeometry = resolveElbowGeometry(pipe, inputs.elbowRadiusD, inputs.elbowRadiusMmByDn);
      const radiusD = elbowGeometry.radiusD;
      const inletOutletExtensionM = Number.isFinite(inputs.inletOutletExtensionM) && inputs.inletOutletExtensionM >= 0 ? inputs.inletOutletExtensionM : 0.15;
      const elbowArcLength = (Math.PI / 2) * elbowGeometry.radiusM;
      const bendRadiusM = elbowGeometry.radiusM;
      const inletOutletElbows90 = 2;
      let nStraights = 1;
      while ((nStraights * straightSegment) + ((Math.max(0, nStraights - 1) * 2) + inletOutletElbows90) * elbowArcLength < length) {
        nStraights += 1;
      }
      const nUTurns = Math.max(0, nStraights - 1);
      const serpentineElbows90 = nUTurns * 2;
      const elbows90 = serpentineElbows90 + inletOutletElbows90;
      const sectorLength = straightSegment + (2 * elbowArcLength);
      const sectorCount = nUTurns;
      const totalElbowArcLength = elbows90 * elbowArcLength;
      const straightLengthTotal = Math.max(0, length - totalElbowArcLength);
      const lastStraightLength = Math.max(0, length - ((nStraights - 1) * straightSegment) - totalElbowArcLength);
      const maxStraightLength = Math.max(0, Math.min(straightSegment, length));
      const inletOutletLengthM = maxStraightLength + elbowArcLength + inletOutletExtensionM;
      const coilPitchM = Math.max(2 * bendRadiusM, (pipe.od / 1000) * 1.8);
      const overallWidthM = maxStraightLength + (2 * bendRadiusM) + (pipe.od / 1000);
      const overallHeightM = Math.max(pipe.od / 1000, ((nStraights - 1) * coilPitchM) + (pipe.od / 1000));
      const sideDepthM = (2 * bendRadiusM) + (pipe.od / 1000);

      const re = (inputs.rho * velocity * d) / inputs.mu;
      const f = frictionFactor(re, inputs.eps, d);

      const kElbowsOnly = elbows90 * inputs.kElbow;
      const kIO = inputs.includeIO ? 1.5 : 0;
      const k11852 = 0;
      const k11851 = 0;
      const k32676 = 0;
      const kExtras = k11852 + k11851 + k32676;
      const kTotal = kElbowsOnly + kIO + kExtras;

      const leqElbows = elbows90 * inputs.leqElbowLD * d;
      const leqIO = (inputs.lossMethod === "leq" && inputs.includeIO && f > 0) ? (kIO / f) * d : 0;
      const leqExtras = 0;

      const dyn = inputs.rho * Math.pow(velocity, 2) / 2;
      const dpLinear = f * (length / d) * dyn;
      let dpElbows = 0;
      let dpIO = 0;
      let dpExtras = 0;
      let dpLocal = 0;
      let dpTotal = 0;
      let lHydraulicTotal = length;

      if (inputs.lossMethod === "leq") {
        lHydraulicTotal = length + leqElbows + leqIO + leqExtras;
        dpElbows = f * (leqElbows / d) * dyn;
        dpIO = f * (leqIO / d) * dyn;
        dpExtras = f * (leqExtras / d) * dyn;
        dpLocal = dpElbows + dpIO + dpExtras;
        dpTotal = f * (lHydraulicTotal / d) * dyn;
      } else {
        dpElbows = kElbowsOnly * dyn;
        dpIO = kIO * dyn;
        dpExtras = kExtras * dyn;
        dpLocal = dpElbows + dpIO + dpExtras;
        dpTotal = dpLinear + dpLocal;
      }

      return {
        d_mm, d, area, velocity, volume, volume_l, volumePerMeter_l_m, retention_s_l, length,
        sectorLength, sectorCount, nStraights, elbowArcLength, elbowRadiusD: radiusD, elbowRadiusMm: elbowGeometry.radiusMm,
        elbowRadiusIsTabular: elbowGeometry.isTabular, inletOutletExtensionM, inletOutletLengthM,
        bendRadiusM, coilPitchM, overallWidthM, overallHeightM, sideDepthM,
        totalElbowArcLength, straightLengthTotal, lastStraightLength, maxStraightLength,
        elbows90, serpentineElbows90, inletOutletElbows90, re, f, kElbowsOnly, kIO, k11852, k11851, k32676, kExtras, kTotal, leqElbows, leqIO, leqExtras, lHydraulicTotal,
        dyn, dpLinear, dpElbows, dpIO, dpExtras, dpLocal, dpTotal,
        dpLinearBar: dpLinear / 100000,
        dpLocalBar: dpLocal / 100000,
        dpTotalBar: dpTotal / 100000,
        pipe
      };
    }

    function cipStatus(velocity, cipMin, cipMax) {
      if (velocity < cipMin) return "Под минимална";
      if (velocity > cipMax) return "Над максимална";
      return "В целеви диапазон";
    }

    function renderProfiles(profiles, cipMin, cipMax) {
      if (!profileTable) return;
      profileTable.innerHTML = profiles.map(p => {
        const status = cipStatus(p.velocity, cipMin, cipMax);
        return `<tr>
          <td>${p.pipe.dn}</td>
          <td>${fmt(p.d_mm, 1)}</td>
          <td>${fmt(p.velocity, 3)}</td>
          <td>${fmt(p.dpTotalBar, 4)}</td>
          <td>${fmt(p.length, 2)}</td>
          <td>${status}</td>
        </tr>`;
      }).join("");
    }

    function svgLine(x1, y1, x2, y2, cls = "dim") {
      return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    }

    function svgText(x, y, text, anchor = "middle", rotate = "") {
      const transform = rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : "";
      return `<text x="${x}" y="${y}" text-anchor="${anchor}"${transform}>${text}</text>`;
    }

    function renderCoilDrawing(r) {
      const box = document.getElementById("coilDrawing");
      const note = document.getElementById("coilDrawingNote");
      if (!box || !r) return;

      const rows = Math.max(1, Math.min(r.nStraights, 80));
      const hasMultipleRows = rows > 1;
      const vbW = 920;
      const vbH = 520;
      const frontX = 300;
      const frontY = 86;
      const frontW = 560;
      const frontH = 330;
      const sideX = 68;
      const sideY = 126;
      const sideW = 115;
      const sideH = 290;
      const yStep = hasMultipleRows ? frontH / (rows - 1) : 0;
      const tube = Math.max(3, Math.min(12, frontH / Math.max(rows, 12) * 0.32));
      const bendR = Math.max(16, Math.min(44, yStep / 2 || 34));
      const straightX1 = frontX + bendR;
      const straightX2 = frontX + frontW - bendR;
      const topY = frontY;
      const bottomY = frontY + frontH;
      const mainColor = "#111827";
      const dimColor = "#008b8b";
      const centerColor = "#0ea5a4";

      let pipes = "";
      for (let i = 0; i < rows; i += 1) {
        const y = hasMultipleRows ? topY + i * yStep : topY + frontH / 2;
        pipes += `<line x1="${straightX1}" y1="${y}" x2="${straightX2}" y2="${y}" />`;
        pipes += `<line class="center" x1="${straightX1}" y1="${y}" x2="${straightX2}" y2="${y}" />`;
        if (i < rows - 1) {
          const nextY = topY + (i + 1) * yStep;
          const side = i % 2 === 0 ? "right" : "left";
          const cx = side === "right" ? straightX2 : straightX1;
          const sweep = side === "right" ? 1 : 0;
          pipes += `<path d="M ${cx} ${y} A ${bendR} ${(nextY - y) / 2} 0 0 ${sweep} ${cx} ${nextY}" />`;
        }
      }

      const supportX1 = straightX1 + 28;
      const supportX2 = straightX2 - 28;
      const supports = `
        <line class="support" x1="${supportX1}" y1="${topY - 16}" x2="${supportX1}" y2="${bottomY + 16}" />
        <line class="support" x1="${supportX2}" y1="${topY - 16}" x2="${supportX2}" y2="${bottomY + 16}" />
        <line class="support" x1="${frontX - 6}" y1="${topY - 22}" x2="${frontX + frontW + 6}" y2="${topY - 22}" />
        <line class="support" x1="${frontX - 6}" y1="${bottomY + 22}" x2="${frontX + frontW + 6}" y2="${bottomY + 22}" />
      `;

      const dimTop = frontY - 52;
      const dimMid = frontY - 25;
      const dimRight = frontX + frontW + 64;
      const sideDimX = sideX - 34;
      const sideDepthY = sideY - 24;

      const overallWidthMm = r.overallWidthM * 1000;
      const straightMm = r.maxStraightLength * 1000;
      const inletOutletMm = r.inletOutletLengthM * 1000;
      const overallHeightMm = r.overallHeightM * 1000;
      const sideDepthMm = r.sideDepthM * 1000;
      const pitchMm = r.coilPitchM * 1000;

      const dimensions = `
        ${svgLine(frontX, dimTop, frontX + frontW, dimTop)}
        ${svgLine(frontX, dimTop - 8, frontX, topY - 30)}
        ${svgLine(frontX + frontW, dimTop - 8, frontX + frontW, topY - 30)}
        ${svgText(frontX + frontW / 2, dimTop - 9, fmt(overallWidthMm, 0))}

        ${svgLine(straightX1, dimMid, straightX2, dimMid)}
        ${svgLine(straightX1, dimMid - 7, straightX1, topY - 8)}
        ${svgLine(straightX2, dimMid - 7, straightX2, topY - 8)}
        ${svgText((straightX1 + straightX2) / 2, dimMid - 9, fmt(straightMm, 0))}

        ${svgLine(straightX1, bottomY + 54, straightX2 + bendR, bottomY + 54)}
        ${svgLine(straightX1, bottomY + 45, straightX1, bottomY + 66)}
        ${svgLine(straightX2 + bendR, bottomY + 45, straightX2 + bendR, bottomY + 66)}
        ${svgText((straightX1 + straightX2 + bendR) / 2, bottomY + 86, `вход/изход ${fmt(inletOutletMm, 0)}`)}

        ${svgLine(dimRight, topY, dimRight, bottomY)}
        ${svgLine(frontX + frontW + 16, topY, dimRight + 8, topY)}
        ${svgLine(frontX + frontW + 16, bottomY, dimRight + 8, bottomY)}
        ${svgText(dimRight + 28, (topY + bottomY) / 2, fmt(overallHeightMm, 0), "middle", 90)}

        ${svgLine(sideX, sideDepthY, sideX + sideW, sideDepthY)}
        ${svgLine(sideX, sideDepthY - 7, sideX, sideY - 7)}
        ${svgLine(sideX + sideW, sideDepthY - 7, sideX + sideW, sideY - 7)}
        ${svgText(sideX + sideW / 2, sideDepthY - 8, fmt(sideDepthMm, 0))}

        ${svgLine(sideDimX, sideY, sideDimX, sideY + sideH)}
        ${svgLine(sideX - 12, sideY, sideDimX - 8, sideY)}
        ${svgLine(sideX - 12, sideY + sideH, sideDimX - 8, sideY + sideH)}
        ${svgText(sideDimX - 18, sideY + sideH / 2, fmt(overallHeightMm, 0), "middle", -90)}
      `;

      const sideRows = Math.min(rows, 22);
      const sideStep = sideRows > 1 ? sideH / (sideRows - 1) : 0;
      let sideView = `<rect x="${sideX}" y="${sideY}" width="${sideW}" height="${sideH}" fill="none" />`;
      for (let i = 0; i < sideRows; i += 1) {
        const y = sideRows > 1 ? sideY + i * sideStep : sideY + sideH / 2;
        sideView += `<ellipse cx="${sideX + sideW / 2}" cy="${y}" rx="${sideW / 2 - 10}" ry="${Math.max(5, tube * 0.8)}" fill="none" />`;
      }
      sideView += `<line class="support" x1="${sideX + 10}" y1="${sideY - 8}" x2="${sideX + 10}" y2="${sideY + sideH + 8}" />`;
      sideView += `<line class="support" x1="${sideX + sideW - 10}" y1="${sideY - 8}" x2="${sideX + sideW - 10}" y2="${sideY + sideH + 8}" />`;

      box.innerHTML = `
        <svg viewBox="0 0 ${vbW} ${vbH}" role="img" aria-label="Габаритна визуализация на тръбна задръжка">
          <defs>
            <marker id="arrowDim" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="${dimColor}" />
            </marker>
            <style>
              .pipe { fill: none; stroke: ${mainColor}; stroke-width: ${tube}; stroke-linecap: round; stroke-linejoin: round; }
              .center { stroke: ${centerColor}; stroke-width: 1; stroke-dasharray: 10 8; }
              .support { stroke: #111827; stroke-width: 2; }
              .dim { stroke: ${dimColor}; stroke-width: 1.4; marker-start: url(#arrowDim); marker-end: url(#arrowDim); }
              text { fill: ${dimColor}; font: 20px "Segoe UI", Arial, sans-serif; }
            </style>
          </defs>
          <g class="pipe">${pipes}</g>
          ${supports}
          <g class="pipe">${sideView}</g>
          <g>${dimensions}</g>
          ${svgText(frontX + frontW - 8, bottomY + 58, `${r.pipe.dn} / OD ${fmt(r.pipe.od, 1)} mm / ID ${fmt(r.d_mm, 1)} mm`, "end")}
          ${rows < r.nStraights ? svgText(frontX + frontW / 2, bottomY + 58, `показани са ${rows} от ${r.nStraights} прави секции`, "middle") : ""}
          ${svgText(dimRight + 55, topY + 50, `стъпка ${fmt(pitchMm, 0)}`, "middle", 90)}
        </svg>
      `;

      note.textContent =
        `Ориентировъчна визуализация: габаритите са изчислени от правата секция, R/D на коляното, OD/ID на тръбата и броя прави секции. Реални стойки, заварки, фланци, краища и монтажни отстояния се добавят отделно.`;
    }

    function drawSpeedChart(profiles, cipMin, cipMax) {
      const canvas = document.getElementById("speedChart");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 520;
      const height = canvas.clientHeight || 250;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const margin = { left: 45, right: 15, top: 15, bottom: 35 };
      const chartW = width - margin.left - margin.right;
      const chartH = height - margin.top - margin.bottom;
      const maxV = Math.max(cipMax * 1.2, ...profiles.map(p => p.velocity), 0.5);

      const y = (val) => margin.top + chartH - (val / maxV) * chartH;

      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top);
      ctx.lineTo(margin.left, margin.top + chartH);
      ctx.lineTo(margin.left + chartW, margin.top + chartH);
      ctx.stroke();

      ctx.strokeStyle = "#16a34a";
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(margin.left, y(cipMin));
      ctx.lineTo(margin.left + chartW, y(cipMin));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(margin.left, y(cipMax));
      ctx.lineTo(margin.left + chartW, y(cipMax));
      ctx.stroke();
      ctx.setLineDash([]);

      const barW = chartW / (profiles.length * 1.8);
      profiles.forEach((p, i) => {
        const x = margin.left + (i + 1) * (chartW / (profiles.length + 1)) - barW / 2;
        const barTop = y(p.velocity);
        const color = (p.velocity >= cipMin && p.velocity <= cipMax) ? "#2563eb" : "#ef4444";
        ctx.fillStyle = color;
        ctx.fillRect(x, barTop, barW, margin.top + chartH - barTop);

        ctx.fillStyle = "#1f2937";
        ctx.font = "12px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(p.pipe.dn, x + barW / 2, height - 12);
        ctx.fillText(fmt(p.velocity, 2), x + barW / 2, Math.max(barTop - 6, 10));
      });

      ctx.fillStyle = "#0f172a";
      ctx.font = "12px Segoe UI";
      ctx.textAlign = "left";
      ctx.fillText(`CIP min ${fmt(cipMin, 1)} m/s`, margin.left + 6, y(cipMin) - 4);
      ctx.fillText(`CIP max ${fmt(cipMax, 1)} m/s`, margin.left + 6, y(cipMax) - 4);
    }

    function saveSessionData(payload) {
      localStorage.setItem("coilCalcData", JSON.stringify(payload));
      localStorage.setItem("coilCalcUpdatedAt", new Date().toISOString());
    }

    function setControlValue(id, value) {
      const el = document.getElementById(id);
      if (!el || value === undefined || value === null) return;
      if (el.type === "checkbox") {
        el.checked = Boolean(value);
      } else if (el.type === "number") {
        el.value = formatInputValue(id, value);
      } else {
        el.value = value;
      }
    }

    function normalizeNumberControl(el) {
      if (!el || el.type !== "number" || el.value === "") return;
      el.value = formatInputValue(el.id || "", el.value);
    }

    function bindNumberFormatting() {
      document.addEventListener("change", event => {
        if (event.target?.matches?.("input[type='number']")) normalizeNumberControl(event.target);
      });
      document.addEventListener("focusout", event => {
        if (event.target?.matches?.("input[type='number']")) normalizeNumberControl(event.target);
      });
    }

    function normalizeInletOutletExtensionControl() {
      const el = document.getElementById("inletOutletExtension");
      if (!el) return;
      const value = parseFloat(el.value);
      if (Number.isFinite(value) && value > 20) {
        el.value = formatInputValue("inletOutletExtension", value / 1000);
      }
    }

    function getActiveOptionalComponentCount() {
      return [
        ["use11852", "count11852"],
        ["use11851", "count11851"],
        ["use32676", "count32676"]
      ].reduce((total, [useId, countId]) => {
        const isEnabled = document.getElementById(useId)?.checked;
        const count = parseFloat(document.getElementById(countId)?.value) || 0;
        return total + (isEnabled && count > 0 ? count : 0);
      }, 0);
    }

    function updateOptionalComponentsBadge() {
      const badge = document.getElementById("optionalComponentsBadge");
      if (!badge) return;
      const count = getActiveOptionalComponentCount();
      badge.hidden = count <= 0;
      if (count > 0) {
        badge.textContent = `Активни: ${fmt(count, 0)}`;
      }
    }

    function bindOptionalComponentsBadge() {
      ["use11852", "count11852", "use11851", "count11851", "use32676", "count32676"]
        .forEach(id => {
          const el = document.getElementById(id);
          if (!el) return;
          el.addEventListener("input", updateOptionalComponentsBadge);
          el.addEventListener("change", updateOptionalComponentsBadge);
        });
      updateOptionalComponentsBadge();
    }

    function isCipLinked() {
      return localStorage.getItem(CIP_LINKED_KEY) !== "standalone";
    }

    function setCipLinkedMode(isLinked) {
      localStorage.setItem(CIP_LINKED_KEY, isLinked ? "linked" : "standalone");
      document.getElementById("cipLinkedBtn")?.classList.toggle("active", isLinked);
      document.getElementById("cipStandaloneBtn")?.classList.toggle("active", !isLinked);
      ["cipDiameter", "cipRouteLength", "cipVolume"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = isLinked;
      });
      syncCipLinkedInputs();
      renderCipCalc();
    }

    function syncCipLinkedInputs() {
      if (!isCipLinked() || !lastHoldUpCipData) return;
      setControlValue("cipDiameter", lastHoldUpCipData.d_mm);
      setControlValue("cipRouteLength", lastHoldUpCipData.length_m);
      setControlValue("cipVolume", lastHoldUpCipData.volume_l);
      saveFormState();
    }

    function bindCipModeToggle() {
      document.getElementById("cipLinkedBtn")?.addEventListener("click", () => setCipLinkedMode(true));
      document.getElementById("cipStandaloneBtn")?.addEventListener("click", () => setCipLinkedMode(false));
      setCipLinkedMode(isCipLinked());
    }

    function getCurrentFormState() {
      const ids = [
        "flow", "retention", "fluid", "rho", "mu", "pipeStandard", "pipeSize", "roughness", "straightSeg",
        "lossMethod", "elbowType", "manualElbowData", "kElbow", "leqElbowLD", "elbowRadiusD", "inletOutletExtension", "includeIO", "cipMin", "cipMax", "targetSpeed",
        "use11852", "lib11852", "count11852", "k11852",
        "manual11852", "use11851", "lib11851", "count11851", "k11851",
        "cipDiameter", "cipRouteLength", "cipVolume", "cipTemp", "cipCycles",
        "manual11851", "use32676", "lib32676", "count32676", "k32676", "manual32676"
      ];
      const state = {};
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        state[id] = el.type === "checkbox" ? el.checked : el.value;
      });
      return state;
    }

    function saveFormState() {
      localStorage.setItem(FORM_STATE_KEY, JSON.stringify(getCurrentFormState()));
    }

    function restoreInputsFromSession() {
      const rawFormState = localStorage.getItem(FORM_STATE_KEY);
      if (rawFormState) {
        try {
          const state = JSON.parse(rawFormState);
          if (state.pipeStandard && pipeSeries[state.pipeStandard]) {
            pipeStandardSelect.value = state.pipeStandard;
            fillPipeSizes();
          }
          if (state.pipeSize !== undefined && state.pipeSize !== null) {
            pipeSizeSelect.value = state.pipeSize;
          }

          [
            "flow", "retention", "fluid", "rho", "mu", "roughness", "straightSeg", "lossMethod", "manualElbowData", "kElbow", "leqElbowLD", "elbowRadiusD", "inletOutletExtension",
            "includeIO", "cipMin", "cipMax", "targetSpeed", "elbowType",
            "cipDiameter", "cipRouteLength", "cipVolume", "cipTemp", "cipCycles",
            "use11852", "lib11852", "manual11852", "count11852", "k11852",
            "use11851", "lib11851", "manual11851", "count11851", "k11851",
            "use32676", "lib32676", "manual32676", "count32676", "k32676"
          ].forEach(id => setControlValue(id, state[id]));
          normalizeInletOutletExtensionControl();

          updateElbowFromLibrary();
          update11852FromLibrary();
          update11851FromLibrary();
          update32676FromLibrary();

          if (manualChecked("manualElbowData")) {
            setControlValue("kElbow", state.kElbow);
            setControlValue("leqElbowLD", state.leqElbowLD);
            setControlValue("elbowRadiusD", state.elbowRadiusD);
          }
          if (manualChecked("manual11852")) setControlValue("k11852", state.k11852);
          if (manualChecked("manual11851")) setControlValue("k11851", state.k11851);
          if (manualChecked("manual32676")) setControlValue("k32676", state.k32676);

          updatePipeIdInfo();
          return;
        } catch (_err) {
        }
      }

      const raw = localStorage.getItem("coilCalcData");
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw);
        const i = parsed?.inputs;
        if (!i) return;

        if (i.pipeStandard && pipeSeries[i.pipeStandard]) {
          pipeStandardSelect.value = i.pipeStandard;
          fillPipeSizes();
        }

        if (Number.isFinite(i.pipeSizeIndex)) {
          const idx = Number(i.pipeSizeIndex);
          if (idx >= 0 && idx < pipeSizeSelect.options.length) {
            pipeSizeSelect.selectedIndex = idx;
          }
        }

        if (i.fluid && fluidDb[i.fluid]) fluidSelect.value = i.fluid;
        if (i.elbowType && elbowLibrary[i.elbowType]) elbowTypeSelect.value = i.elbowType;
        if (lib11852Select && i.lib11852 && fittingLibrary11852[i.lib11852]) lib11852Select.value = i.lib11852;
        if (lib11851Select && i.lib11851 && fittingLibrary11851[i.lib11851]) lib11851Select.value = i.lib11851;
        if (lib32676Select && i.lib32676 && fittingLibrary32676[i.lib32676]) lib32676Select.value = i.lib32676;

        setControlValue("flow", i.q_l_h);
        setControlValue("retention", i.t);
        setControlValue("rho", i.rho);
        setControlValue("mu", i.mu_mpa_s);
        setControlValue("roughness", i.roughness_mm);
        setControlValue("straightSeg", i.segment);
        setControlValue("lossMethod", i.lossMethod);
        setControlValue("kElbow", i.kElbow);
        setControlValue("leqElbowLD", i.leqElbowLD);
        setControlValue("elbowRadiusD", i.elbowRadiusD);
        setControlValue("inletOutletExtension", i.inletOutletExtensionMm);
        normalizeInletOutletExtensionControl();
        setControlValue("cipMin", i.cipMin);
        setControlValue("cipMax", i.cipMax);
        setControlValue("targetSpeed", i.targetSpeed);
        setControlValue("cipDiameter", i.cipDiameter);
        setControlValue("cipRouteLength", i.cipRouteLength);
        setControlValue("cipVolume", i.cipVolume);
        setControlValue("cipTemp", i.cipTemp);
        setControlValue("cipCycles", i.cipCycles);
        setControlValue("count11852", i.count11852);
        setControlValue("k11852", i.k11852);
        setControlValue("count11851", i.count11851);
        setControlValue("k11851", i.k11851);
        setControlValue("count32676", i.count32676);
        setControlValue("k32676", i.k32676);

        setControlValue("includeIO", i.includeIO);
        setControlValue("manualElbowData", i.manualElbowData);
        setControlValue("use11852", i.use11852);
        setControlValue("manual11852", i.manual11852);
        setControlValue("use11851", i.use11851);
        setControlValue("manual11851", i.manual11851);
        setControlValue("use32676", i.use32676);
        setControlValue("manual32676", i.manual32676);

        updateElbowFromLibrary();
        update11852FromLibrary();
        update11851FromLibrary();
        update32676FromLibrary();

        if (manualChecked("manualElbowData")) {
          setControlValue("kElbow", i.kElbow);
          setControlValue("leqElbowLD", i.leqElbowLD);
          setControlValue("elbowRadiusD", i.elbowRadiusD);
        }
        if (manualChecked("manual11852")) setControlValue("k11852", i.k11852);
        if (manualChecked("manual11851")) setControlValue("k11851", i.k11851);
        if (manualChecked("manual32676")) setControlValue("k32676", i.k32676);

        updatePipeIdInfo();
      } catch (_e) {
      }
    }

    function resetAllFields() {
      const proceed = window.confirm("Сигурен ли си, че искаш да върнеш всички полета към началните стойности?");
      if (!proceed) return;
      localStorage.removeItem("coilCalcData");
      localStorage.removeItem("coilCalcUpdatedAt");
      localStorage.removeItem(FORM_STATE_KEY);
      localStorage.removeItem(CIP_LINKED_KEY);
      localStorage.removeItem(PUMP_MODE_KEY);
      localStorage.removeItem(ROUTE_STATE_KEY);
      localStorage.removeItem(ROUTE_MODE_KEY);
      ["process", "cip"].forEach(mode => localStorage.removeItem(routeModeInputKey(mode)));
      ["process", "cip", "routeProcess", "routeCip", "test"].forEach(mode => {
        localStorage.removeItem(pumpLinkKey(mode));
        localStorage.removeItem(pumpStateKey(mode));
      });
      window.location.reload();
    }

    function recommendPipe(allProfiles, targetSpeed, cipMin, cipMax) {
      const withScore = allProfiles.map(p => ({
        ...p,
        speedError: Math.abs(p.velocity - targetSpeed),
        inCip: p.velocity >= cipMin && p.velocity <= cipMax
      }));

      const cipCandidates = withScore.filter(p => p.inCip)
        .sort((a, b) => (a.speedError - b.speedError) || (a.dpTotalBar - b.dpTotalBar));

      if (cipCandidates.length > 0) {
        return {
          pick: cipCandidates[0],
          mode: "cip"
        };
      }

      const nearest = withScore.sort((a, b) => (a.speedError - b.speedError) || (a.dpTotalBar - b.dpTotalBar));
      return {
        pick: nearest[0],
        mode: "nearest"
      };
    }

    function renderRecommendation(rec, targetSpeed, cipMin, cipMax) {
      if (!recommendationBox) return;
      const p = rec.pick;
      if (!p) {
        recommendationBox.textContent = "Няма валидни профили за препоръка.";
        return;
      }

      const base = `Препоръчан размер: ${p.pipe.dn} (ID ${fmt(p.d_mm, 1)} mm), v = ${fmt(p.velocity, 3)} m/s, Δp = ${fmt(p.dpTotalBar, 4)} bar.`;
      const reason = rec.mode === "cip"
        ? `Изборът е в CIP диапазона ${fmt(cipMin, 1)}-${fmt(cipMax, 1)} m/s и е най-близо до търсената скорост ${fmt(targetSpeed, 2)} m/s.`
        : `Няма профил в CIP диапазона ${fmt(cipMin, 1)}-${fmt(cipMax, 1)} m/s; избран е най-близкият до търсената скорост ${fmt(targetSpeed, 2)} m/s.`;
      recommendationBox.textContent = `${base} ${reason}`;
    }

    function formulaBlock(title, formula, substituted, result = "", note = "") {
      return { title, formula, substituted, result, note };
    }

    function formulaPlainText(item) {
      if (typeof item === "string") return item.replace(/\n/g, " ");
      return [
        item.title,
        item.formula ? `Формула: ${item.formula}` : "",
        item.substituted ? `Заместено: ${item.substituted}` : "",
        item.result ? `Резултат: ${item.result}` : "",
        item.note ? `Бележка: ${item.note}` : ""
      ].filter(Boolean).join(" | ");
    }

    function protocolFormulaBlocks(report) {
      const dM = report.id_mm / 1000;
      const muPaS = report.mu_mpa_s / 1000;
      const dyn = report.dynamicPa;
      const geometryFormula = report.elbowRadiusIsTabular
        ? "Lколяно = (π/2) · Rтабл."
        : "Lколяно = (π/2) · (R/D) · Dᵢ";
      const geometrySubstitution = report.elbowRadiusIsTabular
        ? `Lколяно = (π/2) · ${fmt(report.elbowRadius_mm, 1)} mm = ${fmt(report.elbowArcLength_m, 4)} m`
        : `Lколяно = (π/2) · ${fmt(report.elbowRadiusD, 2)} · ${fmt(dM, 4)} m = ${fmt(report.elbowArcLength_m, 4)} m`;
      const lossFormula = report.lossMethod.startsWith("Leq")
        ? "Lхидр = L + nколена · (L/D)коляно · Dᵢ"
        : "ΣK = nколена · K90; Δpлок = ΣK · ρv²/2";
      const lossSubstitution = report.lossMethod.startsWith("Leq")
        ? `Lхидр = ${fmt(report.length_m, 3)} + ${report.elbows90} · ${fmt(report.leqElbowLD, 1)} · ${fmt(dM, 4)} = ${fmt(report.lHydraulicTotal_m, 3)} m`
        : `ΣK = ${report.elbows90} · ${fmt(report.kElbow, 2)} = ${fmt(report.kTotal, 3)}; Δpлок = ${fmt(report.kTotal, 3)} · ${fmt(dyn, 2)} = ${fmt(report.dpLocal_kpa * 1000, 2)} Pa`;

      return [
        formulaBlock(
          "Преобразуване на дебита",
          "Q_L/s = Q_L/h / 3600; Q = Q_L/s / 1000",
          `Q_L/s = ${fmt(report.q_l_h, 1)} / 3600 = ${fmt(report.q_l_s, 4)} L/s; Q = ${fmt(report.q_l_s, 4)} / 1000 = ${fmt(report.q_m3_s, 6)} m³/s`
        ),
        formulaBlock(
          "Вътрешен диаметър",
          "Dᵢ = OD - 2s",
          `Dᵢ = ${fmt(report.od_mm, 1)} - 2 · ${fmt(report.wall_mm, 1)} = ${fmt(report.id_mm, 1)} mm`
        ),
        formulaBlock(
          "Площ на сечение",
          "A = π · Dᵢ² / 4",
          `A = π · (${fmt(dM, 4)})² / 4 = ${fmt(report.area_m2, 6)} m²`
        ),
        formulaBlock(
          "Необходим обем за задръжка",
          "V = Q · t",
          `V = ${fmt(report.q_m3_s, 6)} · ${fmt(report.t, 1)} = ${fmt(report.volume_m3, 6)} m³`,
          `${fmt(report.volume_l, 2)} L`
        ),
        formulaBlock(
          "Обем на тръбата за 1 m",
          "V1m = A · 1m · 1000",
          `V1m = ${fmt(report.area_m2, 6)} · 1000 = ${fmt(report.volumePerMeter_l_m, 3)} L/m`
        ),
        formulaBlock(
          "Обща дължина на задръжката",
          "L = V / A",
          `L = ${fmt(report.volume_m3, 6)} / ${fmt(report.area_m2, 6)} = ${fmt(report.length_m, 3)} m`
        ),
        formulaBlock(
          "Геометрия на колената",
          geometryFormula,
          geometrySubstitution,
          `nколена = вътрешни 2 · (${report.nStraights} - 1) + вход/изход ${report.inletOutletElbows90} = ${report.serpentineElbows90} + ${report.inletOutletElbows90} = ${report.elbows90}; общо в колена = ${fmt(report.totalElbowArcLength_m, 3)} m`
        ),
        formulaBlock(
          "Скорост",
          "v = Q / A",
          `v = ${fmt(report.q_m3_s, 6)} / ${fmt(report.area_m2, 6)} = ${fmt(report.velocity_m_s, 4)} m/s`
        ),
        formulaBlock(
          "Reynolds",
          "Re = ρ · v · Dᵢ / μ",
          `μ = ${fmt(report.mu_mpa_s, 3)} / 1000 = ${fmt(muPaS, 6)} Pa·s; Re = ${fmt(report.rho, 1)} · ${fmt(report.velocity_m_s, 4)} · ${fmt(dM, 4)} / ${fmt(muPaS, 6)} = ${fmt(report.re, 0)}`
        ),
        formulaBlock(
          "Коефициент на триене",
          "f = 64/Re при ламинарен режим; f = 0.25/[log10(ε/(3.7Dᵢ)+5.74/Re^0.9)]² при турбулентен режим",
          `ε = ${fmt(report.roughness_mm || 0, 4)} mm; f = ${fmt(report.f, 5)}`
        ),
        formulaBlock(
          "Локални съпротивления",
          lossFormula,
          lossSubstitution,
          report.lossMethod
        ),
        formulaBlock(
          "Динамично налягане",
          "p_dyn = ρv²/2",
          `p_dyn = ${fmt(report.rho, 1)} · (${fmt(report.velocity_m_s, 4)})² / 2 = ${fmt(dyn, 2)} Pa`
        ),
        formulaBlock(
          "Пад на налягане",
          "Δp = Δpлинейни + Δpлокални",
          `Δp = ${fmt(report.dpLinear_kpa * 1000, 2)} + ${fmt(report.dpLocal_kpa * 1000, 2)} = ${fmt(report.dpTotal_pa, 2)} Pa`,
          `${fmt(report.dpTotal_kpa, 2)} kPa = ${fmt(report.dpTotal_bar, 4)} bar`
        ),
        formulaBlock(
          "Ориентировъчна работна помпа",
          "H = Δp/(ρg) · (1 + резерв); P = ρgQH/η",
          `H = ${fmt(report.dpTotal_pa, 2)}/(${fmt(report.rho, 1)} · 9.80665) · (1 + ${fmt(report.workPumpReserve_percent / 100, 2)}) = ${fmt(report.workPumpHead_m, 2)} m; P ≈ ${fmt(report.workPumpPower_kW, 3)} kW`
        )
      ];
    }

    function protocolSections(report) {
      const process = [
        ["Дебит на продукта", `${fmt(report.q_l_s, 4)} L/s`],
        ["Общ обем на задръжката", `${fmt(report.volume_l,2)} L`],
        ["Обем на тръбата", `${fmt(report.volumePerMeter_l_m,3)} L/m`],
        ["Обща дължина", `${fmt(report.length_m,2)} m`],
        ["Брой колена 90°", `${report.elbows90}`],
        ["Дължина на 1 коляно", `${fmt(report.elbowArcLength_m,3)} m`],
        ["Работна помпа", `${fmt(report.workPumpFlow_m3_h,3)} m³/h | H=${fmt(report.workPumpHead_m,2)} m | P≈${fmt(report.workPumpPower_kW,3)} kW`],
        ["Общи загуби", `${fmt(report.dpTotal_bar,4)} bar`],
        ["Скорост", `${fmt(report.velocity_m_s,3)} m/s`]
      ];

      const inputs = [
        ["Дебит", `${fmt(report.q_l_h, 1)} L/h (${fmt(report.q_l_s, 4)} L/s)`],
        ["Дебит (вътрешен за сметка)", `${fmt(report.q_m3_s, 6)} m³/s`],
        ["Време на задръжка", `${fmt(report.t, 1)} s`],
        ["Тръба", `${report.pipeStandard} | ${report.selectedDN} | OD ${fmt(report.od_mm,1)} mm | s ${fmt(report.wall_mm,1)} mm | ID ${fmt(report.id_mm,1)} mm`],
        ["Плътност / вискозитет", `${fmt(report.rho,1)} kg/m³ / ${fmt(report.mu_mpa_s,3)} mPa·s`],
        ["CIP диапазон", `${fmt(report.cipMin,2)} – ${fmt(report.cipMax,2)} m/s`],
        ["Метод колена", `${report.lossMethod}`],
        ["Коляно 90°", `${report.elbowType}; K=${fmt(report.kElbow,2)}; (L/D)=${fmt(report.leqElbowLD,1)}; R=${fmt(report.elbowRadius_mm,1)} mm; R/D=${fmt(report.elbowRadiusD,2)}${report.elbowRadiusIsTabular ? " (таблично)" : ""}`],
        ["Геометрия вход/изход", `удължение=${fmt(report.inletOutletExtension_m,3)} m; дължина=${fmt(report.inletOutletLength_m,3)} m`]
      ];

      const results = [
        ["Общ обем на задръжката", `${fmt(report.volume_l,2)} L`],
        ["Обем на задръжката", `${fmt(report.volume_m3,6)} m³`],
        ["Обем на 1 m тръба", `${fmt(report.volumePerMeter_l_m,3)} L/m`],
        ["Площ на сечение", `${fmt(report.area_m2,6)} m²`],
        ["Обща дължина", `${fmt(report.length_m,2)} m`],
        ["Хидравлична дължина Lобщо", `${fmt(report.lHydraulicTotal_m,3)} m`],
        ["Брой колена 90°", `${report.elbows90}`],
        ["Разбивка колена", `вътрешни=${report.serpentineElbows90}; вход/изход=${report.inletOutletElbows90}`],
        ["Дължина на 1 коляно", `${fmt(report.elbowArcLength_m,3)} m`],
        ["Вход/изход геометрична дължина", `${fmt(report.inletOutletLength_m,3)} m`],
        ["Работна помпа - дебит", `${fmt(report.workPumpFlow_m3_h,3)} m³/h`],
        ["Работна помпа - напор", `${fmt(report.workPumpHead_m,2)} m`],
        ["Работна помпа - мощност", `${fmt(report.workPumpPower_kW,3)} kW при резерв ${fmt(report.workPumpReserve_percent,0)}% и КПД ${fmt(report.workPumpEfficiency_percent,0)}%`],
        ["Скорост", `${fmt(report.velocity_m_s,3)} m/s`],
        ["Уделна задръжка", `${fmt(report.retention_s_l,3)} s/L`],
        ["Re / f", `${fmt(report.re,0)} / ${fmt(report.f,5)}`],
        ["ΣK / Kколена", `${fmt(report.kTotal,3)} / ${fmt(report.kElbowsOnly,3)}`],
        ["Leq колена", `${fmt(report.leqElbows_m,3)} m`],
        ["Динамично налягане ρv²/2", `${fmt(report.dynamicPa,2)} Pa`],
        ["Общ пад на налягане", `${fmt(report.dpTotal_pa,2)} Pa | ${fmt(report.dpTotal_kpa,2)} kPa | ${fmt(report.dpTotal_bar,4)} bar`],
        ["Линейни загуби", `${fmt(report.dpLinear_kpa,2)} kPa`],
        ["Загуби в колена", `${fmt(report.dpElbows_kpa,2)} kPa`],
        ["Локални загуби общо", `${fmt(report.dpLocal_kpa,2)} kPa`],
        ["Препоръчан DN", `${report.recDN} | v=${fmt(report.recV,3)} m/s | Δp=${fmt(report.recDp,4)} bar`]
      ];

      return { process, inputs, results, formulas: protocolFormulaBlocks(report) };
    }

    function downloadBlob(blob, filename) {
      if (window.saveAs) {
        window.saveAs(blob, filename);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    function dataUrlToUint8Array(dataUrl) {
      const base64 = dataUrl.split(",")[1] || "";
      const raw = atob(base64);
      const array = new Uint8Array(raw.length);
      for (let idx = 0; idx < raw.length; idx += 1) array[idx] = raw.charCodeAt(idx);
      return array;
    }

    function readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve("");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    }

    function imageSize(dataUrl) {
      return new Promise(resolve => {
        if (!dataUrl) {
          resolve(null);
          return;
        }
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
        img.onerror = () => resolve(null);
        img.src = dataUrl;
      });
    }

    function fitImageSize(size, maxWidth, maxHeight) {
      if (!size?.width || !size?.height) return { width: maxWidth, height: maxHeight };
      const scale = Math.min(maxWidth / size.width, maxHeight / size.height, 1);
      return {
        width: Math.round(size.width * scale),
        height: Math.round(size.height * scale)
      };
    }

    async function getProtocolMeta() {
      const title = document.getElementById("protocolTitle")?.value.trim() || "Протокол за изчисления";
      const date = document.getElementById("protocolDate")?.value || "";
      const notes = document.getElementById("protocolNotes")?.value.trim() || "";
      const authorTitle = document.getElementById("protocolAuthorTitle")?.value || "";
      const authorSalutation = document.getElementById("protocolAuthorSalutation")?.value || "";
      const authorName = document.getElementById("protocolAuthorName")?.value.trim() || "";
      const logoInput = document.getElementById("protocolLogo");
      const logoFile = protocolLogoFile || logoInput?.files?.[0] || null;
      const logoDataUrl = await readFileAsDataUrl(logoFile);
      return {
        title,
        date,
        notes,
        authorTitle,
        authorSalutation,
        authorName,
        logoName: logoFile?.name || "",
        logoDataUrl,
        logoSize: await imageSize(logoDataUrl)
      };
    }

    function protocolDefaultTitle() {
      const pipe = pipeSeries[pipeStandardSelect.value]?.[parseInt(pipeSizeSelect.value, 10)];
      const dn = pipe?.dn || "DN";
      const qLs = (parseRouteNumber(document.getElementById("flow")?.value, 0) || 0) / 3600;
      const retentionS = parseRouteNumber(document.getElementById("retention")?.value, 0);
      return `Протокол за изчисления - тръбна задръжка ${dn}, Q=${fmt(qLs, 3)} L/s, t=${fmt(retentionS, 0)} s`;
    }

    function syncProtocolTitle({ force = false } = {}) {
      const titleInput = document.getElementById("protocolTitle");
      if (!titleInput) return;
      const generated = protocolDefaultTitle();
      const shouldSync = force || !protocolTitleUserEdited || titleInput.dataset.autoTitle === "true" || titleInput.value.trim() === "";
      if (!shouldSync) return;
      titleInput.value = generated;
      titleInput.dataset.autoTitle = "true";
      protocolTitleUserEdited = false;
    }

    function updateProtocolLogoName() {
      const logoName = document.getElementById("protocolLogoName");
      if (!logoName) return;
      const file = protocolLogoFile || document.getElementById("protocolLogo")?.files?.[0] || null;
      logoName.textContent = file ? `Избрано лого: ${file.name}` : "Избери файл или пусни логото тук";
    }

    function bindProtocolLogoDrop() {
      const dropZone = document.getElementById("protocolLogoDrop");
      const logoInput = document.getElementById("protocolLogo");
      if (!dropZone || !logoInput) return;

      const setLogoFile = file => {
        if (!file || !file.type.startsWith("image/")) return;
        protocolLogoFile = file;
        try {
          const transfer = new DataTransfer();
          transfer.items.add(file);
          logoInput.files = transfer.files;
        } catch (_err) {
        }
        updateProtocolLogoName();
        updateProtocolPreview();
      };

      dropZone.addEventListener("click", event => {
        if (event.target !== logoInput) logoInput.click();
      });
      dropZone.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        logoInput.click();
      });
      ["dragenter", "dragover"].forEach(type => {
        dropZone.addEventListener(type, event => {
          event.preventDefault();
          dropZone.classList.add("drag-over");
        });
      });
      ["dragleave", "drop"].forEach(type => {
        dropZone.addEventListener(type, () => dropZone.classList.remove("drag-over"));
      });
      dropZone.addEventListener("drop", event => {
        event.preventDefault();
        setLogoFile(Array.from(event.dataTransfer?.files || []).find(file => file.type.startsWith("image/")));
      });
      logoInput.addEventListener("change", () => {
        protocolLogoFile = logoInput.files?.[0] || null;
        updateProtocolLogoName();
        updateProtocolPreview();
      });
      updateProtocolLogoName();
    }

    async function exportWordProtocol(report, fileBase) {
      if (!window.docx) {
        alert("Липсва библиотека за Word експорт.");
        return;
      }

      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        HeadingLevel,
        AlignmentType,
        Table,
        TableRow,
        TableCell,
        ImageRun,
        WidthType
      } = window.docx;

      const sections = protocolSections(report);
      const processRows = sections.process.map(([k, v]) => new TableRow({
        children: [
          new TableCell({ width: { size: 42, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: k, bold: true })] })] }),
          new TableCell({ width: { size: 58, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: v, bold: true, size: 24 })] })] })
        ]
      }));

      const pairRows = sections.inputs.concat(sections.results).map(([k, v]) => new TableRow({
        children: [
          new TableCell({ width: { size: 42, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: k, bold: true })] })] }),
          new TableCell({ width: { size: 58, type: WidthType.PERCENTAGE }, children: [new Paragraph(v)] })
        ]
      }));

      const profileRows = [
        new TableRow({ children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "DN", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ID [mm]", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "v [m/s]", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Δp [bar]", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "L [m]", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "CIP", bold: true })] })] })
        ]})
      ].concat(report.profiles.map(p => new TableRow({ children: [
        new TableCell({ children: [new Paragraph(p.dn)] }),
        new TableCell({ children: [new Paragraph(fmt(p.id_mm, 1))] }),
        new TableCell({ children: [new Paragraph(fmt(p.velocity, 3))] }),
        new TableCell({ children: [new Paragraph(fmt(p.dpBar, 4))] }),
        new TableCell({ children: [new Paragraph(fmt(p.length, 2))] }),
        new TableCell({ children: [new Paragraph(p.cip)] })
      ]})));

      const formulaParagraphs = sections.formulas.slice(0, 20).map((line, idx) =>
        new Paragraph({ text: `${idx + 1}. ${formulaPlainText(line)}` })
      );

      const chartBlock = report.chartDataUrl
        ? [
            new Paragraph({ text: "3) Графика на скорости (CIP)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: dataUrlToUint8Array(report.chartDataUrl),
                  transformation: { width: 560, height: 260 }
                })
              ]
            }),
            new Paragraph({ text: "" })
          ]
        : [];

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({ text: "ПРОТОКОЛ ЗА ПРЕСМЯТАНЕ НА ТРЪБНА ЗАДРЪЖКА (СЕРПЕНТИНА)", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.LEFT }),
            new Paragraph({ text: `Дата: ${report.date} | Метод: ${report.lossMethod} | Продукт: ${report.fluid}` }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "1) Процесни стойности", heading: HeadingLevel.HEADING_2 }),
            new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: processRows }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "2) Детайлни резултати и входни данни", heading: HeadingLevel.HEADING_2 }),
            new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: pairRows }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "3) Профили DN ±2", heading: HeadingLevel.HEADING_2 }),
            new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: profileRows }),
            new Paragraph({ text: "" }),
            ...chartBlock,
            new Paragraph({ text: "4) Разчетни формули (резюме)", heading: HeadingLevel.HEADING_2 }),
            ...formulaParagraphs,
            new Paragraph({ text: "" })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, `${fileBase}.docx`);
    }

    function exportPdfProtocol(report, fileBase) {
      if (!window.pdfMake) {
        alert("Липсва библиотека за PDF експорт.");
        return;
      }

      const sections = protocolSections(report);
      const formulaList = sections.formulas.slice(0, 20).map((line, idx) => `${idx + 1}. ${formulaPlainText(line)}`);
      const content = [
        { text: "ПРОТОКОЛ ЗА ПРЕСМЯТАНЕ НА ТРЪБНА ЗАДРЪЖКА (СЕРПЕНТИНА)", style: "header" },
        { text: `Дата: ${report.date} | Метод: ${report.lossMethod} | Продукт: ${report.fluid}`, style: "subheader" },
        { text: "\n1) Процесни стойности", style: "section" },
        {
          table: {
            widths: ["42%", "58%"],
            body: [[{ text: "Показател", style: "th" }, { text: "Стойност", style: "th" }]].concat(sections.process.map(([k, v]) => [{ text: k, style: "tdKey" }, { text: v, style: "tdEmph" }]))
          },
          layout: "lightHorizontalLines"
        },
        { text: "\n2) Входни данни", style: "section" },
        {
          table: {
            widths: ["42%", "58%"],
            body: [[{ text: "Параметър", style: "th" }, { text: "Стойност", style: "th" }]].concat(sections.inputs.map(([k, v]) => [{ text: k, style: "tdKey" }, { text: v, style: "td" }]))
          },
          layout: "lightHorizontalLines"
        },
        { text: "\n3) Детайлни резултати", style: "section" },
        {
          table: {
            widths: ["42%", "58%"],
            body: [[{ text: "Параметър", style: "th" }, { text: "Стойност", style: "th" }]].concat(sections.results.map(([k, v]) => [{ text: k, style: "tdKey" }, { text: v, style: "td" }]))
          },
          layout: "lightHorizontalLines"
        },
        { text: "\n4) Профили DN ±2", style: "section" },
        {
          table: {
            headerRows: 1,
            widths: ["14%", "14%", "14%", "14%", "14%", "30%"],
            body: [["DN", "ID [mm]", "v [m/s]", "Δp [bar]", "L [m]", "CIP"]]
              .concat(report.profiles.map(p => [p.dn, fmt(p.id_mm, 1), fmt(p.velocity, 3), fmt(p.dpBar, 4), fmt(p.length, 2), p.cip]))
          },
          layout: "lightHorizontalLines"
        },
        { text: "\n5) Графика на скорости (CIP)", style: "section" },
        report.chartDataUrl ? { image: report.chartDataUrl, width: 500, margin: [0, 4, 0, 4] } : { text: "Няма налична графика.", style: "td" },
        { text: "\n6) Разчетни формули (резюме)", style: "section" },
        { ol: formulaList, fontSize: 8.5 }
      ];

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [28, 28, 28, 28],
        content,
        defaultStyle: { font: "Roboto", fontSize: 9, color: "#122033" },
        styles: {
          header: { fontSize: 13, bold: true, color: "#0f172a" },
          subheader: { fontSize: 9, color: "#4b5d76" },
          section: { fontSize: 11, bold: true, color: "#153b73" },
          th: { bold: true, fillColor: "#eaf1ff", color: "#153b73" },
          tdKey: { bold: true },
          tdEmph: { bold: true, fontSize: 10, color: "#0f172a" },
          td: {},
          foot: { fontSize: 8, color: "#4b5d76" }
        }
      };

      window.pdfMake.createPdf(docDefinition).download(`${fileBase}.pdf`);
    }

    function selectedProtocolSections() {
      const sections = [];

      if (document.getElementById("protocolRetention")?.checked) {
        if (!lastProtocolData) calc();
        const s = protocolSections(lastProtocolData);
        sections.push({
          title: "Тръбна задръжка със серпентина",
          rows: [
            ...s.process,
            ...s.inputs,
            ...s.results,
            ["Работен режим", `v=${fmt(lastProtocolData.velocity_m_s, 3)} m/s; помпа ${fmt(lastProtocolData.workPumpFlow_m3_h, 3)} m³/h, H=${fmt(lastProtocolData.workPumpHead_m, 2)} m, P≈${fmt(lastProtocolData.workPumpPower_kW, 3)} kW`],
            ["Профили DN ±2", (lastProtocolData.profiles || []).map(p => `${p.dn}: ID ${fmt(p.id_mm, 1)} mm, v=${fmt(p.velocity, 3)} m/s, Δp=${fmt(p.dpBar, 4)} bar`).join("; ")]
          ],
          formulas: s.formulas || []
        });
      }

      if (document.getElementById("protocolCip")?.checked) {
        if (isCipLinked()) syncCipLinkedInputs();
        const dMm = num("cipDiameter", 1);
        const length = num("cipRouteLength", 0);
        const volumeL = num("cipVolume", 0);
        const minV = num("cipMin", 1.5);
        const temp = num("cipTemp", 65);
        const cycles = Math.max(1, Math.round(num("cipCycles", 1)));
        const props = cipFluidProperties(temp);
        const d = dMm / 1000;
        const area = Math.PI * Math.pow(d, 2) / 4;
        const eps = ((lastHoldUpCipData?.roughness_mm ?? num("roughness", 0.0015)) || 0.0015) / 1000;
        const totalK = lastHoldUpCipData?.kTotal || 0;
        const re = (props.rho * minV * d) / props.mu;
        const lambda = colebrookWhite(re, eps, d);
        const dyn = props.rho * Math.pow(minV, 2) / 2;
        const dpFriction = lambda * (length / d) * dyn;
        const dpLocal = totalK * dyn;
        const dpTotal = dpFriction + dpLocal;
        const neededFlowLh = minV * area * 3600 * 1000;
        const qLs = neededFlowLh / 3600;
        const flushTime = qLs > 0 ? volumeL / qLs : 0;
        const verdict = cipVerdict(minV, re);
        sections.push({
          title: "CIP миене",
          rows: [
            ["Режим", isCipLinked() ? "Свързан със задръжката" : "Самостоятелен"],
            ["ID / дължина / обем", `${fmt(dMm, 1)} mm / ${fmt(length, 2)} m / ${fmt(volumeL, 2)} L`],
            ["Температура / свойства", `${fmt(props.tempC, 0)} °C; ρ=${fmt(props.rho, 1)} kg/m³; μ=${fmt(props.mu, 6)} Pa·s`],
            ["CIP min / max", `${fmt(minV, 3)} / ${fmt(num("cipMax", V_GREEN_MAX), 3)} m/s`],
            ["Статус", `${verdict.label}; ${cipRegimeText(re)}`],
            ["Минимален дебит за CIP", `${fmt(neededFlowLh, 0)} L/h`],
            ["Re / λ", `${fmt(re, 0)} / ${fmt(lambda, 5)}`],
            ["Δp триене / локални", `${fmt(dpFriction / 100000, 4)} bar / ${fmt(dpLocal / 100000, 4)} bar`],
            ["Общо Δp", `${fmt(dpTotal / 100000, 4)} bar`],
            ["Време за промиване", `${fmt(flushTime, 1)} s за 1 обем; ${fmt(flushTime * cycles, 1)} s общо`]
          ],
          formulas: [
            formulaBlock(
              "Минимален дебит за CIP",
              "Qmin = vmin · (πD²/4) · 3 600 000",
              `Qmin = ${fmt(minV, 3)} · ${fmt(area, 6)} · 3 600 000 = ${fmt(neededFlowLh, 0)} L/h`
            ),
            formulaBlock(
              "Reynolds CIP",
              "Re = ρ·v·D/μ",
              `Re = ${fmt(props.rho, 1)} · ${fmt(minV, 3)} · ${fmt(d, 4)} / ${fmt(props.mu, 6)} = ${fmt(re, 0)}`
            ),
            formulaBlock(
              "Colebrook-White",
              "1/√λ = -2·log(ε/(3.71·D) + 2.51/(Re·√λ))",
              `λ = ${fmt(lambda, 5)} при ε=${fmt(eps, 6)} m`
            ),
            formulaBlock(
              "Пад на налягане",
              "Δp = λ(L/D)ρv²/2 + Σζ·ρv²/2",
              `Δp = ${fmt(dpFriction, 2)} + ${fmt(dpLocal, 2)} = ${fmt(dpTotal, 2)} Pa`,
              `${fmt(dpTotal / 100000, 4)} bar`
            )
          ]
        });
      }

      if (document.getElementById("protocolPumps")?.checked) {
        syncPumpLinkedInputs();
        const flowLhBase = num("pumpFlow", 0);
        const isCipPumpMode = currentPumpMode === "cip" || currentPumpMode === "routeCip";
        const flowLh = isCipPumpMode ? flowLhBase * 1.15 : flowLhBase;
        const rho = num("pumpRho", 1000);
        const mu = num("pumpMu", 0.001);
        const d = num("pumpDiameter", 1) / 1000;
        const length = num("pumpLength", 0);
        const q = flowLh / 1000 / 3600;
        const area = Math.PI * Math.pow(d, 2) / 4;
        const velocity = area > 0 ? q / area : 0;
        const re = mu > 0 ? (rho * velocity * d) / mu : 0;
        const lambda = colebrookWhite(re, num("pumpRoughness", 0.0015) / 1000, d);
        const velocityHead = Math.pow(velocity, 2) / (2 * 9.80665);
        const hFriction = d > 0 ? lambda * (length / d) * velocityHead : 0;
        const staticHead = num("pumpStaticHead", 0);
        const hLocal = num("pumpTotalK", 0) * velocityHead;
        const hExtra = num("pumpExtraHead", 0) + (num("pumpBackPressure", 0) * 100000) / (rho * 9.80665);
        const hSafety = (hFriction + staticHead + hLocal + hExtra) * 0.10;
        const totalHead = hFriction + staticHead + hLocal + hExtra + hSafety;
        const efficiency = Math.min(0.8, Math.max(0.4, num("pumpEfficiency", 0.65)));
        const hydraulicPower = rho * 9.80665 * q * totalHead;
        const shaftPower = hydraulicPower / efficiency;
        const pumpModeLabel = {
          process: "Задръжка - работа",
          cip: "Задръжка - CIP",
          routeProcess: "Трасе - работа",
          routeCip: "Трасе - CIP",
          test: "Тестов режим"
        }[currentPumpMode] || currentPumpMode;
        sections.push({
          title: "Избор на помпа",
          rows: [
            ["Режим", pumpModeLabel],
            ["Дебит", `${fmt(flowLh / 1000, 3)} m³/h (${fmt(flowLh / 3600, 3)} L/s)`],
            ["H_friction / H_static / H_local", `${fmt(hFriction, 2)} / ${fmt(staticHead, 2)} / ${fmt(hLocal, 2)} m`],
            ["H_extra / H_safety", `${fmt(hExtra, 2)} / ${fmt(hSafety, 2)} m`],
            ["Общ напор / Δp", `${fmt(totalHead, 2)} m / ${fmt((rho * 9.80665 * totalHead) / 100000, 3)} bar`],
            ["Хидравлична мощност", `${fmt(hydraulicPower / 1000, 3)} kW`],
            ["Ориентировъчна мощност на вала", `${fmt(shaftPower / 1000, 3)} kW`]
          ],
          formulas: [
            formulaBlock(
              "Общ напор",
              "H = H_friction + H_static + H_local + H_extra + H_safety",
              `H = ${fmt(hFriction, 2)} + ${fmt(staticHead, 2)} + ${fmt(hLocal, 2)} + ${fmt(hExtra, 2)} + ${fmt(hSafety, 2)} = ${fmt(totalHead, 2)} m`
            ),
            formulaBlock(
              "Darcy-Weisbach",
              "H_friction = λ(L/D)v²/(2g); H_local = Σζv²/(2g)",
              `λ=${fmt(lambda, 5)}; v=${fmt(velocity, 3)} m/s; Re=${fmt(re, 0)}`
            ),
            formulaBlock(
              "Мощност на помпата",
              "Pхидр = ρgQH; Pвал = Pхидр/η",
              `Pхидр = ${fmt(rho, 1)} · 9.80665 · ${fmt(q, 6)} · ${fmt(totalHead, 2)} = ${fmt(hydraulicPower / 1000, 3)} kW; Pвал = ${fmt(hydraulicPower / 1000, 3)} / ${fmt(efficiency, 2)} = ${fmt(shaftPower / 1000, 3)} kW`
            )
          ]
        });
      }

      if (document.getElementById("protocolRoutes")?.checked) {
        const flow = num("routeFlow", 0);
        const rho = num("routeRho", 998);
        const mu = num("routeMu", 1);
        renderRouteCalc({ markUserResult: routeHasUserResult });
        sections.push({
          title: "Тръбно трасе",
          rows: [
            ["Дебит / свойства", `${fmt(flow, 0)} L/h / ρ=${fmt(rho, 1)} kg/m³ / μ=${fmt(mu, 2)} mPa·s`],
            ["Сегменти / дължина", `${getRouteSegmentsState().length} / ${fmt(lastRoutePumpData?.length_m || 0, 2)} m`],
            ["Общо Σζ", `${fmt(lastRoutePumpData?.kTotal || 0, 2)}`],
            ["Общо Δp", `${fmt(lastRoutePumpData?.dp_bar || 0, 4)} bar`]
          ],
          formulas: [
            formulaBlock(
              "Сегментна методика",
              "Δp_seg = (λ·L/D + Σζ)·ρv²/2",
              "λ се смята итеративно по Colebrook-White за всеки сегмент; Δp_total = ΣΔp_seg."
            ),
            formulaBlock(
              "Общо трасе",
              "Δp_total = ΣΔp_seg",
              `Δp_total = ${fmt(lastRoutePumpData?.dp_bar || 0, 4)} bar`
            )
          ]
        });
      }

      return sections;
    }

    function updateProtocolPreview() {
      const box = document.getElementById("protocolPreview");
      if (!box) return;
      syncProtocolTitle();
      const sections = selectedProtocolSections();
      const title = document.getElementById("protocolTitle")?.value.trim() || "Протокол за изчисления";
      const date = document.getElementById("protocolDate")?.value || "няма зададена дата";
      const logoName = protocolLogoFile?.name || document.getElementById("protocolLogo")?.files?.[0]?.name || "няма избрано лого";
      const notes = document.getElementById("protocolNotes")?.value.trim();
      const authorTitle = document.getElementById("protocolAuthorTitle")?.value || "";
      const authorSalutation = document.getElementById("protocolAuthorSalutation")?.value || "";
      const authorName = document.getElementById("protocolAuthorName")?.value.trim();
      const authorLine = [authorTitle, authorSalutation, authorName].filter(Boolean).join(" ") || "няма зададен изготвил";
      const header = [
        `<div class="formula"><strong>${escapeHtml(title)}</strong></div>`,
        `<div class="formula">Дата: ${escapeHtml(date)} | Лого: ${escapeHtml(logoName)}</div>`,
        `<div class="formula">Изготвил: ${escapeHtml(authorLine)}</div>`,
        notes ? `<div class="formula">Забележки: ${escapeHtml(notes)}</div>` : ""
      ].join("");
      box.innerHTML = sections.length
        ? header + sections.map(section => `<div class="formula">${section.title}: ${section.rows.length} реда, ${section.formulas?.length || 0} формули</div>`).join("")
        : header + `<div class="formula">Няма избрана сметка за протокол.</div>`;
    }

    async function buildSelectedProtocol() {
      const sections = selectedProtocolSections();
      if (!sections.length) {
        alert("Избери поне една сметка за протокола.");
        return null;
      }
      const meta = await getProtocolMeta();
      return { ...meta, sections };
    }

    function protocolTableRows(section) {
      return section.rows.map(([k, v]) => [k, String(v ?? "")]);
    }

    async function exportSelectedWordProtocol(bundle, fileBase) {
      if (!window.docx) {
        alert("Липсва библиотека за Word експорт.");
        return;
      }
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ImageRun } = window.docx;
      const children = [];
      if (bundle.logoDataUrl) {
        const logoFit = fitImageSize(bundle.logoSize, 150, 80);
        children.push(new Paragraph({
          children: [
            new ImageRun({
              data: dataUrlToUint8Array(bundle.logoDataUrl),
              transformation: logoFit
            })
          ]
        }));
      }
      children.push(new Paragraph({ text: bundle.title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.LEFT }));
      if (bundle.date) children.push(new Paragraph({ text: `Дата: ${bundle.date}` }));
      children.push(new Paragraph({ text: "" }));
      bundle.sections.forEach((section, index) => {
        children.push(new Paragraph({ text: `${index + 1}) ${section.title}`, heading: HeadingLevel.HEADING_2 }));
        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: protocolTableRows(section).map(([k, v]) => new TableRow({ children: [
            new TableCell({ width: { size: 42, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: k, bold: true })] })] }),
            new TableCell({ width: { size: 58, type: WidthType.PERCENTAGE }, children: [new Paragraph(v)] })
          ]}))
        }));
        if (section.formulas?.length) {
          children.push(new Paragraph({ text: "Формули", heading: HeadingLevel.HEADING_3 }));
          section.formulas.slice(0, 18).forEach((item, idx) => {
            if (typeof item === "string") {
              children.push(new Paragraph({ text: `${idx + 1}. ${formulaPlainText(item)}` }));
              return;
            }
            children.push(new Paragraph({ children: [new TextRun({ text: `${idx + 1}. ${item.title}`, bold: true })] }));
            if (item.formula) children.push(new Paragraph({ text: `Формула: ${item.formula}` }));
            if (item.substituted) children.push(new Paragraph({ text: `Заместено: ${item.substituted}` }));
            if (item.result) children.push(new Paragraph({ text: `Резултат: ${item.result}` }));
            if (item.note) children.push(new Paragraph({ text: `Бележка: ${item.note}` }));
          });
        }
        children.push(new Paragraph({ text: "" }));
      });
      if (bundle.notes) {
        children.push(new Paragraph({ text: "Забележки и особени указания", heading: HeadingLevel.HEADING_2 }));
        bundle.notes.split(/\r?\n/).filter(Boolean).forEach(line => {
          children.push(new Paragraph({ text: line }));
        });
        children.push(new Paragraph({ text: "" }));
      }
      if (bundle.authorName) {
        const author = [bundle.authorTitle, bundle.authorSalutation, bundle.authorName].filter(Boolean).join(" ");
        children.push(new Paragraph({ text: "Изготвил проекта", heading: HeadingLevel.HEADING_2 }));
        children.push(new Paragraph({ text: author }));
        children.push(new Paragraph({ text: "" }));
        children.push(new Paragraph({ text: "Подпис: ______________________________" }));
      }
      const doc = new Document({ sections: [{ properties: {}, children }] });
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, `${fileBase}.docx`);
    }

    function exportSelectedPdfProtocol(bundle, fileBase) {
      if (!window.pdfMake) {
        alert("Липсва библиотека за PDF експорт.");
        return;
      }
      const content = [];
      if (bundle.logoDataUrl) {
        const logoFit = fitImageSize(bundle.logoSize, 150, 80);
        content.push({ image: bundle.logoDataUrl, width: logoFit.width, height: logoFit.height, margin: [0, 0, 0, 8] });
      }
      content.push({ text: bundle.title, style: "header" });
      if (bundle.date) content.push({ text: `Дата: ${bundle.date}`, style: "subheader" });
      bundle.sections.forEach((section, index) => {
        content.push({ text: `\n${index + 1}) ${section.title}`, style: "section" });
        content.push({
          table: {
            widths: ["42%", "58%"],
            body: [[{ text: "Параметър", style: "th" }, { text: "Стойност", style: "th" }]]
              .concat(protocolTableRows(section).map(([k, v]) => [{ text: k, style: "tdKey" }, { text: v, style: "td" }]))
          },
          layout: "lightHorizontalLines"
        });
        if (section.formulas?.length) {
          content.push({ text: "\nФормули", style: "section" });
          section.formulas.slice(0, 18).forEach((item, idx) => {
            if (typeof item === "string") {
              content.push({ text: `${idx + 1}. ${formulaPlainText(item)}`, fontSize: 8.5, margin: [0, 4, 0, 0] });
              return;
            }
            content.push({ text: `${idx + 1}. ${item.title}`, bold: true, fontSize: 9, margin: [0, 6, 0, 1] });
            if (item.formula) content.push({ text: `Формула: ${item.formula}`, fontSize: 8.5 });
            if (item.substituted) content.push({ text: `Заместено: ${item.substituted}`, fontSize: 8.5 });
            if (item.result) content.push({ text: `Резултат: ${item.result}`, fontSize: 8.5 });
            if (item.note) content.push({ text: `Бележка: ${item.note}`, fontSize: 8, color: "#4b5d76" });
          });
        }
      });
      if (bundle.notes) {
        content.push({ text: "\nЗабележки и особени указания", style: "section" });
        content.push({ text: bundle.notes, style: "td" });
      }
      if (bundle.authorName) {
        const author = [bundle.authorTitle, bundle.authorSalutation, bundle.authorName].filter(Boolean).join(" ");
        content.push({ text: "\nИзготвил проекта", style: "section" });
        content.push({ text: author, style: "td" });
        content.push({ text: "Подпис: ______________________________", margin: [0, 16, 0, 0] });
      }
      window.pdfMake.createPdf({
        pageSize: "A4",
        pageMargins: [28, 28, 28, 28],
        content,
        defaultStyle: { font: "Roboto", fontSize: 9, color: "#122033" },
        styles: {
          header: { fontSize: 14, bold: true, color: "#0f172a" },
          subheader: { fontSize: 9, color: "#4b5d76" },
          section: { fontSize: 11, bold: true, color: "#153b73" },
          th: { bold: true, fillColor: "#eaf1ff", color: "#153b73" },
          tdKey: { bold: true },
          td: {},
          foot: { fontSize: 8, color: "#4b5d76" }
        }
      }).download(`${fileBase}.pdf`);
    }

    async function exportProtocol(format) {
      updateProtocolPreview();
      const bundle = await buildSelectedProtocol();
      if (!bundle) return;
      const fileDate = bundle.date || new Date().toISOString().slice(0, 10);
      const fileBase = `protokol_izchislenia_${fileDate}`;

      if (format === "word") {
        await exportSelectedWordProtocol(bundle, fileBase);
        return;
      }
      exportSelectedPdfProtocol(bundle, fileBase);
    }

    async function exportOldProtocol(format) {
      if (!lastProtocolData) {
        alert("Няма изчислени данни. Натисни 'Изчисли' преди генериране на протокол.");
        return;
      }

      const fileBase = `protokol_trubna_zadrujka_${new Date().toISOString().slice(0, 10)}`;

      if (format === "word") {
        await exportWordProtocol(lastProtocolData, fileBase);
        return;
      }
      exportPdfProtocol(lastProtocolData, fileBase);
    }

    function calc() {
      saveFormState();

      const q_l_h = parseFloat(document.getElementById("flow").value);
      const q = q_l_h / 1000 / 3600;
      const q_l_s = q_l_h / 3600;
      const t = parseFloat(document.getElementById("retention").value);
      const rho = parseFloat(rhoInput.value);
      const mu_mpa_s = parseFloat(muInput.value);
      const mu = mu_mpa_s / 1000;
      const roughness_mm = parseFloat(document.getElementById("roughness").value);
      const eps = roughness_mm / 1000;
      const segment = parseFloat(document.getElementById("straightSeg").value);
      const lossMethod = document.getElementById("lossMethod").value;
      const kElbow = libraryOrManual("manualElbowData", "kElbow", elbowLibrary, elbowTypeSelect, "k");
      const leqElbowLD = libraryOrManual("manualElbowData", "leqElbowLD", elbowLibrary, elbowTypeSelect, "lOverD");
      const elbowRadiusD = libraryOrManual("manualElbowData", "elbowRadiusD", elbowLibrary, elbowTypeSelect, "radiusD");
      const selectedElbow = elbowLibrary[elbowTypeSelect.value];
      const elbowRadiusMmByDn = manualChecked("manualElbowData") ? null : selectedElbow?.radiusMmByDn || null;
      const inletOutletExtensionM = parseFloat(document.getElementById("inletOutletExtension").value) || 0;
      const inletOutletExtensionMm = inletOutletExtensionM * 1000;
      const includeIO = false;
      const use11852 = false;
      const count11852 = 0;
      const k11852 = 0;
      const lib11852 = "";
      const use11851 = false;
      const count11851 = 0;
      const k11851 = 0;
      const lib11851 = "";
      const use32676 = false;
      const count32676 = 0;
      const k32676 = 0;
      const lib32676 = "";
      const cipMin = parseFloat(document.getElementById("cipMin").value);
      const cipMax = parseFloat(document.getElementById("cipMax").value);
      const targetSpeed = parseFloat(document.getElementById("targetSpeed").value);

      updateInputBoundaryColors({ roughness_mm, kElbow, leqElbowLD, elbowRadiusD, cipMin, cipMax, targetSpeed, k11852, k11851, k32676 });

      if (cipMin >= cipMax) {
        alert("CIP минимална скорост трябва да е по-малка от максималната.");
        return;
      }

      if (targetSpeed <= 0) {
        alert("Търсената скорост трябва да е положителна.");
        return;
      }

      const inputs = {
        q, t, rho, mu, eps, segment, lossMethod, kElbow, leqElbowLD, elbowRadiusD, elbowRadiusMmByDn, inletOutletExtensionM, includeIO,
        use11852, count11852, k11852,
        use11851, count11851, k11851,
        use32676, count32676, k32676
      };

      const selectedSeries = pipeSeries[pipeStandardSelect.value];
      const selectedIdx = parseInt(pipeSizeSelect.value, 10);
      const p = selectedSeries[selectedIdx];
      const main = calculateForPipe(p, inputs);
      if (!main) {
        alert("Невалиден вътрешен диаметър. Провери OD и дебелината.");
        return;
      }

      const profileIndexes = [selectedIdx - 2, selectedIdx - 1, selectedIdx, selectedIdx + 1, selectedIdx + 2]
        .filter(i => i >= 0 && i < selectedSeries.length);
      const profiles = profileIndexes.map(i => calculateForPipe(selectedSeries[i], inputs)).filter(Boolean);
      const allProfiles = selectedSeries.map(pipe => calculateForPipe(pipe, inputs)).filter(Boolean);
      const recommendation = recommendPipe(allProfiles, targetSpeed, cipMin, cipMax);
      const workPump = pumpEstimate(q, main.dpTotal, rho);
      lastHoldUpCipData = {
        q_l_h,
        d_mm: main.d_mm,
        length_m: main.length,
        volume_l: main.volume_l,
        dp_bar: main.dpTotalBar,
        kTotal: main.kTotal,
        rho,
        mu,
        roughness_mm,
        source: `${p.dn} | ${fmt(main.d_mm, 1)} mm ID`
      };
      syncCipLinkedInputs();

      renderMetrics({
        q,
        q_l_h,
        q_l_s,
        rho,
        area: main.area,
        volume: main.volume,
        volume_l: main.volume_l,
        volumePerMeter_l_m: main.volumePerMeter_l_m,
        retention_s_l: main.retention_s_l,
        length: main.length,
        sectorCount: main.sectorCount,
        sectorLength: main.sectorLength,
        nStraights: main.nStraights,
        elbowArcLength: main.elbowArcLength,
        inletOutletExtensionM: main.inletOutletExtensionM,
        inletOutletLengthM: main.inletOutletLengthM,
        totalElbowArcLength: main.totalElbowArcLength,
        straightLengthTotal: main.straightLengthTotal,
        maxStraightLength: main.maxStraightLength,
        bendRadiusM: main.bendRadiusM,
        elbowRadiusD: main.elbowRadiusD,
        elbowRadiusIsTabular: main.elbowRadiusIsTabular,
        coilPitchM: main.coilPitchM,
        overallWidthM: main.overallWidthM,
        overallHeightM: main.overallHeightM,
        sideDepthM: main.sideDepthM,
        elbows90: main.elbows90,
        serpentineElbows90: main.serpentineElbows90,
        inletOutletElbows90: main.inletOutletElbows90,
        kTotal: main.kTotal,
        kExtras: main.kExtras,
        method: lossMethod,
        velocity: main.velocity,
        dyn: main.dyn,
        re: main.re,
        f: main.f,
        dpLinear: main.dpLinear,
        dpElbows: main.dpElbows,
        dpIO: main.dpIO,
        dpExtras: main.dpExtras,
        dpLocal: main.dpLocal,
        dpTotal: main.dpTotal,
        dpTotalBar: main.dpTotalBar,
        d_mm: main.d_mm,
        d: main.d,
        segment,
        cipMin,
        cipMax,
        cipStatus: cipStatus(main.velocity, cipMin, cipMax),
        cipTone: velocityTone(main.velocity),
        kTone: rangeTone(kElbow, 0.1, 2.0),
        epsTone: rangeTone(roughness_mm, 0.0005, 0.1),
        leqTone: rangeTone(leqElbowLD, 5, 120),
        extrasTone: rangeTone(main.kExtras, 0, 20)
      });

      renderProfiles(profiles, cipMin, cipMax);
      drawSpeedChart(profiles, cipMin, cipMax);
      renderCoilDrawing(main);
      renderRecommendation(recommendation, targetSpeed, cipMin, cipMax);

      renderFormulas({
        q_l_h, q_l_s, q, t, rho, mu_mpa_s, mu,
        d_mm: main.d_mm,
        d: main.d,
        area: main.area,
        velocity: main.velocity,
        volume: main.volume,
        volume_l: main.volume_l,
        volumePerMeter_l_m: main.volumePerMeter_l_m,
        retention_s_l: main.retention_s_l,
        length: main.length,
        re: main.re,
        f: main.f,
        lossMethod,
        segment,
        leqElbowLD,
        elbowRadiusD: main.elbowRadiusD,
        inletOutletExtensionM,
        inletOutletLengthM: main.inletOutletLengthM,
        kElbow,
        elbows90: main.elbows90,
        serpentineElbows90: main.serpentineElbows90,
        inletOutletElbows90: main.inletOutletElbows90,
        sectorCount: main.sectorCount,
        sectorLength: main.sectorLength,
        nStraights: main.nStraights,
        elbowArcLength: main.elbowArcLength,
        totalElbowArcLength: main.totalElbowArcLength,
        straightLengthTotal: main.straightLengthTotal,
        kElbowsOnly: main.kElbowsOnly,
        kIO: main.kIO,
        k11852,
        count11852,
        use11852,
        k11851,
        count11851,
        use11851,
        k32676,
        count32676,
        use32676,
        k11852Total: main.k11852,
        k11851Total: main.k11851,
        k32676Total: main.k32676,
        kExtras: main.kExtras,
        kTotal: main.kTotal,
        leqElbows: main.leqElbows,
        leqIO: main.leqIO,
        leqExtras: main.leqExtras,
        lHydraulicTotal: main.lHydraulicTotal,
        dyn: main.dyn,
        dpLinear: main.dpLinear,
        dpElbows: main.dpElbows,
        dpIO: main.dpIO,
        dpExtras: main.dpExtras,
        dpLocal: main.dpLocal,
        dpTotal: main.dpTotal,
        dpTotalBar: main.dpTotalBar,
        eps,
        roughness_mm,
        includeIO,
        od: p.od,
        wall: p.t,
        cipMin,
        cipMax,
        cipStatus: cipStatus(main.velocity, cipMin, cipMax)
      });

      saveSessionData({
        inputs: {
          fluid: fluidSelect.value,
          q_l_h,
          t,
          rho,
          mu_mpa_s,
          roughness_mm,
          segment,
          lossMethod,
          kElbow,
          leqElbowLD,
          elbowRadiusD,
          effectiveElbowRadiusD: main.elbowRadiusD,
          elbowRadius_mm: main.elbowRadiusMm,
          elbowRadiusIsTabular: main.elbowRadiusIsTabular,
          inletOutletExtensionMm,
          inletOutletLength_m: main.inletOutletLengthM,
          manualElbowData: manualChecked("manualElbowData"),
          elbowType: elbowTypeSelect.value,
          elbowSource: elbowLibrary[elbowTypeSelect.value]?.source || "",
          includeIO,
          use11852,
          lib11852,
          manual11852: manualChecked("manual11852"),
          count11852,
          k11852,
          use11851,
          lib11851,
          manual11851: manualChecked("manual11851"),
          count11851,
          k11851,
          use32676,
          lib32676,
          manual32676: manualChecked("manual32676"),
          count32676,
          k32676,
          cipMin,
          cipMax,
          targetSpeed,
          pipeStandard: pipeStandardSelect.value,
          pipeSizeIndex: selectedIdx,
          selectedDN: p.dn,
          od_mm: p.od,
          wall_mm: p.t
        },
        results: {
          q_l_s,
          q_m3_s: q,
          id_mm: main.d_mm,
          area_m2: main.area,
          volume_m3: main.volume,
          volume_l: main.volume_l,
          volumePerMeter_l_m: main.volumePerMeter_l_m,
          retention_s_l: main.retention_s_l,
          length_m: main.length,
          sectorCount: main.sectorCount,
          sectorLength_m: main.sectorLength,
          nStraights: main.nStraights,
          elbowArcLength_m: main.elbowArcLength,
          inletOutletExtension_m: main.inletOutletExtensionM,
          inletOutletLength_m: main.inletOutletLengthM,
          totalElbowArcLength_m: main.totalElbowArcLength,
          straightLengthTotal_m: main.straightLengthTotal,
          velocity_m_s: main.velocity,
          re: main.re,
          f: main.f,
          elbows90: main.elbows90,
          serpentineElbows90: main.serpentineElbows90,
          inletOutletElbows90: main.inletOutletElbows90,
          kElbowsOnly: main.kElbowsOnly,
          kIO: main.kIO,
          k11852: main.k11852,
          k11851: main.k11851,
          k32676: main.k32676,
          kExtras: main.kExtras,
          kTotal: main.kTotal,
          leqElbows_m: main.leqElbows,
          leqIO_m: main.leqIO,
          leqExtras_m: main.leqExtras,
          lHydraulicTotal_m: main.lHydraulicTotal,
          dpLinear_pa: main.dpLinear,
          dpElbows_pa: main.dpElbows,
          dpIO_pa: main.dpIO,
          dpExtras_pa: main.dpExtras,
          dpLocal_pa: main.dpLocal,
          dpTotal_pa: main.dpTotal,
          dpTotal_bar: main.dpTotalBar,
          recommendationDN: recommendation?.pick?.pipe?.dn || "",
          recommendationID_mm: recommendation?.pick?.d_mm || 0,
          recommendationVelocity_m_s: recommendation?.pick?.velocity || 0,
          recommendationDp_bar: recommendation?.pick?.dpTotalBar || 0,
          recommendationMode: recommendation?.mode || "",
          workPumpFlow_m3_h: q_l_h / 1000,
          workPumpHead_m: workPump.head,
          workPumpPower_kW: workPump.shaftPower / 1000,
          workPumpReserve_percent: workPump.reserve * 100,
          workPumpEfficiency_percent: workPump.efficiency * 100
        }
      });

      lastProtocolData = {
        date: new Date().toLocaleString("bg-BG"),
        fluid: fluidSelect.value,
        q_l_h,
        q_l_s,
        q_m3_s: q,
        t,
        pipeStandard: pipeStandardSelect.value,
        selectedDN: p.dn,
        od_mm: p.od,
        wall_mm: p.t,
        id_mm: main.d_mm,
        area_m2: main.area,
        rho,
        mu_mpa_s,
        roughness_mm,
        cipMin,
        cipMax,
        elbowType: elbowTypeSelect.value,
        kElbow,
        leqElbowLD,
        elbowRadiusD: main.elbowRadiusD,
        elbowRadius_mm: main.elbowRadiusMm,
        elbowRadiusIsTabular: main.elbowRadiusIsTabular,
        inletOutletExtensionMm,
        inletOutletLength_m: main.inletOutletLengthM,
        manualElbowData: manualChecked("manualElbowData"),
        lossMethod: lossMethod === "leq" ? "Leq (еквивалентна дължина)" : "ζ (локални коефициенти)",
        volume_l: main.volume_l,
        volumePerMeter_l_m: main.volumePerMeter_l_m,
        retention_s_l: main.retention_s_l,
        length_m: main.length,
        sectorCount: main.sectorCount,
        sectorLength_m: main.sectorLength,
        nStraights: main.nStraights,
        elbowArcLength_m: main.elbowArcLength,
        inletOutletExtension_m: main.inletOutletExtensionM,
        inletOutletLength_m: main.inletOutletLengthM,
        totalElbowArcLength_m: main.totalElbowArcLength,
        straightLengthTotal_m: main.straightLengthTotal,
        elbows90: main.elbows90,
        serpentineElbows90: main.serpentineElbows90,
        inletOutletElbows90: main.inletOutletElbows90,
        velocity_m_s: main.velocity,
        dynamicPa: main.dyn,
        re: main.re,
        f: main.f,
        kTotal: main.kTotal,
        kElbowsOnly: main.kElbowsOnly,
        kIO: main.kIO,
        k11852: main.k11852,
        k11851: main.k11851,
        k32676: main.k32676,
        kExtras: main.kExtras,
        leqElbows_m: main.leqElbows,
        leqIO_m: main.leqIO,
        leqExtras_m: main.leqExtras,
        volume_m3: main.volume,
        lHydraulicTotal_m: main.lHydraulicTotal,
        includeIO,
        use11852,
        lib11852,
        manual11852: manualChecked("manual11852"),
        count11852,
        k11852Single: k11852,
        use11851,
        lib11851,
        manual11851: manualChecked("manual11851"),
        count11851,
        k11851Single: k11851,
        use32676,
        lib32676,
        manual32676: manualChecked("manual32676"),
        count32676,
        k32676Single: k32676,
        dpLinear_kpa: main.dpLinear / 1000,
        dpElbows_kpa: main.dpElbows / 1000,
        dpIO_kpa: main.dpIO / 1000,
        dpExtras_kpa: main.dpExtras / 1000,
        dpLocal_kpa: main.dpLocal / 1000,
        dpTotal_pa: main.dpTotal,
        dpTotal_kpa: main.dpTotal / 1000,
        dpTotal_bar: main.dpTotalBar,
        recDN: recommendation?.pick?.pipe?.dn || "-",
        recV: recommendation?.pick?.velocity || 0,
        recDp: recommendation?.pick?.dpTotalBar || 0,
        workPumpFlow_m3_h: q_l_h / 1000,
        workPumpHead_m: workPump.head,
        workPumpPower_kW: workPump.shaftPower / 1000,
        workPumpReserve_percent: workPump.reserve * 100,
        workPumpEfficiency_percent: workPump.efficiency * 100,
        chartDataUrl: document.getElementById("speedChart")?.toDataURL("image/png") || "",
        formulas: [...lastFormulaLines],
        profiles: profiles.map(pr => ({
          dn: pr.pipe.dn,
          id_mm: pr.d_mm,
          velocity: pr.velocity,
          dpBar: pr.dpTotalBar,
          length: pr.length,
          cip: cipStatus(pr.velocity, cipMin, cipMax)
        }))
      };
      renderCipCalc();
      if ((currentPumpMode === "process" && isPumpLinked("process")) || (currentPumpMode === "cip" && isPumpLinked("cip"))) {
        renderPumpCalc();
      }
      syncProtocolTitle();
      updateProtocolPreview();
    }

    function metric(k, v, cls = "", tone = "") {
      return `<div class="metric ${cls} ${tone}"><div class="k">${k}</div><div class="v">${v}</div></div>`;
    }

    function pumpEstimate(q, dpPa, rho, reserve = 0.15, efficiency = 0.55, staticHead = 0) {
      const headFromPressure = dpPa / (rho * 9.80665);
      const head = (headFromPressure + staticHead) * (1 + reserve);
      const hydraulicPower = rho * 9.80665 * q * head;
      const shaftPower = hydraulicPower / Math.max(efficiency, 0.01);
      return { headFromPressure, head, hydraulicPower, shaftPower, reserve, efficiency };
    }

    function renderMetrics(r) {
      const primary = document.getElementById("primaryMetrics");
      const secondary = document.getElementById("secondaryMetrics");
      const details = document.getElementById("detailMetrics");
      const cipCheckPanel = document.getElementById("cipCheckPanel");
      const workPump = pumpEstimate(r.q, r.dpTotal, r.rho);

      primary.innerHTML = [
        metric("Дебит на продукта Q [L/s]", fmt(r.q_l_s, 3)),
        metric("Общ обем на серпентината V [L]", fmt(r.volume_l, 2)),
        metric("Обем на тръбната задръжка V₁m [L/m]", fmt(r.volumePerMeter_l_m, 3)),
        metric("Обща дължина на тръбната задръжка L [m]", fmt(r.length, 2))
      ].join("");

      secondary.innerHTML = [
        metric("Брой колена 90° n общо", r.elbows90.toString(), "small"),
        metric("Дължина на 1 коляно Lколяно [m]", fmt(r.elbowArcLength, 3), "small"),
        metric("Дължина прав участък Lправа [m]", fmt(r.segment, 3), "small"),
        metric("Дължина на сектор Lсектор [m]", fmt(r.sectorLength, 3), "small"),
        metric("Брой сектори nсектори [-]", r.sectorCount.toString(), "small"),
        metric("Дължина начален-краен сектор Lвх/изх [m]", fmt(r.inletOutletLengthM, 3), "small"),
        metric("Съпротивление в задръжката Δp [bar]", fmt(r.dpTotalBar, 4), "small", pressureTone(r.dpTotalBar)),
        metric("Скорост на потока v [m/s]", fmt(r.velocity, 3), "small", velocityTone(r.velocity))
      ].join("");

      if (cipCheckPanel) cipCheckPanel.innerHTML = "";

      details.innerHTML = [
        metric("Дебит Q [L/s]", fmt(r.q_l_s, 3), "small"),
        metric("Обем V [m³]", fmt(r.volume, 6), "small"),
        metric("Задръжка t/V [s/L]", fmt(r.retention_s_l, 3), "small"),
        metric("Светъл отвор Dᵢ / ID [mm]", fmt(r.d_mm, 1), "small"),
        metric("Площ на сечение A [m²]", fmtPrecise(r.area, 6), "small"),
        metric("Метод", r.method === "leq" ? "Leq" : "ζ", "small"),
        metric("Дължина на 1 коляно Lколяно [m]", fmt(r.elbowArcLength, 3), "small"),
        metric("Разбивка колена n", `вътрешни ${r.serpentineElbows90} + вход/изход ${r.inletOutletElbows90}`, "small"),
        metric("Радиус на коляно R", `${fmt(r.bendRadiusM * 1000, 1)} mm / R/D=${fmt(r.elbowRadiusD, 2)}${r.elbowRadiusIsTabular ? " табл." : ""}`, "small"),
        metric("Удължение вход/изход Lудълж. [m]", fmt(r.inletOutletExtensionM, 3), "small"),
        metric("Общо дължина в колена ΣLколена [m]", fmt(r.totalElbowArcLength, 3), "small"),
        metric("Права дължина общо Lправи [m]", fmt(r.straightLengthTotal, 3), "small"),
        metric("Габарит ширина B [mm]", fmt(r.overallWidthM * 1000, 0), "small"),
        metric("Габарит височина H [mm]", fmt(r.overallHeightM * 1000, 0), "small"),
        metric("Дълбочина U [mm]", fmt(r.sideDepthM * 1000, 0), "small"),
        metric("Re [-]", fmt(r.re, 0), "small"),
        metric("λ / f [-]", fmt(r.f, 4), "small"),
        metric("Динамично налягане ρv²/2 [Pa]", fmt(r.dyn, 2), "small"),
        metric("Общо съпротивление ΣK [-]", fmt(r.kTotal, 2), "small", r.kTone),
        metric("Δp линейни [kPa]", fmt(r.dpLinear / 1000, 2), "small"),
        metric("Δp колена [kPa]", fmt(r.dpElbows / 1000, 2), "small"),
        metric("Δp вход/изход [kPa]", fmt(r.dpIO / 1000, 2), "small"),
        metric("Δp допълнителни [kPa]", fmt(r.dpExtras / 1000, 2), "small"),
        metric("Δp локални [kPa]", fmt(r.dpLocal / 1000, 2), "small"),
        metric("Δp общ [kPa]", fmt(r.dpTotal / 1000, 2), "small"),
        metric("Δp общ [bar]", fmt(r.dpTotalBar, 4), "small", pressureTone(r.dpTotalBar)),
        metric("Работна помпа дебит Q [m³/h]", fmt(r.q_l_h / 1000, 3), "small"),
        metric("Работна помпа напор H [m]", fmt(workPump.head, 2), "small"),
        metric("Работна помпа мощност P [kW]", fmt(workPump.shaftPower / 1000, 3), "small"),
        metric("Работна помпа резерв", `${fmt(workPump.reserve * 100, 0)} %`, "small"),
        metric("Работна помпа КПД", `${fmt(workPump.efficiency * 100, 0)} %`, "small"),
        metric("ε диапазон", r.epsTone === "ok" ? "В диапазон" : r.epsTone === "warn" ? "Близо до граница" : "Извън диапазон", "small", r.epsTone),
        metric("(L/D) диапазон", r.leqTone === "ok" ? "В диапазон" : r.leqTone === "warn" ? "Близо до граница" : "Извън диапазон", "small", r.leqTone)
      ].join("");
    }

    function formulaLine(text) {
      return `<div class="formula">${text}</div>`;
    }

    function renderFormulas(x) {
      const f = document.getElementById("formulas");
      const lossBlock = x.lossMethod === "leq"
        ? `12) Метод Leq (еквивалентна дължина):\nLeq(колена) = nколена·(L/D)коляно·D = ${x.elbows90}·${fmt(x.leqElbowLD, 1)}·${fmt(x.d, 4)} = ${fmt(x.leqElbows, 3)} m\nLхидр = L + Leq(колена) = ${fmt(x.length, 3)} + ${fmt(x.leqElbows, 3)} = ${fmt(x.lHydraulicTotal, 3)} m\nΔp = f·(Lхидр/D)·ρv²/2 = ${fmt(x.dpTotal, 2)} Pa`
        : `12) Метод ζ (локални коефициенти):\nΣK = nколена·Kколяно\nΣK = ${x.elbows90}·${fmt(x.kElbow, 2)} = ${fmt(x.kTotal, 3)}\nΔpлок = ΣK·ρv²/2 = ${fmt(x.kTotal, 3)}·${fmt(x.dyn, 3)} = ${fmt(x.dpLocal, 2)} Pa`;

      const lines = [
        formulaLine(`1) Преобразуване на дебит:\nQ = ${fmt(x.q_l_h, 1)} L/h = ${fmt(x.q_l_s, 4)} L/s = ${fmt(x.q_l_h / 1000, 4)} m³/h = ${fmt(x.q, 6)} m³/s`),
        formulaLine(`2) Вътрешен диаметър (от избраната тръба):\nDᵢ = OD - 2·s = ${fmt(x.od, 1)} - 2·${fmt(x.wall, 1)} = ${fmt(x.d_mm, 1)} mm = ${fmt(x.d, 4)} m`),
        formulaLine(`3) Площ на сечение:\nA = π·D²/4 = π·(${fmt(x.d, 4)})²/4 = ${fmt(x.area, 6)} m²`),
        formulaLine(`4) Необходим обем за задръжка:\nV = Q·t = ${fmt(x.q, 6)}·${fmt(x.t, 1)} = ${fmt(x.volume, 6)} m³`),
        formulaLine(`5) Обем на тръбата за 1 метър:\nV₁m = A·1m = ${fmt(x.area, 6)} m³/m = ${fmt(x.volumePerMeter_l_m, 3)} L/m`),
        formulaLine(`6) Обща дължина на тръбната задръжка:\nL = V/A = ${fmt(x.volume, 6)} / ${fmt(x.area, 6)} = ${fmt(x.length, 3)} m`),
        formulaLine(`7) Геометрия на серпентината и брой колена:\nLколяно = π/2·R/D·D = π/2·${fmt(x.elbowRadiusD, 2)}·${fmt(x.d, 4)} = ${fmt(x.elbowArcLength, 4)} m\nИзбрани прави секции = ${x.nStraights}; вътрешни колена = 2·(${x.nStraights} - 1) = ${x.serpentineElbows90}; вход/изход колена = ${x.inletOutletElbows90}; общо колена 90° = ${x.elbows90}; сектори = ${x.sectorCount}\nLправи = Lобщо - Lколена = ${fmt(x.length, 3)} - ${fmt(x.totalElbowArcLength, 3)} = ${fmt(x.straightLengthTotal, 3)} m\nLвход/изход = Lправа секция + Lколяно + Lудължение = ${fmt(x.segment, 3)} + ${fmt(x.elbowArcLength, 3)} + ${fmt(x.inletOutletExtensionM, 3)} = ${fmt(x.inletOutletLengthM, 3)} m`),
        formulaLine(`8) Уделна задръжка:\nt/V = ${fmt(x.t, 2)} / ${fmt(x.volume_l, 3)} = ${fmt(x.retention_s_l, 3)} s/L`),
        formulaLine(`9) Скорост:\nv = Q/A = ${fmt(x.q, 6)} / ${fmt(x.area, 6)} = ${fmt(x.velocity, 4)} m/s`),
        formulaLine(`10) Reynolds:\nRe = ρ·v·D/μ = ${fmt(x.rho, 1)}·${fmt(x.velocity, 4)}·${fmt(x.d, 4)} / ${fmt(x.mu, 6)} = ${fmt(x.re, 0)}`),
        formulaLine(`11) Коефициент на триене f:\nRe < 2300: f = 64/Re; Re > 4000: Swamee-Jain; 2300–4000: линейна интерполация\nε = ${fmt(x.roughness_mm, 4)} mm = ${fmt(x.eps, 6)} m; f = ${fmt(x.f, 5)}\nВъведен диапазон за ε: min 0.0005 mm / max 0.1000 mm`),
        formulaLine(`${lossBlock}\nВъведен диапазон за K(90°): min 0.10 / max 2.00; (L/D)коляно: min 5 / max 120`),
        formulaLine(`13) Динамично налягане:\nρv²/2 = ${fmt(x.rho, 1)}·(${fmt(x.velocity, 4)})²/2 = ${fmt(x.dyn, 3)} Pa`),
        formulaLine(`14) Пад по дължина:\nΔpₗ = f·(L/D)·ρv²/2 = ${fmt(x.f, 5)}·(${fmt(x.length, 3)}/${fmt(x.d, 4)})·${fmt(x.dyn, 3)} = ${fmt(x.dpLinear, 2)} Pa`),
        formulaLine(`15) Локален пад (детайл):\nΔpколена = ${fmt(x.dpElbows, 2)} Pa; Δpлок = ${fmt(x.dpLocal, 2)} Pa`),
        formulaLine(`16) Общ пад на налягане:\nΔp = Δpₗ + Δpₗₒc = ${fmt(x.dpLinear, 2)} + ${fmt(x.dpLocal, 2)} = ${fmt(x.dpTotal, 2)} Pa (${fmt(x.dpTotal / 1000, 2)} kPa)`),
        formulaLine(`17) Преобразуване за избор на помпа:\nΔp [bar] = Δp [Pa] / 100000 = ${fmt(x.dpTotal, 2)} / 100000 = ${fmt(x.dpTotalBar, 4)} bar`)
      ];
      lastFormulaLines = lines.map(item => item.replace(/<div class="formula">|<\/div>/g, ""));
      f.innerHTML = lines.join("");
    }

    function num(id, fallback = 0) {
      const value = parseFloat(document.getElementById(id)?.value);
      return Number.isFinite(value) ? value : fallback;
    }

    function genericHydraulic(flowLh, diameterMm, lengthM, totalK, rho, muMpaS, roughnessMm) {
      const q = flowLh / 1000 / 3600;
      const d = diameterMm / 1000;
      const area = Math.PI * Math.pow(d, 2) / 4;
      const velocity = q / area;
      const mu = muMpaS / 1000;
      const eps = roughnessMm / 1000;
      const re = (rho * velocity * d) / mu;
      const f = frictionFactor(re, eps, d);
      const dyn = rho * Math.pow(velocity, 2) / 2;
      const dpLinear = f * (lengthM / d) * dyn;
      const dpLocal = totalK * dyn;
      const dpTotal = dpLinear + dpLocal;
      return { q, d, area, velocity, re, f, dyn, dpLinear, dpLocal, dpTotal, dpBar: dpTotal / 100000 };
    }

    function renderCipCalc() {
      if (isCipLinked()) syncCipLinkedInputs();

      const dMm = num("cipDiameter", 1);
      const length = num("cipRouteLength", 0);
      const volumeL = num("cipVolume", 0);
      const minV = num("cipMin", 1.5);
      const maxV = num("cipMax", V_GREEN_MAX);
      const temp = num("cipTemp", 65);
      const cycles = Math.max(1, Math.round(num("cipCycles", 1)));
      const props = cipFluidProperties(temp);
      const d = dMm / 1000;
      const area = Math.PI * Math.pow(d, 2) / 4;
      const eps = ((lastHoldUpCipData?.roughness_mm ?? num("roughness", 0.0015)) || 0.0015) / 1000;
      const totalK = lastHoldUpCipData?.kTotal || 0;
      const re = (props.rho * minV * d) / props.mu;
      const lambda = colebrookWhite(re, eps, d);
      const dyn = props.rho * Math.pow(minV, 2) / 2;
      const dpFriction = lambda * (length / d) * dyn;
      const dpLocal = totalK * dyn;
      const dpTotal = dpFriction + dpLocal;
      const qMinLh = minV * area * 3600 * 1000;
      const qMinLs = qMinLh / 3600;
      const flushTime = qMinLs > 0 ? volumeL / qMinLs : 0;
      const totalFlushTime = flushTime * cycles;
      const verdict = cipVerdict(minV, re);
      lastCipPumpData = {
        q_l_h: qMinLh,
        d_mm: dMm,
        length_m: length,
        volume_l: volumeL,
        dp_bar: dpTotal / 100000,
        kTotal: totalK,
        rho: props.rho,
        mu: props.mu,
        roughness_mm: eps * 1000,
        re,
        minVelocity: minV,
        verdict: verdict.label
      };
      applyRangeClass(document.getElementById("cipMin"), velocityTone(minV));
      applyRangeClass(document.getElementById("cipMax"), velocityTone(maxV));

      document.getElementById("cipMetrics").innerHTML = [
        metric("CIP статус", verdict.label, "", verdict.tone),
        metric("CIP min v_min [m/s]", fmt(minV, 3), "small", velocityTone(minV)),
        metric("CIP max v_max [m/s]", fmt(maxV, 3), "small", velocityTone(maxV)),
        metric("Минимален дебит за CIP Q_CIP,min [L/h]", fmt(qMinLh, 0), "small", velocityTone(minV)),
        metric("Re_CIP [-]", fmt(re, 0), "small", cipRegimeTone(re)),
        metric("Режим", cipRegimeText(re), "small", cipRegimeTone(re)),
        metric("λ Colebrook [-]", fmt(lambda, 5), "small"),
        metric("Δp триене [bar]", fmt(dpFriction / 100000, 4), "small", pressureTone(dpFriction / 100000)),
        metric("Δp локални [bar]", fmt(dpLocal / 100000, 4), "small", pressureTone(dpLocal / 100000)),
        metric("Δp общо [bar]", fmt(dpTotal / 100000, 4), "small", pressureTone(dpTotal / 100000)),
        metric("t за 1 обем t₁ [s]", fmt(flushTime, 1), "small"),
        metric("t общо цикли tобщо [s]", fmt(totalFlushTime, 1), "small"),
        metric("ρ / μ", `${fmt(props.rho, 1)} kg/m³ / ${fmt(props.mu, 6)} Pa·s`, "small")
      ].join("");

      document.getElementById("cipNote").textContent =
        `CIP режим: ${isCipLinked() ? "свързан със задръжката" : "самостоятелен"}. Свойствата са линейно интерполирани между 65°C и 80°C. Локалните загуби ползват Σζ=${fmt(totalK, 2)} от текущата конфигурация на задръжката.`;
      if (currentPumpMode === "cip" && isPumpLinked("cip")) renderPumpCalc();
    }

    const PUMP_CONTROL_IDS = [
      "pumpFlow", "pumpDiameter", "pumpLength", "pumpSourceDp", "pumpRho", "pumpMu",
      "pumpRoughness", "pumpTotalK", "pumpStaticHead", "pumpExtraHead",
      "pumpBackPressure", "pumpEfficiency"
    ];

    function pumpStateKey(mode) {
      return `${PUMP_STATE_KEY_PREFIX}:${mode}`;
    }

    function pumpLinkKey(mode) {
      return `${PUMP_LINK_KEY_PREFIX}:${mode}`;
    }

    function pumpLinkMode(mode = currentPumpMode) {
      if (mode === "test") return "standalone";
      const stored = localStorage.getItem(pumpLinkKey(mode));
      if (stored === "route") return "linked";
      return stored || "linked";
    }

    function isPumpLinked(mode = currentPumpMode) {
      if (mode === "test") return false;
      return pumpLinkMode(mode) !== "standalone";
    }

    function savePumpModeState(mode = currentPumpMode) {
      const state = {};
      PUMP_CONTROL_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) state[id] = el.value;
      });
      localStorage.setItem(pumpStateKey(mode), JSON.stringify(state));
    }

    function loadPumpModeState(mode = currentPumpMode) {
      const raw = localStorage.getItem(pumpStateKey(mode));
      if (!raw) return;
      try {
        const state = JSON.parse(raw);
        PUMP_CONTROL_IDS.forEach(id => setControlValue(id, state[id]));
      } catch (_err) {
      }
    }

    function currentPumpLinkedSource() {
      if (currentPumpMode === "process") {
        const source = lastHoldUpCipData;
        return source ? {
          flowLh: source.q_l_h,
          dMm: source.d_mm,
          lengthM: source.length_m,
          dpBar: source.dp_bar,
          rho: source.rho,
          mu: source.mu,
          roughnessMm: source.roughness_mm,
          totalK: source.kTotal
        } : null;
      }
      if (currentPumpMode === "cip") {
        return lastCipPumpData ? {
          flowLh: lastCipPumpData.q_l_h,
          dMm: lastCipPumpData.d_mm,
          lengthM: lastCipPumpData.length_m,
          dpBar: lastCipPumpData.dp_bar,
          rho: lastCipPumpData.rho,
          mu: lastCipPumpData.mu,
          roughnessMm: lastCipPumpData.roughness_mm,
          totalK: lastCipPumpData.kTotal
        } : null;
      }
      if (currentPumpMode === "routeProcess" || currentPumpMode === "routeCip") {
        const routeMode = currentPumpMode === "routeCip" ? "cip" : "process";
        const source = lastRoutePumpDataByMode[routeMode];
        return source ? {
          flowLh: source.q_l_h,
          dMm: source.d_mm,
          lengthM: source.length_m,
          dpBar: source.dp_bar,
          rho: source.rho,
          mu: source.mu,
          roughnessMm: source.roughness_mm,
          totalK: source.kTotal
        } : null;
      }
      return null;
    }

    function currentPumpLinkedSourceLabel() {
      if (!isPumpLinked() || currentPumpMode === "test") return "";
      if (currentPumpMode === "cip") return "CIP секция";
      if (currentPumpMode === "routeProcess") return "тръбно трасе - работен режим";
      if (currentPumpMode === "routeCip") return "тръбно трасе - CIP режим";
      return "тръбна задръжка";
    }

    function syncPumpLinkedInputs() {
      const linked = isPumpLinked();
      const source = linked ? currentPumpLinkedSource() : null;
      const sourceIds = ["pumpFlow", "pumpDiameter", "pumpLength", "pumpSourceDp", "pumpRho", "pumpMu", "pumpRoughness", "pumpTotalK"];
      sourceIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = Boolean(source);
      });

      if (!source) return;
      setControlValue("pumpFlow", source.flowLh);
      setControlValue("pumpDiameter", source.dMm);
      setControlValue("pumpLength", source.lengthM);
      setControlValue("pumpSourceDp", source.dpBar);
      setControlValue("pumpRho", source.rho);
      setControlValue("pumpMu", source.mu);
      setControlValue("pumpRoughness", source.roughnessMm);
      setControlValue("pumpTotalK", source.totalK);
    }

    function setPumpLinkMode(linkMode) {
      const normalized = currentPumpMode === "test" ? "standalone" : linkMode;
      if (currentPumpMode !== "test") localStorage.setItem(pumpLinkKey(currentPumpMode), normalized);
      document.getElementById("pumpLinkedBtn")?.classList.toggle("active", normalized === "linked");
      document.getElementById("pumpStandaloneBtn")?.classList.toggle("active", normalized === "standalone");
      syncPumpLinkedInputs();
      renderPumpCalc();
    }

    function setPumpLinkedMode(isLinked) {
      setPumpLinkMode(isLinked ? "linked" : "standalone");
    }

    function setPumpMode(mode) {
      savePumpModeState(currentPumpMode);
      currentPumpMode = mode;
      localStorage.setItem(PUMP_MODE_KEY, mode);
      document.querySelectorAll("[data-pump-mode]").forEach(btn => btn.classList.toggle("active", btn.dataset.pumpMode === mode));
      document.getElementById("pumpLinkToggle").style.display = mode === "test" ? "none" : "grid";
      if ((mode === "routeProcess" || mode === "routeCip") && document.querySelector(".route-segment")) {
        setRouteMode(mode === "routeCip" ? "cip" : "process", { markUserResult: false });
      }
      loadPumpModeState(mode);
      const linkMode = pumpLinkMode(mode);
      document.getElementById("pumpModeNotice").textContent = mode === "test"
        ? "Тестов режим — независимо изчисление, не е свързано с горните модули"
        : mode === "cip"
          ? "CIP режим: при свързване се ползват Q_CIP_min, D, L и Δp_CIP от CIP секцията. Дебитът на помпата включва 15% запас."
          : mode === "routeProcess"
            ? "Тръбно трасе - работен режим: ползват се дебитът, DN сегментите и загубите от раздел Тръбно трасе."
            : mode === "routeCip"
              ? "Тръбно трасе - CIP режим: ползват се CIP дебитът, DN сегментите и загубите от раздел Тръбно трасе."
              : "Работен режим на задръжката: ползват се Q, D, L и Δp от тръбната задръжка.";
      setPumpLinkMode(linkMode);
    }

    function renderPumpBreakdown(parts) {
      const el = document.getElementById("pumpBreakdown");
      if (!el) return;
      const items = [
        ["friction", "H_friction", parts.hFriction],
        ["static", "H_static", parts.staticHead],
        ["local", "H_local", parts.hLocal],
        ["extra", "H_extra", parts.hExtra],
        ["safety", "H_safety", parts.hSafety]
      ];
      const denom = items.reduce((sum, [, , value]) => sum + Math.abs(value), 0) || 1;
      const segments = items.map(([cls, label, value]) => {
        const width = Math.max(8, Math.abs(value) / denom * 100);
        const assist = cls === "static" && value < 0 ? " assist" : "";
        return `<div class="stacked-segment ${cls}${assist}" style="width:${width}%">${label}</div>`;
      }).join("");
      const legend = items.map(([, label, value]) => {
        const cls = label === "H_static" && value < 0 ? " class=\"static-assist\"" : "";
        return `<div${cls}>${label}: ${fmt(value, 2)} m</div>`;
      }).join("");
      el.innerHTML = `
        <div class="section-title">Разбивка на загубите</div>
        <div class="stacked-bar">${segments}</div>
        <div class="stacked-legend">${legend}<div>H_extra включва арматури ${fmt(parts.userExtraHead, 2)} m + противоналягане ${fmt(parts.hBackPressure, 2)} m</div></div>
      `;
    }

    function bindPumpControls() {
      document.querySelectorAll("[data-pump-mode]").forEach(btn => {
        btn.addEventListener("click", () => setPumpMode(btn.dataset.pumpMode));
      });
      document.getElementById("pumpLinkedBtn")?.addEventListener("click", () => setPumpLinkedMode(true));
      document.getElementById("pumpStandaloneBtn")?.addEventListener("click", () => setPumpLinkedMode(false));
      PUMP_CONTROL_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", () => {
          savePumpModeState(currentPumpMode);
          renderPumpCalc();
        });
      });
      setPumpMode(localStorage.getItem(PUMP_MODE_KEY) || "process");
    }

    function renderPumpCalc() {
      syncPumpLinkedInputs();
      savePumpModeState(currentPumpMode);

      const mode = currentPumpMode;
      const flowLhBase = num("pumpFlow", 0);
      const isCipPumpMode = mode === "cip" || mode === "routeCip";
      const flowLh = isCipPumpMode ? flowLhBase * 1.15 : flowLhBase;
      const qM3h = flowLh / 1000;
      const qM3s = qM3h / 3600;
      const dMm = num("pumpDiameter", 1);
      const d = dMm / 1000;
      const length = num("pumpLength", 0);
      const rho = num("pumpRho", 1000);
      const mu = num("pumpMu", 0.001);
      const eps = num("pumpRoughness", 0.0015) / 1000;
      const totalK = num("pumpTotalK", 0);
      const staticHead = num("pumpStaticHead", 0);
      const userExtraHead = num("pumpExtraHead", 0);
      const backPressureBar = num("pumpBackPressure", 0);
      const efficiency = Math.min(0.8, Math.max(0.4, num("pumpEfficiency", 0.65)));
      const area = Math.PI * Math.pow(d, 2) / 4;
      const velocity = area > 0 ? qM3s / area : 0;
      const re = mu > 0 ? (rho * velocity * d) / mu : 0;
      const lambda = colebrookWhite(re, eps, d);
      const velocityHead = Math.pow(velocity, 2) / (2 * 9.80665);
      const hFriction = d > 0 ? lambda * (length / d) * velocityHead : 0;
      const hLocal = totalK * velocityHead;
      const hBackPressure = rho > 0 ? (backPressureBar * 100000) / (rho * 9.80665) : 0;
      const hExtra = userExtraHead + hBackPressure;
      const hBeforeSafety = hFriction + staticHead + hLocal + hExtra;
      const hSafety = hBeforeSafety * 0.10;
      const hTotal = hBeforeSafety + hSafety;
      const dpPumpBar = (rho * 9.80665 * hTotal) / 100000;
      const pHyd = (rho * 9.80665 * qM3s * hTotal) / 1000;
      const pShaft = efficiency > 0 ? pHyd / efficiency : 0;
      const powerTone = pShaft > 15 ? "out" : pShaft > 5 ? "warn" : "";

      document.getElementById("pumpMetrics").innerHTML = [
        metric("Необходим дебит Q [m³/h]", fmt(qM3h, 3)),
        metric("Необходим дебит Q [L/s]", fmt(flowLh / 3600, 3)),
        metric("Необходим напор H [m]", fmt(hTotal, 2)),
        metric("Необходимо налягане Δp_pump [bar]", fmt(dpPumpBar, 3), "", pressureTone(dpPumpBar)),
        metric("Хидравлична мощност P_hyd [kW]", fmt(pHyd, 3), "small"),
        metric("Валова мощност P_shaft [kW]", fmt(pShaft, 3), "small", powerTone)
      ].join("");

      renderPumpBreakdown({ hFriction, staticHead, hLocal, hExtra, hSafety, userExtraHead, hBackPressure });

      const qCipMinTurbulent = isCipPumpMode ? 1.5 * area * 3600 * 1000 : 0;
      const cipWarning = isCipPumpMode && flowLhBase < qCipMinTurbulent
        ? ` Внимание: Q_CIP е под минималния турбулентен дебит ${fmt(qCipMinTurbulent, 0)} L/h.`
        : "";
      const sourceLabel = currentPumpLinkedSourceLabel();
      const sourceNote = sourceLabel ? `Свързан източник: ${sourceLabel}. ` : "";
      document.getElementById("pumpNote").innerHTML =
        `${mode === "test" ? "Тестов режим — независимо изчисление, не е свързано с горните модули. " : ""}` +
        sourceNote +
        `λ=${fmt(lambda, 5)}, Re=${fmt(re, 0)}, v=${fmt(velocity, 3)} m/s, η=${fmt(efficiency, 2)}. ` +
        `H_static ${staticHead < 0 ? "подпомага помпата" : "натоварва помпата"}.${cipWarning}`;
    }

    function renderRouteCalc({ markUserResult = true } = {}) {
      if (markUserResult) routeHasUserResult = true;
      const flow = num("routeFlow", 0);
      const rho = num("routeRho", 998);
      const mu = num("routeMu", 1);
      const eps = num("routeRoughness", 0.0015);
      const muPaS = mu / 1000;
      const q = flow / 1000 / 3600;
      const pipes = seriesAPipes();
      const segments = getRouteSegmentsState();
      let totalDpPa = 0;
      let totalLength = 0;
      let totalK = 0;
      const rows = segments.map((segment, index) => {
        const pipe = pipes[segment.dnIndex] || pipes[0];
        const dMm = pipe.od - 2 * pipe.t;
        const d = dMm / 1000;
        const area = Math.PI * Math.pow(d, 2) / 4;
        const velocity = area > 0 ? q / area : 0;
        const re = muPaS > 0 ? (rho * velocity * d) / muPaS : 0;
        const lambda = colebrookWhite(re, eps / 1000, d);
        let zeta =
          (segment.elbows90 * parseRouteNumber(segment.elbow90Zeta, 0.60)) +
          (segment.elbows45 * parseRouteNumber(segment.elbow45Zeta, 0.35)) +
          (segment.teeThrough * parseRouteNumber(segment.teeThroughZeta, 0.30)) +
          (segment.teeBranch * parseRouteNumber(segment.teeBranchZeta, 0.70)) +
          normalizePlateHxSections(segment).reduce((sum, section) => sum + parseRouteNumber(section.zeta, 0), 0);
        routeComponentLibrary.forEach(component => {
          const item = segment.components?.[component.key];
          zeta += (item?.count || 0) * (item?.zeta ?? component.zeta);
        });
        const nextSegment = segments[index + 1];
        if (nextSegment) {
          const nextPipe = pipes[nextSegment.dnIndex] || pipe;
          const d2 = (nextPipe.od - 2 * nextPipe.t) / 1000;
          const area1 = Math.PI * Math.pow(d, 2) / 4;
          const area2 = Math.PI * Math.pow(d2, 2) / 4;
          if (area2 > area1) {
            const override = parseFloat(segment.expansionZeta);
            zeta += Number.isFinite(override) ? override : Math.pow(1 - (area1 / area2), 2);
          } else if (area2 < area1) {
            const override = parseFloat(segment.contractionZeta);
            zeta += Number.isFinite(override) ? override : 0.5 * (1 - (area2 / area1));
          }
        }
        const dyn = rho * Math.pow(velocity, 2) / 2;
        const dpPa = ((lambda * (segment.length / d)) + zeta) * dyn;
        totalDpPa += dpPa;
        totalLength += segment.length;
        totalK += zeta;
        return { index, pipe, length: segment.length, dMm, velocity, re, zeta, dpPa, lambda };
      });
      const totalDpBar = totalDpPa / 100000;
      const representative = rows[0];
      const routePumpData = {
        q_l_h: flow,
        d_mm: representative?.dMm || 0,
        length_m: totalLength,
        dp_bar: totalDpBar,
        rho,
        mu: muPaS,
        roughness_mm: eps,
        kTotal: totalK
      };
      lastRoutePumpData = routePumpData;
      lastRoutePumpDataByMode[currentRouteMode] = routePumpData;

      document.getElementById("routeMetrics").innerHTML = [
        metric("Режим", currentRouteMode === "cip" ? "CIP" : "Работа", "small"),
        metric("Общ пад Δp [bar]", fmt(totalDpBar, 4), "", pressureTone(totalDpBar)),
        metric("Обща дължина L [m]", fmt(totalLength, 2), "small"),
        metric("Общо Σζ [-]", fmt(totalK, 2), "small"),
        metric("Брой сегменти", rows.length.toString(), "small")
      ].join("");
      document.getElementById("routeResultsTable").innerHTML = rows.map(row => {
        const tone = velocityTone(row.velocity);
        const cls = tone === "warn" ? " class=\"result-row-warn\"" : tone === "out" ? " class=\"result-row-out\"" : "";
        return `<tr${cls}>
          <td>${row.index + 1}</td>
          <td>${row.pipe.dn}</td>
          <td>${fmt(row.length, 2)}</td>
          <td>${fmt(row.velocity, 3)}</td>
          <td>${fmt(row.re, 0)}</td>
          <td>${fmt(row.zeta, 2)}</td>
          <td>${fmt(row.dpPa / 100000, 4)}</td>
        </tr>`;
      }).join("") + `
        <tr>
          <th colspan="2">Общо</th>
          <th>${fmt(totalLength, 2)}</th>
          <th>-</th>
          <th>-</th>
          <th>${fmt(totalK, 2)}</th>
          <th>${fmt(totalDpBar, 4)}</th>
        </tr>`;

      document.getElementById("routeNote").textContent =
        `Трасето използва DN от EN 10357 Series A, λ по Colebrook-White и локални ζ по въведените стойности. В допълнителните полета можеш да добавяш секции на пластинчат топлообменик, всяка със собствен брой пластини и собствено ζ. Текущият режим е ${currentRouteMode === "cip" ? "CIP" : "работен"} и се подава към съответния режим за помпа като отделна сметка.`;
      saveRouteState();
      if (markUserResult && (
        (currentPumpMode === "routeProcess" && currentRouteMode === "process" && isPumpLinked("routeProcess")) ||
        (currentPumpMode === "routeCip" && currentRouteMode === "cip" && isPumpLinked("routeCip"))
      )) renderPumpCalc();
    }

    function setupPages() {
      document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          const page = tab.dataset.page;
          document.querySelectorAll(".nav-tab").forEach(t => t.classList.toggle("active", t === tab));
          document.querySelectorAll(".page").forEach(section => section.classList.toggle("active", section.id === `page-${page}`));
          if (page === "cip") renderCipCalc();
          if (page === "pumps") renderPumpCalc();
          if (page === "routes") renderRouteCalc({ markUserResult: false });
          if (page === "protocols") updateProtocolPreview();
        });
      });

      document.getElementById("cipCalcBtn").addEventListener("click", renderCipCalc);
      document.getElementById("pumpCalcBtn").addEventListener("click", renderPumpCalc);
      document.getElementById("routeCalcBtn").addEventListener("click", () => renderRouteCalc({ markUserResult: true }));
      document.querySelectorAll("[data-route-mode]").forEach(btn => {
        btn.addEventListener("click", () => setRouteMode(btn.dataset.routeMode, { markUserResult: false }));
      });
      document.getElementById("addRouteSegmentBtn").addEventListener("click", () => {
        const segments = getRouteSegmentsState();
        if (segments.length >= 10) return;
        segments.push(routeDefaultSegment());
        renderRouteSegments(segments);
        renderRouteCalc({ markUserResult: true });
      });
      document.getElementById("removeRouteSegmentBtn").addEventListener("click", () => {
        const segments = getRouteSegmentsState();
        if (segments.length <= 1) return;
        segments.pop();
        renderRouteSegments(segments);
        renderRouteCalc({ markUserResult: true });
      });

      ["cipDiameter", "cipRouteLength", "cipVolume", "cipMin", "cipMax", "cipTemp", "cipCycles"]
        .forEach(id => document.getElementById(id).addEventListener("input", () => {
          saveFormState();
          renderCipCalc();
        }));
      ["routeFlow", "routeRho", "routeMu", "routeRoughness"]
        .forEach(id => document.getElementById(id).addEventListener("input", () => {
          saveRouteState();
          renderRouteCalc({ markUserResult: true });
        }));
      ["protocolRetention", "protocolCip", "protocolPumps", "protocolRoutes", "protocolTitle", "protocolDate", "protocolLogo", "protocolNotes", "protocolAuthorTitle", "protocolAuthorSalutation", "protocolAuthorName"]
        .forEach(id => document.getElementById(id).addEventListener("change", updateProtocolPreview));
      document.getElementById("protocolTitle")?.addEventListener("input", () => {
        protocolTitleUserEdited = document.getElementById("protocolTitle").value.trim() !== protocolDefaultTitle();
        document.getElementById("protocolTitle").dataset.autoTitle = protocolTitleUserEdited ? "false" : "true";
        updateProtocolPreview();
      });
      ["protocolDate", "protocolNotes", "protocolAuthorName"]
        .forEach(id => document.getElementById(id).addEventListener("input", updateProtocolPreview));
      bindProtocolLogoDrop();
    }

    function bindAutoRecalculation() {
      const recalcControls = document.querySelectorAll("#page-retention input, #page-retention select, #cipMin, #cipMax, #targetSpeed");
      let timer = null;
      const scheduleCalc = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          updateManualControls();
          saveFormState();
          calc();
        }, 120);
      };
      recalcControls.forEach(control => {
        control.addEventListener("input", scheduleCalc);
        control.addEventListener("change", scheduleCalc);
      });

      let resizeTimer = null;
      window.addEventListener("resize", () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => calc(), 150);
      });
    }

    fillFluids();
    fillStandards();
    fillElbowLibrary();
    fillFittingLibraries();
    bindGlobalTooltips();
    bindNumberFormatting();
    setupPages();
    bindAutoRecalculation();
    restoreInputsFromSession();
    bindCipModeToggle();
    bindOptionalComponentsBadge();
    bindPumpControls();
    const routeState = loadRouteState();
    if (routeState) {
      routeHasUserResult = Boolean(routeState.feedsPump);
    }
    currentRouteMode = localStorage.getItem(ROUTE_MODE_KEY) || routeState?.mode || "process";
    loadRouteModeInputs(currentRouteMode, routeState);
    document.querySelectorAll("[data-route-mode]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.routeMode === currentRouteMode);
    });
    renderRouteSegments(routeState?.segments);
    pipeSizeSelect.addEventListener("change", updatePipeIdInfo);
    calcBtn.addEventListener("click", calc);
    exportWordBtn.addEventListener("click", () => exportProtocol("word"));
    exportPdfBtn.addEventListener("click", () => exportProtocol("pdf"));
    resetAllBtn.addEventListener("click", resetAllFields);
    calc();
    renderCipCalc();
    if (currentPumpMode === "routeProcess" || currentPumpMode === "routeCip") {
      setRouteMode(currentPumpMode === "routeCip" ? "cip" : "process", { markUserResult: routeHasUserResult });
    } else {
      renderRouteCalc({ markUserResult: routeHasUserResult });
    }
    renderPumpCalc();
    updateProtocolPreview();
