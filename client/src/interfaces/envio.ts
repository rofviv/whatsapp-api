export  interface Envio {
    telefono: string;
    estatus: string;
}


export const ESTATUS_ENVIO = {
    INITIAL:  'En Espera',
    SUCCESS: 'Enviado',
    NOT_EXISTS: 'No Existe Numero',
    ERROR: 'Error al enviar',
    NOT_NUMBER: 'No es un numero'
}