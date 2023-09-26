export class TokenPayload {
  user_id: string;
}

export type RefreshTokenPayload = TokenPayload & { token_id: string };
