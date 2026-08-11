(function () {
  const page = document.getElementById("producto-page");
  if (!page || typeof PRODUCTOS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const producto = PRODUCTOS.find((p) => p.id === id);

  if (!producto) {
    page.innerHTML = '<p class="producto-no-encontrado">No encontramos este producto ✦</p>';
    return;
  }

  document.title = "Buttons — " + producto.nombre;

  page.innerHTML =
    '<div class="producto-img" style="background:' + producto.color + '"></div>' +
    '<h1 class="producto-nombre">' + producto.nombre + '</h1>' +
    '<p class="producto-precio">' + producto.precio + '</p>' +
    '<p class="producto-descripcion">' + producto.detalle + '</p>' +
    '<button class="producto-agregar" type="button" id="producto-agregar-btn">Agregar al Carrito</button>';

  const agregarBtn = document.getElementById("producto-agregar-btn");
  if (agregarBtn) {
    agregarBtn.addEventListener("click", () => {
      if (window.Carrito) window.Carrito.agregar(producto);
    });
  }
})();
