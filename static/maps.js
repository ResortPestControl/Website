// Map stations and buildings: select one to show its latest reading under the map.
(() => {
  const show = (g) => {
    const card = g.closest(".mapcard");
    const panel = card && card.querySelector(".mapdetail");
    if (!panel) return;
    card.querySelectorAll(".st.on").forEach((el) => el.classList.remove("on"));
    g.classList.add("on");
    const { t, r } = JSON.parse(g.dataset.d);
    const h = document.createElement("h4");
    h.textContent = t;
    const dl = document.createElement("dl");
    for (const [k, v] of r) {
      const dt = document.createElement("dt");
      dt.textContent = k;
      const dd = document.createElement("dd");
      dd.textContent = v;
      dl.append(dt, dd);
    }
    panel.replaceChildren(h, dl);
  };
  document.addEventListener("click", (e) => {
    const g = e.target.closest && e.target.closest(".st");
    if (g) show(g);
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("st")) {
      e.preventDefault();
      show(e.target);
    }
  });
})();
