import { ImageSourcePropType } from 'react-native';

// 1. MAPA DE IMÁGENES LOCALES
// Ajustado a tus archivos reales: assets/avatars/boletin.png, etc.
export const AVATAR_MAP: Record<string, ImageSourcePropType> = {
    'boletin': require('@/assets/avatars/boletin.png'),
    'boletina': require('@/assets/avatars/boletina.png'),
    'logomisboletas': require('@/assets/avatars/logomisboletas.png'),
    // Puedes agregar más si subes más imágenes a esa carpeta
};

// Lista de claves para generar los botones de selección
export const AVATAR_KEYS = Object.keys(AVATAR_MAP);

// 2. FUNCIÓN INTELIGENTE
export const getAvatarSource = (avatarKey?: string | null): ImageSourcePropType => {
    // Si no hay dato, devolvemos el primero por defecto (boletin)
    if (!avatarKey) return AVATAR_MAP['boletin'];

    // Si empieza con http, es una URL de internet (ej: foto de Google)
    if (avatarKey.startsWith('http') || avatarKey.startsWith('file://')) {
        return { uri: avatarKey };
    }

    // Si es una clave local válida, la devolvemos. Si no, fallback a 'boletin'.
    return AVATAR_MAP[avatarKey] || AVATAR_MAP['boletin'];
};