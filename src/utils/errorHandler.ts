/**
 * Error handler utility for better error logging and debugging
 */

export interface ErrorDetails {
  message: string;
  code?: string;
  status?: number;
  originalError?: unknown;
  context?: Record<string, unknown>;
}

export const parseSupabaseError = (error: unknown): ErrorDetails => {
  if (error instanceof Error) {
    // Check if it's a Supabase error
    if ('code' in error || 'status' in error) {
      return {
        message: error.message,
        code: 'code' in error ? String(error.code) : undefined,
        status: 'status' in error ? Number(error.status) : undefined,
        originalError: error,
      };
    }
    
    // Check for common error patterns
    const message = error.message.toLowerCase();
    
    if (message.includes('bad request') || message.includes('400')) {
      return {
        message: 'Solicitud inválida. Verifica que las variables de entorno estén configuradas correctamente.',
        code: 'BAD_REQUEST',
        status: 400,
        originalError: error,
      };
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return {
        message: 'No autorizado. Verifica tus credenciales de Supabase.',
        code: 'UNAUTHORIZED',
        status: 401,
        originalError: error,
      };
    }
    
    if (message.includes('forbidden') || message.includes('403')) {
      return {
        message: 'Acceso prohibido. Verifica los permisos de tu usuario.',
        code: 'FORBIDDEN',
        status: 403,
        originalError: error,
      };
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return {
        message: 'Recurso no encontrado.',
        code: 'NOT_FOUND',
        status: 404,
        originalError: error,
      };
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        message: 'Error de conexión. Verifica tu conexión a internet y la URL de Supabase.',
        code: 'NETWORK_ERROR',
        originalError: error,
      };
    }
    
    return {
      message: error.message,
      originalError: error,
    };
  }
  
  return {
    message: 'Error desconocido',
    originalError: error,
  };
};

export const logError = (error: unknown, context?: Record<string, unknown>) => {
  const errorDetails = parseSupabaseError(error);
  
  console.error('🚨 Error:', {
    ...errorDetails,
    context,
    timestamp: new Date().toISOString(),
  });
  
  // Log to console with more details in development
  if (import.meta.env.DEV) {
    console.group('Error Details');
    console.error('Message:', errorDetails.message);
    if (errorDetails.code) console.error('Code:', errorDetails.code);
    if (errorDetails.status) console.error('Status:', errorDetails.status);
    if (context) console.error('Context:', context);
    if (errorDetails.originalError) console.error('Original Error:', errorDetails.originalError);
    console.groupEnd();
  }
  
  return errorDetails;
};

export const getUserFriendlyMessage = (error: unknown): string => {
  const errorDetails = parseSupabaseError(error);
  return errorDetails.message;
};

