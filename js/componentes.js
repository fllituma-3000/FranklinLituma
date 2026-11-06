import { formatoDinero, buscarProducto } from './calculos.js';
import { estado } from './estado.js';

export function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("producto");
  tarjeta.dataset.id = producto.id;

  const enCarrito = estado.carrito.some((i) => i.id === producto.id);
  tarjeta.classList.toggle("en-carrito", enCarrito);

  const categoria = document.createElement("span");
  categoria.classList.add("categoria");
  categoria.textContent = producto.categoria;

  const nombre = document.createElement("span");
  nombre.classList.add("nombre");
  nombre.textContent = producto.nombre;

  const precio = document.createElement("span");
  precio.classList.add("precio");
  precio.textContent = formatoDinero(producto.precio);

  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = enCarrito ? "✓ Agregar otro" : "Agregar";

  tarjeta.append(categoria, nombre, precio, boton);
  return tarjeta;
}

export function crearItemCarrito(item) {
  const producto = buscarProducto(item.id);
  const li = document.createElement("li");
  li.classList.add("item");
  li.dataset.id = item.id;

  const detalle = document.createElement("div");
  detalle.classList.add("detalle");
  const nombre = document.createElement("strong");
  nombre.textContent = producto.nombre;
  const linea = document.createElement("small");
  linea.textContent = `${formatoDinero(producto.precio)} × ${item.cantidad} = ${formatoDinero(producto.precio * item.cantidad)}`;
  detalle.append(nombre, linea);

  const cantidad = document.createElement("div");
  cantidad.classList.add("cantidad");
  const menos = document.createElement("button");
  menos.type = "button";
  menos.dataset.accion = "menos";
  menos.textContent = "−";
  const numero = document.createElement("span");
  numero.textContent = item.cantidad;
  const mas = document.createElement("button");
  mas.type = "button";
  mas.dataset.accion = "mas";
  mas.textContent = "+";
  cantidad.append(menos, numero, mas);

  const quitarBtn = document.createElement("button");
  quitarBtn.type = "button";
  quitarBtn.classList.add("quitar");
  quitarBtn.dataset.accion = "quitar";
  quitarBtn.title = "Quitar del carrito";
  quitarBtn.textContent = "✕";

  li.append(detalle, cantidad, quitarBtn);
  return li;
}

export function lineaResumen(etiqueta, valor, clase) {
  const div = document.createElement("div");
  div.classList.add("linea");
  if (clase) div.classList.add(clase);
  const a = document.createElement("span");
  a.textContent = etiqueta;
  const b = document.createElement("span");
  b.textContent = valor;
  div.append(a, b);
  return div;
}