(function () {
  const ROPA = ["Tops/mangas largas/remeras", "Camperas", "Minifaldas", "Zapatos", "Accesorios", "Pantalones", "Shorts", "Bolsos", "Bikinis"];
  const ROPA_SIN_BIKINI = ROPA.filter((s) => s !== "Bikinis");

  const categorias = {
    "Alt & Y2K": ROPA,
    "Soft": ROPA,
    "Vintage & 2nd Hand": ROPA_SIN_BIKINI,
    "Conjuntos Completos": ["Alt & Y2K", "Soft", "2nd Hand", "Horror Game Protagonist", "Harajuku", "Halloween"],
    "Minecraft & Stuff": ["Coleccionables", "DVD's", "Merch", "Frazadas", "Tapices decorativos", "Objetos decorativos", "Peluches", "Llaveros", "Carcasas"]
  };

  const tabsEl = document.getElementById("cat-tabs");
  const chipsEl = document.getElementById("subcat-chips");
  const gridEl = document.getElementById("productos-grid");

  if (!tabsEl) return;

  Object.keys(categorias).forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "cat-item";
    btn.type = "button";
    btn.innerHTML = '<span class="cat-cursor">✦</span><span class="cat-label">' + cat + '</span>';
    btn.addEventListener("click", () => selectCategoria(cat, btn));
    tabsEl.appendChild(btn);
  });

  function selectCategoria(cat, btn) {
    tabsEl.querySelectorAll(".cat-item").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    chipsEl.innerHTML = "";
    categorias[cat].forEach((sub) => {
      const chip = document.createElement("button");
      chip.className = "subcat-item";
      chip.type = "button";
      chip.innerHTML = '<span class="subcat-cursor">▸</span><span class="subcat-label">' + sub + '</span>';
      chip.addEventListener("click", () => selectSubcategoria(cat, sub, chip));
      chipsEl.appendChild(chip);
    });

    gridEl.innerHTML = '<p class="productos-empty">Elegí una prenda dentro de ' + cat + ' ✦</p>';
  }

  function selectSubcategoria(cat, sub, chip) {
    chipsEl.querySelectorAll(".subcat-item").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");

    gridEl.innerHTML = '<p class="productos-empty">Próximamente: ' + cat + ' → ' + sub + ' ✦</p>';
  }
})();

(function () {
  const btn = document.getElementById("carrito-btn");
  const panel = document.getElementById("carrito-panel");
  const overlay = document.getElementById("carrito-overlay");
  const closeBtn = document.getElementById("carrito-close");

  if (!btn || !panel || !overlay) return;

  function openCarrito() {
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
  }

  function closeCarrito() {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
  }

  btn.addEventListener("click", openCarrito);
  overlay.addEventListener("click", closeCarrito);
  if (closeBtn) closeBtn.addEventListener("click", closeCarrito);
})();
