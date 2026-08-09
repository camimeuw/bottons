(function () {
  const ROPA = ["Tops/mangas largas/remeras", "Camperas", "Polleritas", "Zapatos", "Accesorios", "Pantalones", "Shorts", "Bolsos", "Bikinis"];
  const ROPA_SIN_BIKINI = ROPA.filter((s) => s !== "Bikinis");

  const categorias = {
    "Alt & Y2K": ROPA,
    "Soft": ROPA,
    "Vintage & 2nd Hand": ROPA_SIN_BIKINI,
    "Conjuntos Completos": ["Alt & Y2K", "Soft", "2nd Hand", "Horror Game Protagonist", "Harajuku", "Halloween"]
  };

  const tabsEl = document.getElementById("cat-tabs");
  const chipsEl = document.getElementById("subcat-chips");
  const gridEl = document.getElementById("productos-grid");

  if (!tabsEl) return;

  Object.keys(categorias).forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "cat-tab";
    btn.type = "button";
    btn.textContent = cat;
    btn.addEventListener("click", () => selectCategoria(cat, btn));
    tabsEl.appendChild(btn);
  });

  function selectCategoria(cat, btn) {
    tabsEl.querySelectorAll(".cat-tab").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    chipsEl.innerHTML = "";
    categorias[cat].forEach((sub) => {
      const chip = document.createElement("button");
      chip.className = "subcat-chip";
      chip.type = "button";
      chip.textContent = sub;
      chip.addEventListener("click", () => selectSubcategoria(cat, sub, chip));
      chipsEl.appendChild(chip);
    });

    gridEl.innerHTML = '<p class="productos-empty">Elegí una prenda dentro de ' + cat + ' ✦</p>';
  }

  function selectSubcategoria(cat, sub, chip) {
    chipsEl.querySelectorAll(".subcat-chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");

    gridEl.innerHTML = '<p class="productos-empty">Próximamente: ' + cat + ' → ' + sub + ' ✦</p>';
  }
})();
