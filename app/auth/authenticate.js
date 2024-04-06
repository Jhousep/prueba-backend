import getTokenFromHeader from "../auth/getTokenFromHeader.js";
import { verifyAccessToken } from "./verifyToken.js";

export default function authenticate(req, res, next)
{
    const token = getTokenFromHeader(req.headers);

    if(token)
    {
        const decoded = verifyAccessToken(token)

        if(decoded)
        {
            req.user = {... decoded.user}
            next()
            
        }else{
            res
            .status(401)
            .send({ statusCode: 401, message: "No hay token proporcionado" });
        }
    }
    else{
        res
        .status(401)
        .send({ statusCode: 401, message: "No hay token proporcionado" });
    }
}