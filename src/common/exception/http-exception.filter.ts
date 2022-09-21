import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const rp = exception.getResponse();    
    let message: Array<string> = [];
    if(typeof rp === "string"){
        message = [rp];
    }else if(Array.isArray(rp)){
      message = rp;
    }else{
        const a = new Object(rp);
        if(a.hasOwnProperty('message')){
            if( Array.isArray( a['message'] ) ){
                message = [...a['message']]
            }else{
                message = [a['message']]
            }
        }
    }

    response
      .status(status)
      .json({
        status: false,
        message
      });
  }
}