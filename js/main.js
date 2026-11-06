import { estado } from './estado.js';
import { dom } from './dom.js';
import { render, renderCatalogo, renderResumen } from './render.js';
import { calcularTotales, formatoDinero } from './calculos.js';

// Funciones que cambian el estado
export function agregar(id) {
  const item = estado.carrito.find((i) => i.id === id);
  if (item) {
    item.cantidad++;
  } else {
    estado.carrito.push({ id: id, cantidad: 1 });
  }
}

export function cambiarCantidad(id, cambio) {
  const item = estado.carrito.find((i) => i.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) quitar(id);
  }
}

export function quitar(id) {
  estado.carrito = estado.carrito.filter((i) => i.id !== id);
}

// Eventos
dom.inputBuscar.addEventListener("input", () => {
  estado.busqueda = dom.inputBuscar.value.trim();
  renderCatalogo();
});

dom.selectCategoria.addEventListener("change", () => {
  estado.categoria = dom.selectCategoria.value;
  renderCatalogo();
});

dom.contCatalogo.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");
  if (!boton) return;
  const id = Number(boton.closest(".producto").dataset.id);
  agregar(id);
  dom.mensaje.hidden = true;
  render();
});

function manejarAccionCarrito(evento) {
  const boton = evento.target.closest("button");
  if (!boton) return;
  const id = Number(boton.closest(".item").dataset.id);
  const accion = boton.dataset.accion;
  if (accion === "mas") cambiarCantidad(id, 1);
  if (accion === "menos") cambiarCantidad(id, -1);
  if (accion === "quitar") quitar(id);
  render();
}

dom.listaCarrito.addEventListener("click", manejarAccionCarrito);
if (dom.dropdownLista) dom.dropdownLista.addEventListener("click", manejarAccionCarrito);

dom.selectEnvio.addEventListener("change", () => {
  estado.envio = dom.selectEnvio.value;
  renderResumen();
});

dom.btnVaciar.addEventListener("click", () => {
  estado.carrito = [];
  render();
});

dom.btnConfirmar.addEventListener("click", () => {
  const total = calcularTotales().total;
  estado.pedidos++;
  const numero = String(estado.pedidos).padStart(3, "0");
  dom.mensaje.textContent = `✅ Pedido #${numero} confirmado por ${formatoDinero(total)}. ¡Gracias por tu compra!`;
  dom.mensaje.hidden = false;
  estado.carrito = [];
  render();
});

// Control del menú desplegable
if (dom.btnToggle && dom.dropdown) {
  dom.btnToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dom.dropdown.classList.toggle('activo');
  });

  document.addEventListener('click', (e) => {
    if (!dom.dropdown.contains(e.target) && !dom.btnToggle.contains(e.target)) {
      dom.dropdown.classList.remove('activo');
    }
  });
}

// Primer dibujo
render();