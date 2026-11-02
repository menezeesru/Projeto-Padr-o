import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error("API_ERROR:", err);
  const status = err.status || 500;
  const message = err.message || "Erro interno do servidor";
  res.status(status).json({ error: message });
}
