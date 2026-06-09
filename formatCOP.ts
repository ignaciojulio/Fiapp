/**
 * Formatea un número como moneda colombiana (COP), sin decimales
 * y redondeado al múltiplo de 50 más cercano.
 *
 * @param amount El monto a formatear.
 * @returns El monto formateado como string, ej: "$18.500".
 */
export const formatCOP = (amount: number): string => {
  const roundedAmount = Math.round(amount / 50) * 50;
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  // El formateador para 'es-CO' puede agregar un espacio: "$ 1.000". Lo eliminamos.
  return formatter.format(roundedAmount).replace(/\s/g, '');
};
