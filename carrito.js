(function () {
  const STORAGE_KEY = "buttons-carrito";

  function leerCarrito() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function guardarCarrito(carrito) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  }

  function precioNumero(precio) {
    return Number(String(precio).replace(/[^\d]/g, "")) || 0;
  }

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

  function abrirCarrito() {
    if (!carritoPanel || !carritoOverlay) return;
    carritoPanel.classList.add("abierto");
    carritoOverlay.classList.add("visible");
  }

  if (carritoBtn) carritoBtn.addEventListener("click", toggleCarrito);
  if (carritoOverlay) carritoOverlay.addEventListener("click", toggleCarrito);
  if (carritoClose) carritoClose.addEventListener("click", toggleCarrito);

  function renderCarrito() {
    const carrito = leerCarrito();

    if (carritoItemsEl) {
      if (!carrito.length) {
        carritoItemsEl.innerHTML = '<p class="carrito-vacio">tu carrito está vacío ✦</p>';
      } else {
        carritoItemsEl.innerHTML = carrito.map((item) =>
          '<div class="carrito-item">' +
          '<p class="carrito-item-nombre">' + item.nombre + (item.talle ? ' (' + item.talle + ')' : '') + '</p>' +
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
    }

    const total = carrito.reduce((sum, item) => sum + precioNumero(item.precio) * item.cantidad, 0);
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (carritoTotalEl) carritoTotalEl.textContent = "$" + total.toLocaleString("es-AR");
    if (carritoContadorEl) carritoContadorEl.textContent = String(cantidadTotal);
  }

  function agregarAlCarrito(producto) {
    if (!producto) return;
    const carrito = leerCarrito();
    const item = carrito.find((it) => it.id === producto.id);
    if (item) {
      item.cantidad += 1;
    } else {
      carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    guardarCarrito(carrito);
    renderCarrito();
    abrirCarrito();
  }

  function cambiarCantidad(id, delta) {
    let carrito = leerCarrito();
    const item = carrito.find((it) => it.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) carrito = carrito.filter((it) => it.id !== id);
    guardarCarrito(carrito);
    renderCarrito();
  }

  function eliminarDelCarrito(id) {
    const carrito = leerCarrito().filter((it) => it.id !== id);
    guardarCarrito(carrito);
    renderCarrito();
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
      const carrito = leerCarrito();
      if (!carrito.length) return;
      const lineas = carrito.map((item) => "- " + item.nombre + (item.talle ? " (" + item.talle + ")" : "") + " x" + item.cantidad + " (" + item.precio + ")");
      const total = carrito.reduce((sum, item) => sum + precioNumero(item.precio) * item.cantidad, 0);
      const mensaje = "Hola! Quiero hacer este pedido:\n" + lineas.join("\n") + "\nTotal: $" + total.toLocaleString("es-AR");
      window.open("https://wa.me/595981751066?text=" + encodeURIComponent(mensaje), "_blank");
    });
  }

  window.Carrito = { agregar: agregarAlCarrito };

  window.addEventListener("pageshow", renderCarrito);
  renderCarrito();
})();
