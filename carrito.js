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
        carritoItemsEl.innerHTML = carrito.map((item) => {
          const detalle = [item.talle, item.color].filter(Boolean).join(', ');
          return '<div class="carrito-item">' +
          (item.imagen ? '<div class="carrito-item-imagen" style="background-image:url(\'' + item.imagen + '\')"></div>' : '') +
          '<div class="carrito-item-info">' +
          '<p class="carrito-item-nombre">' + item.nombre + (detalle ? ' (' + detalle + ')' : '') + '</p>' +
          '<p class="carrito-item-precio">' + item.precio + '</p>' +
          '<div class="carrito-item-controles">' +
          '<button class="carrito-item-btn" data-accion="menos" data-id="' + item.id + '" data-talle="' + (item.talle || '') + '" data-color="' + (item.color || '') + '">−</button>' +
          '<span class="carrito-item-cantidad">' + item.cantidad + '</span>' +
          '<button class="carrito-item-btn" data-accion="mas" data-id="' + item.id + '" data-talle="' + (item.talle || '') + '" data-color="' + (item.color || '') + '">+</button>' +
          '<button class="carrito-item-eliminar" data-accion="eliminar" data-id="' + item.id + '" data-talle="' + (item.talle || '') + '" data-color="' + (item.color || '') + '">eliminar</button>' +
          '</div>' +
          '</div>' +
          '</div>';
        }).join("");
      }
    }

    const total = carrito.reduce((sum, item) => sum + precioNumero(item.precio) * item.cantidad, 0);
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (carritoTotalEl) carritoTotalEl.textContent = "Gs. " + total.toLocaleString("es-AR");
    if (carritoContadorEl) carritoContadorEl.textContent = String(cantidadTotal);
  }

  function agregarAlCarrito(producto) {
    if (!producto) return;
    const talle = producto.talle || "";
    const color = producto.color || "";
    const carrito = leerCarrito();
    const item = carrito.find((it) => it.id === producto.id && (it.talle || "") === talle && (it.color || "") === color);
    if (item) {
      item.cantidad += 1;
    } else {
      carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen || "", talle, color, cantidad: 1 });
    }
    guardarCarrito(carrito);
    renderCarrito();
    abrirCarrito();
  }

  function cambiarCantidad(id, talle, color, delta) {
    let carrito = leerCarrito();
    const item = carrito.find((it) => it.id === id && (it.talle || "") === talle && (it.color || "") === color);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) carrito = carrito.filter((it) => it !== item);
    guardarCarrito(carrito);
    renderCarrito();
  }

  function eliminarDelCarrito(id, talle, color) {
    const carrito = leerCarrito().filter((it) => !(it.id === id && (it.talle || "") === talle && (it.color || "") === color));
    guardarCarrito(carrito);
    renderCarrito();
  }

  if (carritoItemsEl) {
    carritoItemsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-accion]");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const talle = btn.dataset.talle || "";
      const color = btn.dataset.color || "";
      if (btn.dataset.accion === "mas") cambiarCantidad(id, talle, color, 1);
      if (btn.dataset.accion === "menos") cambiarCantidad(id, talle, color, -1);
      if (btn.dataset.accion === "eliminar") eliminarDelCarrito(id, talle, color);
    });
  }

  if (carritoComprarBtn) {
    carritoComprarBtn.addEventListener("click", () => {
      const carrito = leerCarrito();
      if (!carrito.length) return;
      const lineas = carrito.map((item) => {
        const detalle = [item.talle, item.color].filter(Boolean).join(", ");
        return "- " + item.nombre + (detalle ? " (" + detalle + ")" : "") + " x" + item.cantidad + " (" + item.precio + ")";
      });
      const total = carrito.reduce((sum, item) => sum + precioNumero(item.precio) * item.cantidad, 0);
      const mensaje = "Hola! Quiero hacer este pedido:\n" + lineas.join("\n") + "\nTotal: Gs. " + total.toLocaleString("es-AR");
      window.open("https://wa.me/595981751066?text=" + encodeURIComponent(mensaje), "_blank");
    });
  }

  window.Carrito = { agregar: agregarAlCarrito };

  window.addEventListener("pageshow", renderCarrito);
  renderCarrito();

  // Si venimos del botón "Continuar" del inicio, abrir el carrito directamente
  if (new URLSearchParams(window.location.search).get("carrito") === "1" && leerCarrito().length) {
    abrirCarrito();
  }
})();
