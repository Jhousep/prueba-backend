import jwt from "jsonwebtoken";
import isTokenExpired from "./tokenExpired.js";


function verifyAccessToken(token){
    // Verificar si el token ha expirado antes de intentar verificarlo
    if (isTokenExpired(token)) {
        console.error('El token de acceso ha expirado.');
        return null

    }
    // El token no ha expirado, proceder a verificarlo
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token){
    // Verificar si el token ha expirado antes de intentar verificarlo
    if (isTokenExpired(token)) {
        console.error('El token de refresco ha expirado.');
       return null
    }

    // El token no ha expirado, proceder a verificarlo
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

export { verifyAccessToken, verifyRefreshToken };