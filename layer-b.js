(() => {
  const root = document.getElementById("layer-b");
  if (!root) return;

  const language = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
  const { works, relations } = window.atlasLayerBData;
  const copy = {
    zh: {
      choose: "选一幅作品，展开它的图像学关系。",
      detail: "作品局部",
      focus: "当前作品",
      inspect: "选择关系视图",
      recenter: "以此作品重新展开",
      candidates: "切换对照作品",
      paired: "对照作品",
      missing: "证据与缺口",
      sources: "作品著录与全图",
      records: "作品著录",
      fullImage: "壁画全图",
      noMotif: "当前四件演示作品中，没有与此作共享同一具体叙事的配对。可切换到「母题转化」比较跨题材的遮额动作。",
      noTransmission: "目前没有可显示的历史传播关系。需要可追溯的临摹、工作坊记录、已证实的接触记录或共同范本。",
      motif: ["Shared Motif", "共享母题", "图像观察 · 题材有著录支持"],
      transformation: ["Transformation", "母题转化", "比较性假设"],
      transmission: ["Historical Transmission", "历史传播", "待证 · 缺少传播史料"]
    },
    en: {
      choose: "Select a work to explore its iconographic relationships.",
      detail: "Artwork detail",
      focus: "Selected work",
      inspect: "Choose a relationship view",
      recenter: "Explore from this work",
      candidates: "Change comparison work",
      paired: "Comparison work",
      missing: "Evidence and gaps",
      sources: "Object records and full views",
      records: "Object record",
      fullImage: "Full fresco",
      noMotif: "No other work in this four-image study shares this specific narrative. Use Transformation to compare the shading gesture across subjects.",
      noTransmission: "No historical link can be displayed here. Evidence could include a traceable copy, a workshop record, documented access, or an identifiable shared model.",
      motif: ["Shared Motif", "", "Visual observation · catalogued subject"],
      transformation: ["Transformation", "", "Comparative hypothesis"],
      transmission: ["Historical Transmission", "", "Open question · documentary evidence missing"]
    }
  }[language];

  const bySlot = (name) => root.querySelector(`[data-lb-slot="${name}"]`);
  let selected;
  let view;
  let comparison;

  function workMarkup(id, variant) {
    const work = works[id];
    const [artist, title, date, observation, sourceLabel] = work[language];

    if (variant === "picker") {
      return `<button type="button" class="lb-picker" data-lb-work="${id}" aria-pressed="false">
        <span class="lb-picker-image"><img src="img/${work.image}.jpg" alt=""><span class="lb-id">${id}</span></span>
        <span class="lb-picker-title">${artist}<span>${title}</span></span>
      </button>`;
    }

    return `<figure class="lb-plate">
      <div class="lb-plate-image"><img src="img/${work.image}.jpg" alt="${copy.detail} · ${title}"><span class="lb-id">${id}</span></div>
      <figcaption><span class="lb-plate-role">${variant === "anchor" ? copy.focus : copy.paired}</span>
        <h3>${title}</h3><p class="lb-meta">${artist} · ${date}</p>
        <p>${observation}</p>
        <a href="${work.source}" target="_blank" rel="noopener">${copy.records} · ${sourceLabel}</a>
        ${work.fullImage ? `<a href="${work.fullImage}" target="_blank" rel="noopener">${copy.fullImage}</a>` : ""}
      </figcaption>
    </figure>`;
  }

  function renderRelation() {
    const panel = bySlot("relation");
    bySlot("views").querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.lbView === view);
    });
    panel.hidden = !view;
    if (!view) {
      panel.innerHTML = "";
      bySlot("workspace").removeAttribute("data-view");
      return;
    }

    bySlot("workspace").dataset.view = view;
    const candidates = relations[view].filter(({ pair }) => pair.includes(selected));
    const target = ({ pair }) => pair.find((id) => id !== selected);
    const relation = candidates.find((item) => target(item) === comparison) || candidates[0];
    const [label, localLabel, evidence] = copy[view];
    const heading = `<p class="lb-kicker">${label}${localLabel ? ` · ${localLabel}` : ""}</p>`;

    if (!relation) {
      comparison = undefined;
      panel.innerHTML = `${heading}${view === "transmission" ? `<p class="lb-evidence">${evidence}</p>` : ""}<p>${view === "motif" ? copy.noMotif : copy.noTransmission}</p>`;
      return;
    }

    comparison = target(relation);
    const [title, reading, gap] = relation[language];
    const candidateButtons = candidates
      .map((item) => {
        const id = target(item);
        return `<button type="button" data-lb-compare="${id}" aria-pressed="${id === comparison}">${id} · ${works[id][language][0]}</button>`;
      }).join("");
    const sources = relation.pair.map((id) => {
      const work = works[id];
      return `<li><a href="${work.source}" target="_blank" rel="noopener">${id} · ${work[language][4]}</a></li>`;
    }).join("");

    panel.innerHTML = `${heading}
      ${candidates.length > 1 ? `<div class="lb-controls lb-choices" role="group" aria-label="${copy.candidates}">${candidateButtons}</div>` : ""}
      ${workMarkup(comparison, "comparison")}
      <div class="lb-reading">
        <p class="lb-evidence">${evidence}</p>
        <h4>${title}</h4>
        <p>${reading}</p>
        <h5>${copy.missing}</h5>
        <p>${gap}</p>
        <details><summary>${copy.sources}</summary><ul>${sources}</ul></details>
        <button type="button" class="lb-recenter" data-lb-recenter="${comparison}">${copy.recenter}</button>
      </div>`;
  }

  function selectWork(id) {
    if (!Object.hasOwn(works, id)) return;
    selected = id;
    view = undefined;
    comparison = undefined;
    bySlot("picker").querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.lbWork === selected);
    });
    bySlot("prompt").hidden = true;
    bySlot("workspace").hidden = false;
    bySlot("anchor").innerHTML = workMarkup(id, "anchor");
    renderRelation();
  }

  bySlot("picker").innerHTML = Object.keys(works).map((id) => workMarkup(id, "picker")).join("");
  bySlot("prompt").textContent = copy.choose;
  bySlot("views").setAttribute("aria-label", copy.inspect);
  bySlot("views").innerHTML = Object.keys(relations).map((key) => {
    const [label, localLabel] = copy[key];
    return `<button type="button" data-lb-view="${key}" aria-controls="lb-relation" aria-pressed="false">
      <span>${label}</span>${localLabel ? `<small>${localLabel}</small>` : ""}</button>`;
  }).join("");

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const { lbWork, lbView, lbCompare, lbRecenter } = button.dataset;
    if (lbWork) selectWork(lbWork);
    if (lbView) {
      view = view === lbView ? undefined : lbView;
      comparison = undefined;
      renderRelation();
    }
    if (lbCompare) {
      comparison = lbCompare;
      renderRelation();
      root.querySelector(`[data-lb-compare="${comparison}"]`)?.focus();
    }
    if (lbRecenter) {
      selectWork(lbRecenter);
      root.querySelector(`[data-lb-work="${selected}"]`).focus();
    }
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-layer-b-work]");
    if (!link || event.defaultPrevented) return;
    selectWork(link.dataset.layerBWork);
    root.querySelector("h2").focus({ preventScroll: true });
  });
})();
