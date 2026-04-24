import type { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository.js";
import { DEFAULT_USER } from "../services/user-context.js";

export function createUserContextMiddleware(userRepository: UserRepository) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const user = await userRepository.getOrCreateImplicitUser(DEFAULT_USER.email, DEFAULT_USER.name);

      request.user = {
        id: user.id,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
