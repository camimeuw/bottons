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

  let talleSeleccionado = null;
  const talles = producto.talles ? producto.talles.split(',').map(t => t.trim()) : [];

  const fondoImg = producto.imagen
    ? "background-image:url('" + producto.imagen + "');background-size:cover;background-position:center;"
    : "background:" + producto.color + ";";

  let html =
    '<div class="producto-img" style="' + fondoImg + '"></div>' +
    '<h1 class="producto-nombre">' + producto.nombre + '</h1>' +
    '<p class="producto-precio">' + producto.precio + '</p>' +
    '<p class="producto-descripcion">' + producto.detalle + '</p>';

  if (talles.length > 0) {
    html += '<div class="producto-talles"><p class="producto-talles-label">Elegí tu talle:</p><div class="talles-grid">';
    talles.forEach(talle => {
      html += '<button class="talle-btn" data-talle="' + talle + '">' + talle + '</button>';
    });
    html += '</div></div>';
  }

  html += '<button class="producto-agregar" type="button" id="producto-agregar-btn">Agregar al Carrito</button>';

  page.innerHTML = html;

  const tallesBtns = document.querySelectorAll('.talle-btn');
  tallesBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tallesBtns.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      talleSeleccionado = btn.dataset.talle;
    });
  });

  const agregarBtn = document.getElementById("producto-agregar-btn");
  if (agregarBtn) {
    agregarBtn.addEventListener("click", () => {
      if (talles.length > 0 && !talleSeleccionado) {
        alert("Por favor elegí un talle ✦");
        return;
      }
      const productoConTalle = Object.assign({}, producto);
      if (talleSeleccionado) {
        productoConTalle.talle = talleSeleccionado;
      }
      if (window.Carrito) window.Carrito.agregar(productoConTalle);
    });
  }
})();
