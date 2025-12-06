import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface CreateTicketRequest {
  asunto: string;
  mensaje: string;
}

export interface TicketResponse {
  id_ticket: string;
  id_usuario: string;
  asunto: string;
  mensaje: string;
  estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta';
  fecha_creacion: string;
}

class TicketService {
  /**
   * Crear un nuevo ticket de soporte
   */
  async createTicket(asunto: string, mensaje: string): Promise<TicketResponse> {
    try {
      console.log('📝 [TicketService] Creando ticket:', { asunto });

      if (!asunto || asunto.trim().length === 0) {
        throw new Error('El asunto no puede estar vacío');
      }

      if (!mensaje || mensaje.trim().length === 0) {
        throw new Error('El mensaje no puede estar vacío');
      }

      const endpoint = API_ENDPOINTS.tickets.create || '/tickets';
      
      const response = await apiService.post<TicketResponse>(endpoint, {
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
      });

      console.log('✅ [TicketService] Ticket creado exitosamente:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [TicketService] Error creando ticket:', error);
      throw new Error(error.message || 'Error al crear el ticket. Intenta de nuevo.');
    }
  }

  /**
   * Obtener mis tickets
   */
  async getMyTickets(): Promise<TicketResponse[]> {
    try {
      console.log('📂 [TicketService] Obteniendo mis tickets');

      const endpoint = API_ENDPOINTS.tickets.list || '/tickets';
      const response = await apiService.get<TicketResponse[]>(endpoint);

      console.log('✅ [TicketService] Tickets obtenidos:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [TicketService] Error obteniendo tickets:', error);
      throw new Error('Error al obtener los tickets. Intenta de nuevo.');
    }
  }

  /**
   * Obtener detalle de un ticket
   */
  async getTicketById(ticketId: string): Promise<TicketResponse> {
    try {
      console.log('📋 [TicketService] Obteniendo ticket:', ticketId);

      const endpoint = API_ENDPOINTS.tickets.detail?.replace('{id}', ticketId) || `/tickets/${ticketId}`;
      const response = await apiService.get<TicketResponse>(endpoint);

      console.log('✅ [TicketService] Ticket obtenido:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [TicketService] Error obteniendo ticket:', error);
      throw new Error('Error al obtener el ticket. Intenta de nuevo.');
    }
  }
}

// Exportar instancia singleton
export const ticketService = new TicketService();
