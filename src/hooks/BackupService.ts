import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import type { Client } from '../domain/entities/Client';

/**
 * Exporta la lista de clientes a un archivo JSON y lo guarda en el dispositivo.
 * @param clients - El array de clientes a respaldar.
 * @returns El path del archivo guardado o null en caso de error.
 */
export const exportClientsToJson = async (
  clients: Client[]
): Promise<string | null> => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup-mi-cartera-${timestamp}.json`;
    const jsonContent = JSON.stringify(clients, null, 2);

    const result = await Filesystem.writeFile({
      path: fileName,
      data: jsonContent,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
      recursive: true, // Crea el directorio si no existe
    });

    console.log('Backup guardado en:', result.uri);
    alert(`Respaldo guardado con éxito en tus Documentos como:\n${fileName}`);
    return result.uri;
  } catch (error) {
    console.error('Error al guardar el respaldo:', error);
    alert('Hubo un error al intentar guardar el respaldo.');
    return null;
  }
};
