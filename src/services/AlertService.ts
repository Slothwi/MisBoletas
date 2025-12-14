import { apiService } from './api';

export interface AlertsSummary {
    total_alerts: number;
    urgency_breakdown: {
        CRITICA: number; // 0 días (hoy) o vencidos
        ALTA: number;    // 1-3 días
        MEDIA: number;   // 4-7 días
        BAJA: number;    // >7 días (no se usa mucho en alertas críticas)
    };
    total_products: number;
    timestamp?: string;
}

class AlertService {
    /**
     * Obtiene el resumen de alertas de vencimiento.
     * Endpoint: GET /alertas/resumen
     */
    async getSummary(): Promise<AlertsSummary> {
        try {
        const response = await apiService.get<AlertsSummary>('/alertas/resumen');
        return response;
        } catch (error) {
        console.error('Error fetching alerts summary:', error);
        // Retornar objeto vacío seguro en caso de error para no romper la UI
        return {
            total_alerts: 0,
            urgency_breakdown: { CRITICA: 0, ALTA: 0, MEDIA: 0, BAJA: 0 },
            total_products: 0
        };
        }
    }
}

export const alertService = new AlertService();
export default alertService;