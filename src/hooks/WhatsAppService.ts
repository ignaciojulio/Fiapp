import { App } from '@capacitor/app';
import { formatCOP } from '../utils/formatCOP';

type MessageType = 'receipt' | 'reminder';

interface WhatsAppParams {
  phone: string;
  clientName: string;
  type: MessageType;
  amount?: number; // Requerido para 'receipt'
  balance: number; // Requerido para 'reminder'
}

/**
 * Abre WhatsApp con un mensaje pre-redactado para el cliente.
 * @param params - Los detalles para construir el mensaje.
 */
export const sendWhatsAppMessage = async (
  params: WhatsAppParams
): Promise<void> => {
  const { phone, clientName, type, amount, balance } = params;

  let message = '';
  if (type === 'receipt' && amount) {
    message = `Hola ${clientName}, te confirmo la recepción de tu abono por un valor de ${formatCOP(amount)}. ¡Gracias por tu pago! Tu nuevo saldo es ${formatCOP(balance)}.`;
  } else if (type === 'reminder') {
    message = `Hola ${clientName}, te escribo para recordarte amablemente que tienes un saldo pendiente de ${formatCOP(balance)} en Mi Cartera. ¡Gracias!`;
  } else {
    console.error('Parámetros inválidos para WhatsAppService');
    return;
  }

  // Limpia el número de teléfono para el formato internacional de wa.me
  const cleanedPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;

  try {
    await App.openUrl({ url });
  } catch (error) {
    console.error('No se pudo abrir WhatsApp', error);
    alert('No se pudo abrir WhatsApp. Asegúrate de que esté instalado.');
  }
};
