import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
const customResponse : (
    res : Response,
    statusCode : number,
    message : string | string[],
    isOk : boolean,
    data? : object
) => Response<unknown, Record<any, string>> = (
    res : Response,
    statusCode : number,
    message : string | string[],
    isOk : boolean,
    data? : object
) => { return res.status( statusCode ).json({
    isOk,
    statusCode,
    message,
    data
})}

const ok : (
    res : Response,
    message : string | string[],
    data : object
) => Response<unknown, Record<any, string>> = (
    res : Response,
    message : string | string[],
    data : object
) => customResponse( res, StatusCodes.OK, message, true, data );

const created : (
    res : Response,
    message : string | string[],
    data : object
) =>  Response<unknown, Record<any, string>> = (
    res : Response,
    message : string | string[], 
    data : object
) => customResponse( res, StatusCodes.CREATED, message, true, data );

const badRequest : ( 
    res : Response,
    message : string | string[]
) => Response<unknown, Record<any, string>> = (
    res : Response,
    message : string | string[]
) => customResponse( res, StatusCodes.BAD_REQUEST, message, false );

const unauthorized : (
    res : Response,
    message : string | string[]
) => Response<unknown, Record<any, string>> = (
    res : Response,
    message : string | string[]
) => customResponse( res, StatusCodes.UNAUTHORIZED, message, false );

const forbidden : (
    res : Response,
    message : string | string[]
) => Response<unknown, Record<any, string>> = (
    res : Response,
    message : string | string[]
) => customResponse( res, StatusCodes.FORBIDDEN, message, false );

const notFound : (
    res : Response,
    message : string | string[]
) => Response<unknown, Record<any, string>> = (
    res : Response,
    message : string | string[]
) => customResponse( res, StatusCodes.NOT_FOUND, message, false );

const conflict : (
    res : Response,
    message : string | string[]
) => Response<unknown, Record<any, string>> = (
    res : Response,
    message : string | string[]
) => customResponse( res, StatusCodes.CONFLICT, message, false );

const internalServerError : (
    res : Response,
    message : string | string[]
) => Response<unknown, Record<any, string>> = (
    res : Response,
    message : string | string[]
) => customResponse( res, StatusCodes.INTERNAL_SERVER_ERROR, message, false );

export default {
    ok,
    created,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    conflict,
    internalServerError
}

