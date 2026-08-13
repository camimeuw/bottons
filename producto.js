(function () {
  const page = document.getElementById("producto-page");
  if (!page || typeof PRODUCTOS === "undefined") return;

  function render() {
    if (!PRODUCTOS.length) return;
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
    const imagenes = producto.imagenes && producto.imagenes.length ? producto.imagenes : [];

    function fondoDe(url) {
      return url
        ? "background-image:url('" + url + "');background-size:cover;background-position:center;"
        : "background:" + producto.color + ";";
    }

    let html = '<div class="producto-img" id="producto-img-principal" style="' + fondoDe(imagenes[0]) + '"></div>';

    if (imagenes.length > 1) {
      html += '<div class="producto-miniaturas">';
      imagenes.forEach((url, idx) => {
        html += '<div class="producto-miniatura' + (idx === 0 ? ' activa' : '') + '" data-url="' + url + '" style="background-image:url(\'' + url + '\');background-size:cover;background-position:center;"></div>';
      });
      html += '</div>';
    }

    html +=
      '<h1 class="producto-nombre">' + producto.nombre + '</h1>' +
      '<p class="producto-precio">' + producto.precio + '</p>' +
      (producto.stock !== undefined ? '<p class="producto-stock">' + (producto.stock === 0 ? 'agotado ✦' : 'disponible: ' + producto.stock + ' unidades') + '</p>' : '') +
      '<p class="producto-descripcion">' + producto.detalle + '</p>';

    if (talles.length > 0) {
      html += '<div class="producto-talles"><p class="producto-talles-label">Elegí tu talle:</p><div class="talles-grid">';
      talles.forEach(talle => {
        html += '<button class="talle-btn" data-talle="' + talle + '">' + talle + '</button>';
      });
      html += '</div></div>';
    }

    html += '<button class="producto-agregar' + (producto.stock === 0 ? ' agotado' : '') + '" type="button" id="producto-agregar-btn"' + (producto.stock === 0 ? ' disabled' : '') + '>' + (producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito') + '</button>';

    page.innerHTML = html;

    const imgPrincipal = document.getElementById('producto-img-principal');
    const miniaturas = document.querySelectorAll('.producto-miniatura');
    miniaturas.forEach(mini => {
      mini.addEventListener('click', () => {
        imgPrincipal.style.cssText = fondoDe(mini.dataset.url);
        miniaturas.forEach(m => m.classList.remove('activa'));
        mini.classList.add('activa');
      });
    });

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
  }

  if (PRODUCTOS.length) {
    render();
  }
  window.addEventListener("productosLoaded", render);
})();
