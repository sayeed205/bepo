import type { NextFunction, Request, Response } from 'express';
import type { DeepPartial } from 'utility-types';

// More strictly typed express middleware type
export type ExpressMiddleware<
    ReqBody = Record<string, unknown>,
    Res = Record<string, unknown>,
    QueryString = Record<string, unknown>,
> = (
    req: TypedRequest<ReqBody, QueryString>,
    res: Response<Res>,
    next: NextFunction,
) => Promise<void> | void;

// More strictly typed express controller type
export type ExpressController<
    ReqBody = Record<string, unknown>,
    Res = Record<string, unknown>,
    QueryString = Record<string, unknown>,
> = (
    req: TypedRequest<ReqBody, QueryString>,
    res: Response<Res>
) => Promise<void | any> | void;

// More strictly typed Express.Request type
export type TypedRequest<
    ReqBody = Record<string, unknown>,
    QueryString = Record<string, unknown>,
> = Request<
    Record<string, unknown>,
    Record<string, unknown>,
    DeepPartial<ReqBody>,
    DeepPartial<QueryString>
>;


