import { catalogo } from './datos.js';
import { estado } from './estado.js';
import { dom } from './dom.js';
import { calcularTotales, totalUnidades, formatoDinero } from './calculos.js';
import { crearTarjetaProducto, crearItemCarrito, lineaResumen } from './componentes.js';

export function renderCatalogo() {
  const texto = estado.busqueda.toLowerCase();
  const visibles = catalogo.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(texto);
    const coincideCategoria = estado.categoria === "todas" || p.categoria === estado.categoria;
    return coincideTexto && coincideCategoria;
  });

  dom.contCatalogo.replaceChildren();
  for (const producto of visibles) {
    dom.contCatalogo.append(crearTarjetaProducto(producto));
  }
  dom.sinResultados.hidden = visibles.length > 0;
}

export function renderCarrito() {
  dom.listaCarrito.replaceChildren();
  if (dom.dropdownLista) dom.dropdownLista.replaceChildren();

  for (const item of estado.carrito) {
    dom.listaCarrito.append(crearItemCarrito(item));
    if (dom.dropdownLista) dom.dropdownLista.append(crearItemCarrito(item));
  }
  
  const vacio = estado.carrito.length === 0;
  dom.carritoVacio.hidden = !vacio;
  if (dom.dropdownVacio) dom.dropdownVacio.hidden = !vacio;

  dom.btnConfirmar.disabled = vacio;
  dom.btnVaciar.disabled = vacio;
}

export function renderResumen() {
  const t = calcularTotales();
  const unidades = totalUnidades();
  
  const contenidoResumen = [
    lineaResumen(`Subtotal (${unidades} u.)`, formatoDinero(t.subtotal)),
    lineaResumen("Descuento", t.descuento > 0 ? `- ${formatoDinero(t.descuento)}` : "No aplica", "descuento"),
    lineaResumen("Envío", formatoDinero(t.envio)),
    lineaResumen("IVA (15 %)", formatoDinero(t.iva)),
    lineaResumen("Total", formatoDinero(t.total), "total")
  ];

  dom.resumen.replaceChildren(...contenidoResumen);
  
  if (dom.dropdownResumen) {
    dom.dropdownResumen.replaceChildren(lineaResumen("Total", formatoDinero(t.total), "total"));
  }
}

export function renderBadge() {
  const anterior = dom.badge.textContent;
  dom.badge.textContent = totalUnidades();
  if (dom.badge.textContent !== anterior) {
    dom.badge.classList.remove("pulso");
    void dom.badge.offsetWidth; 
    dom.badge.classList.add("pulso");
  }
}

export function render() {
  renderCatalogo();
  renderCarrito();
  renderResumen();
  renderBadge();
}