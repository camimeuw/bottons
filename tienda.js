(function () {
  if (typeof PRODUCTOS === "undefined") return;

  const SLUGS = {
    "Alt & Y2K": "alt-y2k",
    "Soft & Polka Dots": "soft-polka",
    "Vintage & 2nd Hand": "vintage",
    "Midwest & Grunge": "midwest",
    "Conjuntos Completos": "conjuntos",
    "Coleccionables y Otros": "coleccionables"
  };

  function crearProductoCard(p) {
    const card = document.createElement("div");
    card.className = "producto-card";
    card.dataset.nombre = p.nombre.toLowerCase();
    card.innerHTML =
      '<a href="producto.html?id=' + p.id + '" class="card-link">' +
      '<div class="card-imagen" style="background:' + p.color + '"></div>' +
      '<p class="card-nombre">' + p.nombre + '</p>' +
      '<p class="card-precio">' + p.precio + '</p>' +
      '</a>' +
      '<button class="card-btn" type="button" data-id="' + p.id + '">agregar ✦</button>';
    return card;
  }

  (Object.keys(SLUGS)).forEach((cat) => {
    const contenedor = document.getElementById("grid-" + SLUGS[cat]);
    if (!contenedor) return;
    const subcategorias = (typeof SUBCATEGORIAS_TIENDA !== "undefined" && SUBCATEGORIAS_TIENDA[cat]) || [];

    subcategorias.forEach((sub) => {
      const bloque = document.createElement("div");
      bloque.className = "subcategoria-bloque";

      const titulo = document.createElement("h3");
      titulo.className = "subcategoria-titulo";
      titulo.textContent = sub;
      bloque.appendChild(titulo);

      const grid = document.createElement("div");
      grid.className = "productos-grid";

      const productos = PRODUCTOS.filter((p) => p.categoria === cat && p.subcategoria === sub);
      if (productos.length) {
        productos.forEach((p) => grid.appendChild(crearProductoCard(p)));
      } else {
        grid.innerHTML = '<p class="productos-empty">próximamente ✦</p>';
      }
      bloque.appendChild(grid);
      contenedor.appendChild(bloque);
    });
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".card-btn");
    if (!btn) return;
    e.preventDefault();
    const producto = PRODUCTOS.find((p) => p.id === Number(btn.dataset.id));
    if (producto && window.Carrito) window.Carrito.agregar(producto);
  });

  const buscador = document.getElementById("buscador");
  if (buscador) {
    buscador.addEventListener("input", () => {
      const q = buscador.value.trim().toLowerCase();
      document.querySelectorAll(".producto-card").forEach((card) => {
        card.style.display = !q || card.dataset.nombre.includes(q) ? "" : "none";
      });
    });
  }

  const menuBtn = document.getElementById("menu-hamburguesa");
  const menu = document.getElementById("menu-mobile");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => menu.classList.toggle("abierto"));
  }

  const destacadosTrack = document.getElementById("destacados-track");
  if (destacadosTrack) {
    function crearDestacado(p) {
      const a = document.createElement("a");
      a.className = "destacado-card";
      a.href = "producto.html?id=" + p.id;
      a.innerHTML =
        '<div class="destacado-card-img" style="background:' + p.color + '"></div>' +
        '<p class="destacado-card-nombre">' + p.nombre + '</p>' +
        '<p class="destacado-card-precio">' + p.precio + '</p>';
      return a;
    }
    PRODUCTOS.concat(PRODUCTOS).forEach((p) => destacadosTrack.appendChild(crearDestacado(p)));
  }

  const contadorEl = document.getElementById("contador");
  if (contadorEl) {
    const visitas = Number(localStorage.getItem("buttons-visitas") || 0) + 1;
    localStorage.setItem("buttons-visitas", String(visitas));
    contadorEl.textContent = String(visitas).padStart(6, "0");
  }

})();
