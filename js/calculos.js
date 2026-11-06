import { IVA, catalogo } from './datos.js';
import { estado } from './estado.js';

export const formatoDinero = (valor) => `$${valor.toFixed(2)}`;

export function porcentajeDescuento(unidades) {
  if (unidades >= 10) return 0.10;
  if (unidades >= 5) return 0.05;
  return 0;
}

export function costoEnvio(tipo) {
  switch (tipo) {
    case "cuenca": return 2.5;
    case "nacional": return 6;
    default: return 0;
  }
}

export const buscarProducto = (id) => catalogo.find((p) => p.id === id);

export function totalUnidades() {
  let unidades = 0;
  for (const item of estado.carrito) unidades += item.cantidad;
  return unidades;
}

export function calcularTotales() {
  let subtotal = 0;
  for (const item of estado.carrito) {
    subtotal += buscarProducto(item.id).precio * item.cantidad;
  }
  const descuento = subtotal * porcentajeDescuento(totalUnidades());
  const envio = estado.carrito.length > 0 ? costoEnvio(estado.envio) : 0;
  const base = subtotal - descuento + envio;
  const iva = base * IVA;
  return { subtotal, descuento, envio, iva, total: base + iva };
}