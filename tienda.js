(function () {
  const ROPA = ["Tops/mangas largas/remeras", "Camperas", "Minifaldas", "Zapatos", "Accesorios", "Pantalones", "Shorts", "Bolsos", "Bikinis"];
  const ROPA_SIN_BIKINI = ROPA.filter((s) => s !== "Bikinis");
  const MIDWEST = ["Tops", "Camperitas", "Polleritas", "Zapatos", "Accesorios", "Pantalones", "Shorts", "Bolsos", "Vestidos"];

  const categorias = {
    "Alt & Y2K": ROPA,
    "Soft & Polka Dots": ROPA,
    "Vintage & 2nd Hand": ROPA_SIN_BIKINI,
    "Midwest & Grunge": MIDWEST,
    "Conjuntos Completos": ["Alt & Y2K", "Soft & Polka Dots", "2nd Hand", "Horror Game Protagonist", "Harajuku", "Halloween", "Midwest & Grunge"],
    "Minecraft & Stuff": ["Coleccionables", "DVD's", "Merch", "Frazadas", "Tapices decorativos", "Objetos decorativos", "Peluches", "Llaveros", "Carcasas"]
  };

  const tabsEl = document.getElementById("cat-tabs");
  const tabsWrapperEl = document.getElementById("cat-tabs-wrapper");
  const menuToggleEl = document.getElementById("cat-menu-toggle");
  const chipsEl = document.getElementById("subcat-chips");
  const gridEl = document.getElementById("productos-grid");

  if (!tabsEl) return;

  if (menuToggleEl && tabsWrapperEl) {
    menuToggleEl.addEventListener("click", () => {
      const isOpen = tabsWrapperEl.classList.toggle("is-open");
      menuToggleEl.setAttribute("aria-expanded", String(isOpen));
    });
  }

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

    if (tabsWrapperEl && menuToggleEl) {
      tabsWrapperEl.classList.remove("is-open");
      menuToggleEl.setAttribute("aria-expanded", "false");
    }

    chipsEl.innerHTML = "";
    ["Todo"].concat(categorias[cat]).forEach((sub) => {
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

(function () {
  const track = document.getElementById("galeria-track");
  const overlay = document.getElementById("producto-overlay");
  const modal = document.getElementById("producto-modal");
  const closeBtn = document.getElementById("producto-close");
  const modalImg = document.getElementById("producto-modal-img");
  const modalNombre = document.getElementById("producto-modal-nombre");
  const modalPrecio = document.getElementById("producto-modal-precio");
  const modalDetalle = document.getElementById("producto-modal-detalle");

  if (!track) return;

  const productos = [
    { nombre: "Top Y2K Estrella", precio: "$8.000", color: "#8a5a7a", detalle: "Talles: S, M, L. Tela stretch, corte cropped." },
    { nombre: "Campera Vintage", precio: "$15.000", color: "#5a3a52", detalle: "Talle único. Pieza de archivo, buen estado." },
    { nombre: "Minifalda Soft", precio: "$10.000", color: "#a9789e", detalle: "Talles: S, M. Tiro alto, lazo lateral." },
    { nombre: "Bolso Grunge", precio: "$12.000", color: "#3f2a3b", detalle: "Cuerina negra, correa ajustable." },
    { nombre: "Peluche Minecraft", precio: "$6.000", color: "#6a4a63", detalle: "20cm, bordado, edición limitada." },
    { nombre: "Carcasa Horror Game", precio: "$5.000", color: "#7a5170", detalle: "Compatible iPhone y Android." }
  ];

  function crearCard(p) {
    const card = document.createElement("div");
    card.className = "galeria-card";
    card.innerHTML =
      '<div class="galeria-card-img" style="background:' + p.color + '"></div>' +
      '<p class="galeria-card-nombre">' + p.nombre + '</p>' +
      '<p class="galeria-card-precio">' + p.precio + '</p>';
    card.addEventListener("click", () => abrirProducto(p));
    return card;
  }

  productos.concat(productos).forEach((p) => track.appendChild(crearCard(p)));

  function abrirProducto(p) {
    modalImg.style.background = p.color;
    modalNombre.textContent = p.nombre;
    modalPrecio.textContent = p.precio;
    modalDetalle.textContent = p.detalle;
    modal.classList.add("is-open");
    overlay.classList.add("is-open");
  }

  function cerrarProducto() {
    modal.classList.remove("is-open");
    overlay.classList.remove("is-open");
  }

  overlay.addEventListener("click", cerrarProducto);
  if (closeBtn) closeBtn.addEventListener("click", cerrarProducto);
})();
