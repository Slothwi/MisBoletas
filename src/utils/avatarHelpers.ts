import { ImageSourcePropType } from 'react-native';

// 1. MAPA DE IMÁGENES LOCALES
// La clave (izquierda) es lo que se guarda en la BD.
// El valor (derecha) es el archivo real en tu app.
// ¡Asegúrate de que los nombres de archivo coincidan con los que pusiste en la carpeta!
export const AVATAR_MAP: Record<string, ImageSourcePropType> = {
    'lego1': require('@/assets/images/avatars/lego1.png'),
    'lego2': require('@/assets/images/avatars/lego2.png'),
    'mujer1': require('@/assets/images/avatars/mujer1.png'),
    'hombre1': require('@/assets/images/avatars/hombre1.png'),
    // Puedes agregar más líneas aquí si añades más fotos
};

// Lista de claves para generar los botones de selección
export const AVATAR_KEYS = Object.keys(AVATAR_MAP);

// 2. FUNCIÓN INTELIGENTE
// Decide si mostrar una imagen local o una URL de internet
export const getAvatarSource = (avatarKey?: string | null): ImageSourcePropType => {
    // Si no hay dato, devolvemos el primero por defecto
    if (!avatarKey) return AVATAR_MAP['lego1'];

    // Si empieza con http, es una URL de internet (ej: foto de Google o antigua)
    if (avatarKey.startsWith('http') || avatarKey.startsWith('file://')) {
        return { uri: avatarKey };
    }

    // Si no es URL, buscamos en nuestro mapa local.
    // Si la clave no existe (ej: borraste la imagen), devolvemos el default 'lego1'
    return AVATAR_MAP[avatarKey] || AVATAR_MAP['lego1'];
};