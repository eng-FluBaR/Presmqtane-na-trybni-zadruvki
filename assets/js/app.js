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
    let lastProtocolData = null;
    let lastFormulaLines = [];

    function fmt(value, digits = 3) {
      return Number.isFinite(value) ? value.toLocaleString("bg-BG", { maximumFractionDigits: digits, minimumFractionDigits: digits }) : "—";
    }

    function escapeAttr(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
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

    function bindGlobalTooltips() {
      const tooltip = document.getElementById("globalTooltip");
      if (!tooltip) return;

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
        if (!trigger || trigger.contains(event.relatedTarget)) return;
        hideTooltip();
      });
      document.addEventListener("focusin", event => {
        const trigger = tipFromEvent(event);
        if (trigger) placeTooltip(trigger);
      });
      document.addEventListener("focusout", event => {
        if (tipFromEvent(event)) hideTooltip();
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
      applyRangeClass(document.getElementById("targetSpeed"), rangeTone(values.targetSpeed, 0.3, 4.0));
      applyRangeClass(document.getElementById("k11852"), rangeTone(values.k11852, 0.05, 8.0));
      applyRangeClass(document.getElementById("k11851"), rangeTone(values.k11851, 0.05, 8.0));
      applyRangeClass(document.getElementById("k32676"), rangeTone(values.k32676, 0.05, 8.0));
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
      const selected52 = fittingLibrary11852[lib11852Select.value];
      if (!manual52 && selected52) document.getElementById("k11852").value = selected52.k;
      syncManualMode(["k11852"], manual52);

      const manual51 = manualChecked("manual11851");
      const selected51 = fittingLibrary11851[lib11851Select.value];
      if (!manual51 && selected51) document.getElementById("k11851").value = selected51.k;
      syncManualMode(["k11851"], manual51);

      const manual32676 = manualChecked("manual32676");
      const selected32676 = fittingLibrary32676[lib32676Select.value];
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
      elbowTypeSelect.value = "DIN 11852 | 90° санитарно коляно EN 10357-A (табличен R)";
      updateElbowFromLibrary();
      elbowTypeSelect.addEventListener("change", updateElbowFromLibrary);
    }

    function fillFittingLibraries() {
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
      const selected = fittingLibrary11852[lib11852Select.value];
      if (!selected) return;
      if (!manualChecked("manual11852")) {
        document.getElementById("k11852").value = selected.k;
      }
      lib11852Info.textContent = `Източник: ${selected.source}`;
      updateManualControls();
    }

    function update11851FromLibrary() {
      const selected = fittingLibrary11851[lib11851Select.value];
      if (!selected) return;
      if (!manualChecked("manual11851")) {
        document.getElementById("k11851").value = selected.k;
      }
      lib11851Info.textContent = `Източник: ${selected.source}`;
      updateManualControls();
    }

    function update32676FromLibrary() {
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
      let nStraights = 1;
      while ((nStraights * straightSegment) + (Math.max(0, nStraights - 1) * 2 * elbowArcLength) < length) {
        nStraights += 1;
      }
      const nUTurns = Math.max(0, nStraights - 1);
      const elbows90 = nUTurns * 2;
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
      const k11852 = inputs.use11852 ? inputs.count11852 * inputs.k11852 : 0;
      const k11851 = inputs.use11851 ? inputs.count11851 * inputs.k11851 : 0;
      const k32676 = inputs.use32676 ? inputs.count32676 * inputs.k32676 : 0;
      const kExtras = k11852 + k11851 + k32676;
      const kTotal = kElbowsOnly + kIO + kExtras;

      const leqElbows = elbows90 * inputs.leqElbowLD * d;
      const leqIO = (inputs.lossMethod === "leq" && inputs.includeIO && f > 0) ? (kIO / f) * d : 0;
      const leqExtras = (inputs.lossMethod === "leq" && f > 0) ? (kExtras / f) * d : 0;

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
        elbows90, re, f, kElbowsOnly, kIO, k11852, k11851, k32676, kExtras, kTotal, leqElbows, leqIO, leqExtras, lHydraulicTotal,
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
      } else {
        el.value = value;
      }
    }

    function getCurrentFormState() {
      const ids = [
        "flow", "retention", "fluid", "rho", "mu", "pipeStandard", "pipeSize", "roughness", "straightSeg",
        "lossMethod", "elbowType", "manualElbowData", "kElbow", "leqElbowLD", "elbowRadiusD", "inletOutletExtension", "includeIO", "cipMin", "cipMax", "targetSpeed",
        "use11852", "lib11852", "count11852", "k11852",
        "manual11852", "use11851", "lib11851", "count11851", "k11851",
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
            "use11852", "lib11852", "manual11852", "count11852", "k11852",
            "use11851", "lib11851", "manual11851", "count11851", "k11851",
            "use32676", "lib32676", "manual32676", "count32676", "k32676"
          ].forEach(id => setControlValue(id, state[id]));

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
        if (i.lib11852 && fittingLibrary11852[i.lib11852]) lib11852Select.value = i.lib11852;
        if (i.lib11851 && fittingLibrary11851[i.lib11851]) lib11851Select.value = i.lib11851;
        if (i.lib32676 && fittingLibrary32676[i.lib32676]) lib32676Select.value = i.lib32676;

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
        setControlValue("cipMin", i.cipMin);
        setControlValue("cipMax", i.cipMax);
        setControlValue("targetSpeed", i.targetSpeed);
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
        ? "Lхидр = L + nколена · (L/D)коляно · Dᵢ + Leq(вх/изх) + Leq(доп.)"
        : "ΣK = nколена · K90 + Kвх/изх + Kдоп.; Δpлок = ΣK · ρv²/2";
      const lossSubstitution = report.lossMethod.startsWith("Leq")
        ? `Lхидр = ${fmt(report.length_m, 3)} + ${report.elbows90} · ${fmt(report.leqElbowLD, 1)} · ${fmt(dM, 4)} + ${fmt(report.leqIO_m, 3)} + ${fmt(report.leqExtras_m, 3)} = ${fmt(report.lHydraulicTotal_m, 3)} m`
        : `ΣK = ${report.elbows90} · ${fmt(report.kElbow, 2)} + ${fmt(report.kIO, 2)} + ${fmt(report.kExtras, 2)} = ${fmt(report.kTotal, 3)}; Δpлок = ${fmt(report.kTotal, 3)} · ${fmt(dyn, 2)} = ${fmt(report.dpLocal_kpa * 1000, 2)} Pa`;

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
          `nколена = 2 · (${report.nStraights} - 1) = ${report.elbows90}; общо в колена = ${fmt(report.totalElbowArcLength_m, 3)} m`
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
        ["Коляно 90°", `${report.elbowType}; K=${fmt(report.kElbow,2)}; (L/D)=${fmt(report.leqElbowLD,1)}; R=${fmt(report.elbowRadius_mm,1)} mm; R/D=${fmt(report.elbowRadiusD,2)}${report.elbowRadiusIsTabular ? " (таблично)" : ""}; вход/изход=${report.includeIO ? "Да" : "Не"}`],
        ["Геометрия вход/изход", `удължение=${fmt(report.inletOutletExtensionMm,0)} mm; дължина=${fmt(report.inletOutletLength_m,3)} m`],
        ["DIN 11852", `${report.use11852 ? "Да" : "Не"}; брой=${fmt(report.count11852,0)}; K/бр=${fmt(report.k11852Single,2)}`],
        ["DIN 11851", `${report.use11851 ? "Да" : "Не"}; брой=${fmt(report.count11851,0)}; K/бр=${fmt(report.k11851Single,2)}`],
        ["DIN 32676", `${report.use32676 ? "Да" : "Не"}; брой=${fmt(report.count32676,0)}; K/бр=${fmt(report.k32676Single,2)}`],
        ["Избор DIN 11852", `${report.lib11852}`],
        ["Избор DIN 11851", `${report.lib11851}`],
        ["Избор DIN 32676", `${report.lib32676}`]
      ];

      const results = [
        ["Общ обем на задръжката", `${fmt(report.volume_l,2)} L`],
        ["Обем на задръжката", `${fmt(report.volume_m3,6)} m³`],
        ["Обем на 1 m тръба", `${fmt(report.volumePerMeter_l_m,3)} L/m`],
        ["Площ на сечение", `${fmt(report.area_m2,6)} m²`],
        ["Обща дължина", `${fmt(report.length_m,2)} m`],
        ["Хидравлична дължина Lобщо", `${fmt(report.lHydraulicTotal_m,3)} m`],
        ["Брой колена 90°", `${report.elbows90}`],
        ["Вход/изход геометрична дължина", `${fmt(report.inletOutletLength_m,3)} m`],
        ["Работна помпа - дебит", `${fmt(report.workPumpFlow_m3_h,3)} m³/h`],
        ["Работна помпа - напор", `${fmt(report.workPumpHead_m,2)} m`],
        ["Работна помпа - мощност", `${fmt(report.workPumpPower_kW,3)} kW при резерв ${fmt(report.workPumpReserve_percent,0)}% и КПД ${fmt(report.workPumpEfficiency_percent,0)}%`],
        ["Скорост", `${fmt(report.velocity_m_s,3)} m/s`],
        ["Уделна задръжка", `${fmt(report.retention_s_l,3)} s/L`],
        ["Re / f", `${fmt(report.re,0)} / ${fmt(report.f,5)}`],
        ["ΣK / Kколена / Kвх-изх", `${fmt(report.kTotal,3)} / ${fmt(report.kElbowsOnly,3)} / ${fmt(report.kIO,3)}`],
        ["Leq колена / Leq вх-изх", `${fmt(report.leqElbows_m,3)} m / ${fmt(report.leqIO_m,3)} m`],
        ["Leq доп. фитинги", `${fmt(report.leqExtras_m,3)} m`],
        ["Динамично налягане ρv²/2", `${fmt(report.dynamicPa,2)} Pa`],
        ["Общ пад на налягане", `${fmt(report.dpTotal_pa,2)} Pa | ${fmt(report.dpTotal_kpa,2)} kPa | ${fmt(report.dpTotal_bar,4)} bar`],
        ["Линейни загуби", `${fmt(report.dpLinear_kpa,2)} kPa`],
        ["Загуби в колена", `${fmt(report.dpElbows_kpa,2)} kPa`],
        ["Загуби вход/изход", `${fmt(report.dpIO_kpa,2)} kPa`],
        ["Загуби доп. фитинги", `${fmt(report.dpExtras_kpa,2)} kPa`],
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
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Бележка: Протоколът е за предварително оразмеряване. Финалният проект се валидира с пълна схема и фирмен стандарт." })
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
        { ol: formulaList, fontSize: 8.5 },
        { text: "\nБележка: Протоколът е за предварително оразмеряване. Финалният проект се валидира с пълна схема и фирмен стандарт.", style: "foot" }
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
        const flow = num("cipFlow", 0);
        const d = num("cipDiameter", 1);
        const length = num("cipRouteLength", 0);
        const totalK = num("cipTotalK", 0);
        const rho = num("cipRho", 998);
        const mu = num("cipMu", 1);
        const eps = num("cipRoughness", 0.0015);
        const minV = num("cipMin", 1.5);
        const r = genericHydraulic(flow, d, length, totalK, rho, mu, eps);
        const neededFlowLh = minV * r.area * 3600 * 1000;
        sections.push({
          title: "CIP миене",
          rows: [
            ["CIP дебит", `${fmt(flow, 0)} L/h`],
            ["ID / дължина / ΣK", `${fmt(d, 1)} mm / ${fmt(length, 2)} m / ${fmt(totalK, 2)}`],
            ["Плътност / вискозитет", `${fmt(rho, 1)} kg/m³ / ${fmt(mu, 2)} mPa·s`],
            ["Скорост", `${fmt(r.velocity, 3)} m/s`],
            ["Минимален дебит за целта", `${fmt(neededFlowLh, 0)} L/h`],
            ["Re / f", `${fmt(r.re, 0)} / ${fmt(r.f, 4)}`],
            ["Пад по дължина / локални", `${fmt(r.dpLinear / 1000, 2)} kPa / ${fmt(r.dpLocal / 1000, 2)} kPa`],
            ["Общо Δp", `${fmt(r.dpBar, 4)} bar`]
          ],
          formulas: [
            formulaBlock(
              "Преобразуване на CIP дебит",
              "Q = Q_L/h / (1000 · 3600)",
              `Q = ${fmt(flow, 0)} / (1000 · 3600) = ${fmt(flow / 1000 / 3600, 6)} m³/s`
            ),
            formulaBlock(
              "Сечение и скорост",
              "A = πDᵢ²/4; v = Q/A",
              `A = π · (${fmt(d / 1000, 4)})² / 4 = ${fmt(r.area, 6)} m²; v = ${fmt(flow / 1000 / 3600, 6)} / ${fmt(r.area, 6)} = ${fmt(r.velocity, 3)} m/s`
            ),
            formulaBlock(
              "Минимален дебит за зададена CIP скорост",
              "Qmin = vmin · A · 3600 · 1000",
              `Qmin = ${fmt(minV, 2)} · ${fmt(r.area, 6)} · 3600 · 1000 = ${fmt(neededFlowLh, 0)} L/h`
            ),
            formulaBlock(
              "Пад на налягане",
              "Δp = f(L/Dᵢ)ρv²/2 + ΣK·ρv²/2",
              `Δp = ${fmt(r.dpLinear, 2)} + ${fmt(r.dpLocal, 2)} = ${fmt(r.dpTotal, 2)} Pa`,
              `${fmt(r.dpBar, 4)} bar`
            )
          ]
        });
      }

      if (document.getElementById("protocolPumps")?.checked) {
        const flowLh = num("pumpFlow", 0);
        const dpBar = num("pumpDp", 0);
        const staticHead = num("pumpStaticHead", 0);
        const reserve = num("pumpReserve", 0) / 100;
        const efficiency = Math.max(num("pumpEfficiency", 55) / 100, 0.01);
        const rho = num("pumpRho", 1000);
        const q = flowLh / 1000 / 3600;
        const frictionHead = (dpBar * 100000) / (rho * 9.80665);
        const totalHead = (frictionHead + staticHead) * (1 + reserve);
        const hydraulicPower = rho * 9.80665 * q * totalHead;
        const shaftPower = hydraulicPower / efficiency;
        sections.push({
          title: "Избор на помпа",
          rows: [
            ["Работен дебит", `${fmt(flowLh / 1000, 3)} m³/h`],
            ["Пад / статичен напор", `${fmt(dpBar, 3)} bar / ${fmt(staticHead, 2)} m`],
            ["Резерв / КПД", `${fmt(reserve * 100, 0)} % / ${fmt(efficiency * 100, 0)} %`],
            ["Работен напор H", `${fmt(totalHead, 2)} m`],
            ["Хидравлична мощност", `${fmt(hydraulicPower / 1000, 3)} kW`],
            ["Ориентировъчна мощност на вала", `${fmt(shaftPower / 1000, 3)} kW`]
          ],
          formulas: [
            formulaBlock(
              "Преобразуване на пад в напор",
              "Hтр = Δp/(ρg)",
              `Hтр = ${fmt(dpBar, 3)} · 100000 / (${fmt(rho, 1)} · 9.80665) = ${fmt(frictionHead, 2)} m`
            ),
            formulaBlock(
              "Работен напор с резерв",
              "H = (Hтр + Hстат.) · (1 + резерв)",
              `H = (${fmt(frictionHead, 2)} + ${fmt(staticHead, 2)}) · (1 + ${fmt(reserve, 2)}) = ${fmt(totalHead, 2)} m`
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
        const d = num("routeDiameter", 1);
        const length = num("routeLength", 0);
        const elbows = num("routeElbows", 0);
        const valves = num("routeValves", 0);
        const tees = num("routeTees", 0);
        const otherK = num("routeOtherK", 0);
        const rho = num("routeRho", 998);
        const mu = num("routeMu", 1);
        const eps = num("routeRoughness", 0.0015);
        const totalK = elbows * 0.9 + valves * 2.5 + tees * 1.5 + otherK;
        const r = genericHydraulic(flow, d, length, totalK, rho, mu, eps);
        sections.push({
          title: "Тръбно трасе",
          rows: [
            ["Дебит / ID / дължина", `${fmt(flow, 0)} L/h / ${fmt(d, 1)} mm / ${fmt(length, 2)} m`],
            ["Колена / вентили / тройници", `${fmt(elbows, 0)} / ${fmt(valves, 0)} / ${fmt(tees, 0)}`],
            ["Други K / общо ΣK", `${fmt(otherK, 2)} / ${fmt(totalK, 2)}`],
            ["Скорост", `${fmt(r.velocity, 3)} m/s`],
            ["Re / f", `${fmt(r.re, 0)} / ${fmt(r.f, 4)}`],
            ["Пад по дължина / елементи", `${fmt(r.dpLinear / 1000, 2)} kPa / ${fmt(r.dpLocal / 1000, 2)} kPa`],
            ["Общо Δp", `${fmt(r.dpBar, 4)} bar`]
          ],
          formulas: [
            formulaBlock(
              "Сума на локалните съпротивления",
              "ΣK = nколена·0.9 + nвентили·2.5 + nтройници·1.5 + Kдруги",
              `ΣK = ${fmt(elbows, 0)}·0.9 + ${fmt(valves, 0)}·2.5 + ${fmt(tees, 0)}·1.5 + ${fmt(otherK, 2)} = ${fmt(totalK, 2)}`
            ),
            formulaBlock(
              "Скорост в трасето",
              "A = πDᵢ²/4; v = Q/A",
              `A = ${fmt(r.area, 6)} m²; v = ${fmt(flow / 1000 / 3600, 6)} / ${fmt(r.area, 6)} = ${fmt(r.velocity, 3)} m/s`
            ),
            formulaBlock(
              "Пад на налягане в трасето",
              "Δp = f(L/Dᵢ)ρv²/2 + ΣK·ρv²/2",
              `Δp = ${fmt(r.dpLinear, 2)} + ${fmt(r.dpLocal, 2)} = ${fmt(r.dpTotal, 2)} Pa`,
              `${fmt(r.dpBar, 4)} bar`
            )
          ]
        });
      }

      return sections;
    }

    function updateProtocolPreview() {
      const box = document.getElementById("protocolPreview");
      if (!box) return;
      const sections = selectedProtocolSections();
      box.innerHTML = sections.length
        ? sections.map(section => `<div class="formula">${section.title}: ${section.rows.length} реда, ${section.formulas?.length || 0} формули</div>`).join("")
        : `<div class="formula">Няма избрана сметка за протокол.</div>`;
    }

    function buildSelectedProtocol() {
      const sections = selectedProtocolSections();
      if (!sections.length) {
        alert("Избери поне една сметка за протокола.");
        return null;
      }
      return { date: new Date().toLocaleString("bg-BG"), sections };
    }

    function protocolTableRows(section) {
      return section.rows.map(([k, v]) => [k, String(v ?? "")]);
    }

    async function exportSelectedWordProtocol(bundle, fileBase) {
      if (!window.docx) {
        alert("Липсва библиотека за Word експорт.");
        return;
      }
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } = window.docx;
      const children = [
        new Paragraph({ text: "ПРОТОКОЛ ЗА ИЗЧИСЛЕНИЯ", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.LEFT }),
        new Paragraph({ text: `Дата: ${bundle.date}` }),
        new Paragraph({ text: "" })
      ];
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
      children.push(new Paragraph({ text: "Бележка: Протоколът е за предварително оразмеряване. Финалният проект се валидира с пълна схема и фирмен стандарт." }));
      const doc = new Document({ sections: [{ properties: {}, children }] });
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, `${fileBase}.docx`);
    }

    function exportSelectedPdfProtocol(bundle, fileBase) {
      if (!window.pdfMake) {
        alert("Липсва библиотека за PDF експорт.");
        return;
      }
      const content = [
        { text: "ПРОТОКОЛ ЗА ИЗЧИСЛЕНИЯ", style: "header" },
        { text: `Дата: ${bundle.date}`, style: "subheader" }
      ];
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
      content.push({ text: "\nБележка: Протоколът е за предварително оразмеряване. Финалният проект се валидира с пълна схема и фирмен стандарт.", style: "foot" });
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
      const bundle = buildSelectedProtocol();
      if (!bundle) return;
      const fileBase = `protokol_izchislenia_${new Date().toISOString().slice(0, 10)}`;

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
      const inletOutletExtensionMm = parseFloat(document.getElementById("inletOutletExtension").value) || 0;
      const inletOutletExtensionM = inletOutletExtensionMm / 1000;
      const includeIO = document.getElementById("includeIO").checked;
      const use11852 = document.getElementById("use11852").checked;
      const count11852 = parseFloat(document.getElementById("count11852").value) || 0;
      const k11852 = libraryOrManual("manual11852", "k11852", fittingLibrary11852, lib11852Select, "k");
      const lib11852 = lib11852Select.value;
      const use11851 = document.getElementById("use11851").checked;
      const count11851 = parseFloat(document.getElementById("count11851").value) || 0;
      const k11851 = libraryOrManual("manual11851", "k11851", fittingLibrary11851, lib11851Select, "k");
      const lib11851 = lib11851Select.value;
      const use32676 = document.getElementById("use32676").checked;
      const count32676 = parseFloat(document.getElementById("count32676").value) || 0;
      const k32676 = libraryOrManual("manual32676", "k32676", fittingLibrary32676, lib32676Select, "k");
      const lib32676 = lib32676Select.value;
      const cipMin = parseFloat(document.getElementById("cipMin").value);
      const cipMax = parseFloat(document.getElementById("cipMax").value);
      const targetSpeed = parseFloat(document.getElementById("targetSpeed").value);

      updateInputBoundaryColors({ roughness_mm, kElbow, leqElbowLD, elbowRadiusD, targetSpeed, k11852, k11851, k32676 });

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

      renderMetrics({
        q,
        q_l_h,
        q_l_s,
        rho,
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
        kTotal: main.kTotal,
        kExtras: main.kExtras,
        method: lossMethod,
        velocity: main.velocity,
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
        cipStatus: cipStatus(main.velocity, cipMin, cipMax),
        cipTone: rangeTone(main.velocity, cipMin, cipMax),
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
      const workPump = pumpEstimate(r.q, r.dpTotal, r.rho);

      primary.innerHTML = [
        metric("Дебит на продукта [L/h]", fmt(r.q_l_h, 0)),
        metric("Обем на серпентината [L]", fmt(r.volume_l, 2)),
        metric("Обем на тръбата [L/m]", fmt(r.volumePerMeter_l_m, 3)),
        metric("Обща дължина на тръбната задръжка [m]", fmt(r.length, 2)),
        metric("Реален брой колена 90°", r.elbows90.toString())
      ].join("");

      secondary.innerHTML = [
        metric("Дебит на продукта [L/s]", fmt(r.q_l_s, 3), "small"),
        metric("Скорост при работа [m/s]", fmt(r.velocity, 3), "small"),
        metric("Задръжка t/V [s/L]", fmt(r.retention_s_l, 3), "small"),
        metric("Светъл отвор ID [mm]", fmt(r.d_mm, 1), "small"),
        metric("Метод", r.method === "leq" ? "Leq" : "ζ", "small"),
        metric("Работна помпа дебит [m³/h]", fmt(r.q_l_h / 1000, 3), "small"),
        metric("Работна помпа напор [m]", fmt(workPump.head, 2), "small"),
        metric("Работна помпа мощност [kW]", fmt(workPump.shaftPower / 1000, 3), "small"),
        metric("Работна помпа Δp [bar]", fmt(r.dpTotalBar, 4), "small"),
        metric("Работна помпа резерв", `${fmt(workPump.reserve * 100, 0)} %`, "small"),
        metric("Работна помпа КПД", `${fmt(workPump.efficiency * 100, 0)} %`, "small"),
        metric("Дължина на 1 сектор [m]", fmt(r.sectorLength, 3), "small"),
        metric("Дължина на 1 коляно [m]", fmt(r.elbowArcLength, 3), "small"),
        metric("Радиус на коляно", `${fmt(r.bendRadiusM * 1000, 1)} mm / R/D=${fmt(r.elbowRadiusD, 2)}${r.elbowRadiusIsTabular ? " табл." : ""}`, "small"),
        metric("Вход/изход [m]", fmt(r.inletOutletLengthM, 3), "small"),
        metric("Удължение вход/изход [mm]", fmt(r.inletOutletExtensionM * 1000, 0), "small"),
        metric("Общо дължина в колена [m]", fmt(r.totalElbowArcLength, 3), "small"),
        metric("Права дължина общо [m]", fmt(r.straightLengthTotal, 3), "small"),
        metric("Габарит ширина [mm]", fmt(r.overallWidthM * 1000, 0), "small"),
        metric("Габарит височина [mm]", fmt(r.overallHeightM * 1000, 0), "small"),
        metric("Дълбочина U [mm]", fmt(r.sideDepthM * 1000, 0), "small"),
        metric("Брой колена 90°", r.elbows90.toString(), "small"),
        metric("Общо съпротивление ΣK [-]", fmt(r.kTotal, 2), "small", r.kTone),
        metric("Скорост v [m/s]", fmt(r.velocity, 3), "small"),
        metric("Re [-]", fmt(r.re, 0), "small"),
        metric("f [-]", fmt(r.f, 4), "small"),
        metric("Δp линейни [kPa]", fmt(r.dpLinear / 1000, 2), "small"),
        metric("Δp колена [kPa]", fmt(r.dpElbows / 1000, 2), "small"),
        metric("Δp вход/изход [kPa]", fmt(r.dpIO / 1000, 2), "small"),
        metric("Δp доп. фитинги [kPa]", fmt(r.dpExtras / 1000, 2), "small"),
        metric("Δp локални [kPa]", fmt(r.dpLocal / 1000, 2), "small"),
        metric("Δp общ [kPa]", fmt(r.dpTotal / 1000, 2), "small"),
        metric("Δp общ [bar]", fmt(r.dpTotalBar, 4), "small"),
        metric("ε диапазон", r.epsTone === "ok" ? "В диапазон" : r.epsTone === "warn" ? "Близо до граница" : "Извън диапазон", "small", r.epsTone),
        metric("(L/D) диапазон", r.leqTone === "ok" ? "В диапазон" : r.leqTone === "warn" ? "Близо до граница" : "Извън диапазон", "small", r.leqTone),
        metric("ΣK доп. фитинги", fmt(r.kExtras, 2), "small", r.extrasTone)
      ].join("");
    }

    function formulaLine(text) {
      return `<div class="formula">${text}</div>`;
    }

    function renderFormulas(x) {
      const f = document.getElementById("formulas");
      const ioPart = x.includeIO ? " + 1.5" : "";
      const extrasText = `Kдоп = K11852 + K11851 + K32676 = ${fmt(x.k11852Total, 3)} + ${fmt(x.k11851Total, 3)} + ${fmt(x.k32676Total, 3)} = ${fmt(x.kExtras, 3)}`;
      const lossBlock = x.lossMethod === "leq"
        ? `12) Метод Leq (еквивалентна дължина):\nLeq(колена) = nколена·(L/D)коляно·D = ${x.elbows90}·${fmt(x.leqElbowLD, 1)}·${fmt(x.d, 4)} = ${fmt(x.leqElbows, 3)} m\nLeq(вход/изход) = (Kвх/изх / f)·D = (${fmt(x.kIO, 3)} / ${fmt(x.f, 5)})·${fmt(x.d, 4)} = ${fmt(x.leqIO, 3)} m\nLeq(доп) = (Kдоп / f)·D = (${fmt(x.kExtras, 3)} / ${fmt(x.f, 5)})·${fmt(x.d, 4)} = ${fmt(x.leqExtras, 3)} m\nLхидр = L + Leq(колена) + Leq(вх/изх) + Leq(доп) = ${fmt(x.length, 3)} + ${fmt(x.leqElbows, 3)} + ${fmt(x.leqIO, 3)} + ${fmt(x.leqExtras, 3)} = ${fmt(x.lHydraulicTotal, 3)} m\n${extrasText}\nΔp = f·(Lхидр/D)·ρv²/2 = ${fmt(x.dpTotal, 2)} Pa`
        : `12) Метод ζ (локални коефициенти):\nΣK = nколена·Kколяно${x.includeIO ? " + Kвх/изх" : ""} + Kдоп\n${extrasText}\nΣK = ${x.elbows90}·${fmt(x.kElbow, 2)}${ioPart} + ${fmt(x.kExtras, 3)} = ${fmt(x.kTotal, 3)}\nΔpлок = ΣK·ρv²/2 = ${fmt(x.kTotal, 3)}·${fmt(x.dyn, 3)} = ${fmt(x.dpLocal, 2)} Pa`;

      const lines = [
        formulaLine(`1) Преобразуване на дебит:\nQ = ${fmt(x.q_l_h, 1)} L/h = ${fmt(x.q_l_s, 4)} L/s = ${fmt(x.q_l_h / 1000, 4)} m³/h = ${fmt(x.q, 6)} m³/s`),
        formulaLine(`2) Вътрешен диаметър (от избраната тръба):\nDᵢ = OD - 2·s = ${fmt(x.od, 1)} - 2·${fmt(x.wall, 1)} = ${fmt(x.d_mm, 1)} mm = ${fmt(x.d, 4)} m`),
        formulaLine(`3) Площ на сечение:\nA = π·D²/4 = π·(${fmt(x.d, 4)})²/4 = ${fmt(x.area, 6)} m²`),
        formulaLine(`4) Необходим обем за задръжка:\nV = Q·t = ${fmt(x.q, 6)}·${fmt(x.t, 1)} = ${fmt(x.volume, 6)} m³`),
        formulaLine(`5) Обем на тръбата за 1 метър:\nV₁m = A·1m = ${fmt(x.area, 6)} m³/m = ${fmt(x.volumePerMeter_l_m, 3)} L/m`),
        formulaLine(`6) Обща дължина на тръбната задръжка:\nL = V/A = ${fmt(x.volume, 6)} / ${fmt(x.area, 6)} = ${fmt(x.length, 3)} m`),
        formulaLine(`7) Геометрия на серпентината и брой колена:\nLколяно = π/2·R/D·D = π/2·${fmt(x.elbowRadiusD, 2)}·${fmt(x.d, 4)} = ${fmt(x.elbowArcLength, 4)} m\nИзбрани прави секции = ${x.nStraights}; колена 90° = 2·(${x.nStraights} - 1) = ${x.elbows90}; сектори = ${x.sectorCount}\nLправи = Lобщо - Lколена = ${fmt(x.length, 3)} - ${fmt(x.totalElbowArcLength, 3)} = ${fmt(x.straightLengthTotal, 3)} m\nLвход/изход = Lправа секция + Lколяно + Lудължение = ${fmt(x.segment, 3)} + ${fmt(x.elbowArcLength, 3)} + ${fmt(x.inletOutletExtensionM, 3)} = ${fmt(x.inletOutletLengthM, 3)} m`),
        formulaLine(`8) Уделна задръжка:\nt/V = ${fmt(x.t, 2)} / ${fmt(x.volume_l, 3)} = ${fmt(x.retention_s_l, 3)} s/L`),
        formulaLine(`9) Скорост:\nv = Q/A = ${fmt(x.q, 6)} / ${fmt(x.area, 6)} = ${fmt(x.velocity, 4)} m/s`),
        formulaLine(`10) Reynolds:\nRe = ρ·v·D/μ = ${fmt(x.rho, 1)}·${fmt(x.velocity, 4)}·${fmt(x.d, 4)} / ${fmt(x.mu, 6)} = ${fmt(x.re, 0)}`),
        formulaLine(`11) Коефициент на триене f:\nRe < 2300: f = 64/Re; Re > 4000: Swamee-Jain; 2300–4000: линейна интерполация\nε = ${fmt(x.roughness_mm, 4)} mm = ${fmt(x.eps, 6)} m; f = ${fmt(x.f, 5)}\nВъведен диапазон за ε: min 0.0005 mm / max 0.1000 mm`),
        formulaLine(`${lossBlock}\nВъведен диапазон за K(90°): min 0.10 / max 2.00; (L/D)коляно: min 5 / max 120`),
        formulaLine(`13) Динамично налягане:\nρv²/2 = ${fmt(x.rho, 1)}·(${fmt(x.velocity, 4)})²/2 = ${fmt(x.dyn, 3)} Pa`),
        formulaLine(`14) Пад по дължина:\nΔpₗ = f·(L/D)·ρv²/2 = ${fmt(x.f, 5)}·(${fmt(x.length, 3)}/${fmt(x.d, 4)})·${fmt(x.dyn, 3)} = ${fmt(x.dpLinear, 2)} Pa`),
        formulaLine(`15) Локален пад (детайл):\nΔpколена = ${fmt(x.dpElbows, 2)} Pa; Δpвх/изх = ${fmt(x.dpIO, 2)} Pa; Δpдоп = ${fmt(x.dpExtras, 2)} Pa; Δpлок = ${fmt(x.dpLocal, 2)} Pa`),
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
      const flow = num("cipFlow", 0);
      const d = num("cipDiameter", 1);
      const length = num("cipRouteLength", 0);
      const totalK = num("cipTotalK", 0);
      const rho = num("cipRho", 998);
      const mu = num("cipMu", 1);
      const eps = num("cipRoughness", 0.0015);
      const minV = num("cipMin", 1.5);
      const r = genericHydraulic(flow, d, length, totalK, rho, mu, eps);
      const tone = r.velocity >= minV ? "ok" : "out";
      const neededFlowLh = (minV * r.area * 3600 * 1000);
      const missingFlow = Math.max(0, neededFlowLh - flow);

      document.getElementById("cipMetrics").innerHTML = [
        metric("Скорост CIP [m/s]", fmt(r.velocity, 3), "", tone),
        metric("Минимален дебит за целта [L/h]", fmt(neededFlowLh, 0), "small"),
        metric("Re [-]", fmt(r.re, 0), "small"),
        metric("f [-]", fmt(r.f, 4), "small"),
        metric("Пад по дължина [kPa]", fmt(r.dpLinear / 1000, 2), "small"),
        metric("Локални загуби [kPa]", fmt(r.dpLocal / 1000, 2), "small"),
        metric("Общо Δp [bar]", fmt(r.dpBar, 4), "small")
      ].join("");

      document.getElementById("cipNote").textContent = r.velocity >= minV
        ? "CIP скоростта покрива зададения минимум. Провери отделно време, температура, химия и изискванията на конкретната инсталация."
        : `CIP скоростта е под минимума. Ориентировъчно са нужни още ${fmt(missingFlow, 0)} L/h или по-малък вътрешен диаметър.`;
    }

    function renderPumpCalc() {
      const flowLh = num("pumpFlow", 0);
      const dpBar = num("pumpDp", 0);
      const staticHead = num("pumpStaticHead", 0);
      const reserve = num("pumpReserve", 0) / 100;
      const efficiency = Math.max(num("pumpEfficiency", 55) / 100, 0.01);
      const rho = num("pumpRho", 1000);
      const q = flowLh / 1000 / 3600;
      const frictionHead = (dpBar * 100000) / (rho * 9.80665);
      const totalHead = (frictionHead + staticHead) * (1 + reserve);
      const hydraulicPower = rho * 9.80665 * q * totalHead;
      const shaftPower = hydraulicPower / efficiency;

      document.getElementById("pumpMetrics").innerHTML = [
        metric("Препоръчителен дебит [m³/h]", fmt(flowLh / 1000, 3)),
        metric("Работен напор H [m]", fmt(totalHead, 2)),
        metric("Хидравлична мощност [kW]", fmt(hydraulicPower / 1000, 3), "small"),
        metric("Ориент. мощност на вала [kW]", fmt(shaftPower / 1000, 3), "small"),
        metric("Резерв", `${fmt(reserve * 100, 0)} %`, "small")
      ].join("");

      document.getElementById("pumpNote").textContent =
        `Търси помпа с работна точка около ${fmt(flowLh / 1000, 2)} m³/h при ${fmt(totalHead, 2)} m. За окончателен избор трябва крива на производителя, NPSH и тип продукт.`;
    }

    function renderRouteCalc() {
      const flow = num("routeFlow", 0);
      const d = num("routeDiameter", 1);
      const length = num("routeLength", 0);
      const elbows = num("routeElbows", 0);
      const valves = num("routeValves", 0);
      const tees = num("routeTees", 0);
      const otherK = num("routeOtherK", 0);
      const rho = num("routeRho", 998);
      const mu = num("routeMu", 1);
      const eps = num("routeRoughness", 0.0015);
      const totalK = elbows * 0.9 + valves * 2.5 + tees * 1.5 + otherK;
      const r = genericHydraulic(flow, d, length, totalK, rho, mu, eps);

      document.getElementById("routeMetrics").innerHTML = [
        metric("Скорост [m/s]", fmt(r.velocity, 3), "", rangeTone(r.velocity, 0.5, 2.5)),
        metric("Общо ΣK [-]", fmt(totalK, 2), "small"),
        metric("Re [-]", fmt(r.re, 0), "small"),
        metric("f [-]", fmt(r.f, 4), "small"),
        metric("Пад по дължина [kPa]", fmt(r.dpLinear / 1000, 2), "small"),
        metric("Пад в елементи [kPa]", fmt(r.dpLocal / 1000, 2), "small"),
        metric("Общо Δp [bar]", fmt(r.dpBar, 4), "small")
      ].join("");

      document.getElementById("routeNote").textContent =
        "Приети ориентировъчни K: коляно 90° = 0.9, вентил = 2.5, тройник = 1.5. За реален проект ги замени с каталожни стойности според конкретните елементи.";
    }

    function setupPages() {
      document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          const page = tab.dataset.page;
          document.querySelectorAll(".nav-tab").forEach(t => t.classList.toggle("active", t === tab));
          document.querySelectorAll(".page").forEach(section => section.classList.toggle("active", section.id === `page-${page}`));
          if (page === "cip") renderCipCalc();
          if (page === "pumps") renderPumpCalc();
          if (page === "routes") renderRouteCalc();
          if (page === "protocols") updateProtocolPreview();
        });
      });

      document.getElementById("cipCalcBtn").addEventListener("click", renderCipCalc);
      document.getElementById("pumpCalcBtn").addEventListener("click", renderPumpCalc);
      document.getElementById("routeCalcBtn").addEventListener("click", renderRouteCalc);

      ["cipFlow", "cipDiameter", "cipRouteLength", "cipTotalK", "cipRho", "cipMu", "cipRoughness", "cipMin", "cipMax", "targetSpeed"]
        .forEach(id => document.getElementById(id).addEventListener("input", renderCipCalc));
      ["pumpFlow", "pumpDp", "pumpStaticHead", "pumpReserve", "pumpEfficiency", "pumpRho"]
        .forEach(id => document.getElementById(id).addEventListener("input", renderPumpCalc));
      ["routeFlow", "routeDiameter", "routeLength", "routeElbows", "routeValves", "routeTees", "routeOtherK", "routeRho", "routeMu", "routeRoughness"]
        .forEach(id => document.getElementById(id).addEventListener("input", renderRouteCalc));
      ["protocolRetention", "protocolCip", "protocolPumps", "protocolRoutes"]
        .forEach(id => document.getElementById(id).addEventListener("change", updateProtocolPreview));
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
    setupPages();
    bindAutoRecalculation();
    restoreInputsFromSession();
    pipeSizeSelect.addEventListener("change", updatePipeIdInfo);
    calcBtn.addEventListener("click", calc);
    exportWordBtn.addEventListener("click", () => exportProtocol("word"));
    exportPdfBtn.addEventListener("click", () => exportProtocol("pdf"));
    resetAllBtn.addEventListener("click", resetAllFields);
    calc();
    renderCipCalc();
    renderPumpCalc();
    renderRouteCalc();
    updateProtocolPreview();
