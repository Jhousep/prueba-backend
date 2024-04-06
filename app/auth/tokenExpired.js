import jwt from "jsonwebtoken";

export default function isTokenExpired(token) {
    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
        // El token no es válido o no es un token JWT
        return true;
    }
    // Obtener la fecha de expiración del token
    const expirationDate =  new Date(decodedToken.exp * 1000); // Convertir de segundos a milisegundos

    // Verificar si la fecha de expiración es anterior a la fecha actual
    return expirationDate < new Date();
}