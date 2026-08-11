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
    agregarAlCarrito(Number(btn.dataset.id));
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

  // ===== CARRITO =====
  let carrito = [];

  const carritoBtn = document.getElementById("carrito-btn");
  const carritoPanel = document.getElementById("carrito-panel");
  const carritoOverlay = document.getElementById("carrito-overlay");
  const carritoClose = document.getElementById("carrito-close");
  const carritoItemsEl = document.getElementById("carrito-items");
  const carritoTotalEl = document.getElementById("carrito-total");
  const carritoContadorEl = document.getElementById("carrito-contador");
  const carritoComprarBtn = document.getElementById("carrito-comprar");

  function toggleCarrito() {
    if (!carritoPanel || !carritoOverlay) return;
    carritoPanel.classList.toggle("abierto");
    carritoOverlay.classList.toggle("visible");
  }

  if (carritoBtn) carritoBtn.addEventListener("click", toggleCarrito);
  if (carritoOverlay) carritoOverlay.addEventListener("click", toggleCarrito);
  if (carritoClose) carritoClose.addEventListener("click", toggleCarrito);

  function precioNumero(precio) {
    return Number(String(precio).replace(/[^\d]/g, "")) || 0;
  }

  function agregarAlCarrito(id) {
    const producto = PRODUCTOS.find((p) => p.id === id);
    if (!producto) return;
    const item = carrito.find((it) => it.id === id);
    if (item) {
      item.cantidad += 1;
    } else {
      carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    renderCarrito();
    if (carritoPanel && !carritoPanel.classList.contains("abierto")) toggleCarrito();
  }

  function cambiarCantidad(id, delta) {
    const item = carrito.find((it) => it.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) carrito = carrito.filter((it) => it.id !== id);
    renderCarrito();
  }

  function eliminarDelCarrito(id) {
    carrito = carrito.filter((it) => it.id !== id);
    renderCarrito();
  }

  function renderCarrito() {
    if (!carritoItemsEl) return;

    if (!carrito.length) {
      carritoItemsEl.innerHTML = '<p class="carrito-vacio">tu carrito está vacío ✦</p>';
    } else {
      carritoItemsEl.innerHTML = carrito.map((item) =>
        '<div class="carrito-item">' +
        '<p class="carrito-item-nombre">' + item.nombre + '</p>' +
        '<p class="carrito-item-precio">' + item.precio + '</p>' +
        '<div class="carrito-item-controles">' +
        '<button class="carrito-item-btn" data-accion="menos" data-id="' + item.id + '">−</button>' +
        '<span class="carrito-item-cantidad">' + item.cantidad + '</span>' +
        '<button class="carrito-item-btn" data-accion="mas" data-id="' + item.id + '">+</button>' +
        '<button class="carrito-item-eliminar" data-accion="eliminar" data-id="' + item.id + '">eliminar</button>' +
        '</div>' +
        '</div>'
      ).join("");
    }

    const total = carrito.reduce((sum, item) => sum + precioNumero(item.precio) * item.cantidad, 0);
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (carritoTotalEl) carritoTotalEl.textContent = "$" + total.toLocaleString("es-AR");
    if (carritoContadorEl) carritoContadorEl.textContent = String(cantidadTotal);
  }

  if (carritoItemsEl) {
    carritoItemsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-accion]");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      if (btn.dataset.accion === "mas") cambiarCantidad(id, 1);
      if (btn.dataset.accion === "menos") cambiarCantidad(id, -1);
      if (btn.dataset.accion === "eliminar") eliminarDelCarrito(id);
    });
  }

  if (carritoComprarBtn) {
    carritoComprarBtn.addEventListener("click", () => {
      if (!carrito.length) return;
      const lineas = carrito.map((item) => "- " + item.nombre + " x" + item.cantidad + " (" + item.precio + ")");
      const total = carrito.reduce((sum, item) => sum + precioNumero(item.precio) * item.cantidad, 0);
      const mensaje = "Hola! Quiero hacer este pedido:\n" + lineas.join("\n") + "\nTotal: $" + total.toLocaleString("es-AR");
      window.open("https://wa.me/595981751066?text=" + encodeURIComponent(mensaje), "_blank");
    });
  }

  renderCarrito();
})();
