let PRODUCTOS = [];

// Parsea CSV respetando campos entre comillas que pueden contener comas
function parsearCSV(texto) {
  const filas = [];
  let fila = [];
  let campo = '';
  let entreComillas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    const siguiente = texto[i + 1];

    if (entreComillas) {
      if (c === '"' && siguiente === '"') {
        campo += '"';
        i++;
      } else if (c === '"') {
        entreComillas = false;
      } else {
        campo += c;
      }
    } else {
      if (c === '"') {
        entreComillas = true;
      } else if (c === ',') {
        fila.push(campo.trim());
        campo = '';
      } else if (c === '\n') {
        fila.push(campo.trim());
        filas.push(fila);
        fila = [];
        campo = '';
      } else if (c === '\r') {
        // ignorar
      } else {
        campo += c;
      }
    }
  }
  if (campo.length > 0 || fila.length > 0) {
    fila.push(campo.trim());
    filas.push(fila);
  }
  return filas;
}

// Quita tildes/acentos y pasa a minúsculas para poder comparar encabezados
function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

// Convierte links de Google Drive (compartir) a un link de imagen directo
function convertirLinkImagen(url) {
  url = url.trim();
  if (!url) return '';
  const match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
  if (match) {
    return 'https://drive.google.com/thumbnail?id=' + match[1] + '&sz=w1000';
  }
  return url;
}

// Alias posibles para cada columna, por si la planilla usa otro nombre
const ALIAS_COLUMNAS = {
  id: ['id'],
  nombre: ['nombre', 'producto', 'titulo', 'title', 'name'],
  precio: ['precio', 'price'],
  color: ['color'],
  imagen: ['imagen', 'imagenes', 'foto', 'fotos', 'image', 'images', 'photo', 'photos'],
  detalle: ['detalle', 'descripcion', 'description', 'detalles'],
  categoria: ['categoria', 'category'],
  subcategoria: ['subcategoria', 'sub categoria', 'subcategory'],
  talles: ['talles', 'talle', 'size', 'sizes', 'tamanos', 'tamanio'],
  stock: ['stock', 'inventario', 'cantidad', 'disponible', 'cantidad disponible']
};

function buscarIndice(indicePorNombre, campo) {
  const alias = ALIAS_COLUMNAS[campo] || [campo];
  for (const nombre of alias) {
    if (indicePorNombre[nombre] !== undefined) return indicePorNombre[nombre];
  }
  return undefined;
}

// Cargar productos desde Google Sheets
(function() {
  const SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQqRiySa4HmpusvqyxqkTKpIAGR-FXnlDRbDOQyEyRq9Dh-0xhn1IOnp3v6bbc4KW-G9LRwfnaC-_fA/pub?output=csv";

  fetch(SHEETS_URL)
    .then(response => response.text())
    .then(csv => {
      const filas = parsearCSV(csv.trim());
      if (filas.length < 2) return;

      // Parsear encabezados (ignorando tildes, mayúsculas y espacios)
      const encabezados = filas[0].map(h => normalizar(h));
      const indicePorNombre = {};
      encabezados.forEach((enc, idx) => {
        indicePorNombre[enc] = idx;
      });

      const iId = buscarIndice(indicePorNombre, 'id');
      const iNombre = buscarIndice(indicePorNombre, 'nombre');
      const iPrecio = buscarIndice(indicePorNombre, 'precio');
      const iColor = buscarIndice(indicePorNombre, 'color');
      const iImagen = buscarIndice(indicePorNombre, 'imagen');
      const iDetalle = buscarIndice(indicePorNombre, 'detalle');
      const iCategoria = buscarIndice(indicePorNombre, 'categoria');
      const iSubcategoria = buscarIndice(indicePorNombre, 'subcategoria');
      const iTalles = buscarIndice(indicePorNombre, 'talles');
      const iStock = buscarIndice(indicePorNombre, 'stock');

      // Parsear filas
      for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];

        const id = Number(fila[iId] || i);
        const nombre = fila[iNombre] || '';
        const precio = fila[iPrecio] || '$0';
        const color = fila[iColor] || '#ffd6ea';
        const imagenesRaw = fila[iImagen] || '';
        const imagenes = imagenesRaw.split(',').map(u => convertirLinkImagen(u)).filter(u => u);
        const imagen = imagenes[0] || '';
        const detalle = fila[iDetalle] || '';
        const categoria = fila[iCategoria] || '';
        const subcategoria = fila[iSubcategoria] || '';
        const talles = fila[iTalles] || '';
        const stock = iStock !== undefined ? Number(fila[iStock] || 0) : undefined;

        if (nombre) {
          PRODUCTOS.push({
            id,
            nombre,
            precio,
            color,
            imagen,
            imagenes,
            detalle,
            categoria,
            subcategoria,
            talles,
            ...(stock !== undefined && { stock })
          });
        }
      }

      // Disparar evento para que otros scripts sepan que los productos cargaron
      window.dispatchEvent(new Event('productosLoaded'));
    })
    .catch(() => {
      // Si falla, usar productos de fallback
      PRODUCTOS = [
        { id: 1, nombre: "Top Y2K Estrella", precio: "$8.000", color: "#ffd6ea", detalle: "Talles: S, M, L. Tela stretch, corte cropped.", categoria: "Alt & Y2K", subcategoria: "Tops/mangas largas/remeras", talles: "S, M, L", stock: 5 },
        { id: 2, nombre: "Campera Vintage", precio: "$15.000", color: "#d6197d", detalle: "Talle único. Pieza de archivo, buen estado.", categoria: "Vintage & 2nd Hand", subcategoria: "Camperas", talles: "Única", stock: 1 },
        { id: 3, nombre: "Minifalda Soft", precio: "$10.000", color: "#ff8fc0", detalle: "Talles: S, M. Tiro alto, lazo lateral.", categoria: "Soft & Polka Dots", subcategoria: "Minifaldas", talles: "S, M", stock: 3 },
        { id: 4, nombre: "Bolso Grunge", precio: "$12.000", color: "#fff0f6", detalle: "Cuerina negra, correa ajustable.", categoria: "Midwest & Grunge", subcategoria: "Bolsos", talles: "", stock: 2 },
        { id: 5, nombre: "Peluche Minecraft", precio: "$6.000", color: "#ffb3d1", detalle: "20cm, bordado, edición limitada.", categoria: "Coleccionables y Otros", subcategoria: "Peluches", talles: "", stock: 0 },
        { id: 6, nombre: "Carcasa Horror Game", precio: "$5.000", color: "#ffd6ea", detalle: "Compatible iPhone y Android.", categoria: "Coleccionables y Otros", subcategoria: "Carcasas", talles: "", stock: 8 }
      ];
      window.dispatchEvent(new Event('productosLoaded'));
    });
})();

const CATEGORIAS_TIENDA = ["Alt & Y2K", "Soft & Polka Dots", "Vintage & 2nd Hand", "Midwest & Grunge", "Conjuntos Completos", "Coleccionables y Otros"];

const ROPA = ["Tops/mangas largas/remeras", "Camperas", "Minifaldas", "Zapatos", "Accesorios", "Pantalones", "Shorts", "Bolsos", "Bikinis", "Vestidos"];
const ROPA_SIN_BIKINI = ["Tops/mangas largas/remeras", "Camperas", "Minifaldas", "Zapatos", "Accesorios", "Pantalones", "Shorts", "Bolsos", "Vestidos"];
const MIDWEST = ["Tops", "Camperas", "Minifaldas", "Zapatos", "Accesorios", "Pantalones", "Shorts", "Bolsos", "Vestidos"];

const SUBCATEGORIAS_TIENDA = {
  "Alt & Y2K": ROPA,
  "Soft & Polka Dots": ROPA,
  "Vintage & 2nd Hand": ROPA_SIN_BIKINI,
  "Midwest & Grunge": MIDWEST,
  "Conjuntos Completos": ["Alt & Y2k", "Soft & polka dots", "2nd hand", "Midwest & grunge", "Horror game protagonist", "Harajuku", "Halloween"],
  "Coleccionables y Otros": ["Coleccionables", "DVD's", "Merch", "Frazadas", "Tapices decorativos", "Objetos decorativos", "Peluches", "Llaveros", "Carcasas"]
};
