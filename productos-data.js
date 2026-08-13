const PRODUCTOS = [
  { id: 1, nombre: "Top Y2K Estrella", precio: "$8.000", color: "#ffd6ea", detalle: "Talles: S, M, L. Tela stretch, corte cropped.", categoria: "Alt & Y2K", subcategoria: "Tops/mangas largas/remeras" },
  { id: 2, nombre: "Campera Vintage", precio: "$15.000", color: "#d6197d", detalle: "Talle único. Pieza de archivo, buen estado.", categoria: "Vintage & 2nd Hand", subcategoria: "Camperas" },
  { id: 3, nombre: "Minifalda Soft", precio: "$10.000", color: "#ff8fc0", detalle: "Talles: S, M. Tiro alto, lazo lateral.", categoria: "Soft & Polka Dots", subcategoria: "Minifaldas" },
  { id: 4, nombre: "Bolso Grunge", precio: "$12.000", color: "#fff0f6", detalle: "Cuerina negra, correa ajustable.", categoria: "Midwest & Grunge", subcategoria: "Bolsos" },
  { id: 5, nombre: "Peluche Minecraft", precio: "$6.000", color: "#ffb3d1", detalle: "20cm, bordado, edición limitada.", categoria: "Coleccionables y Otros", subcategoria: "Peluches" },
  { id: 6, nombre: "Carcasa Horror Game", precio: "$5.000", color: "#ffd6ea", detalle: "Compatible iPhone y Android.", categoria: "Coleccionables y Otros", subcategoria: "Carcasas" }
];

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
