import { AuthUser } from "./auth-user";

export interface AuthUserStore {
    save(user: AuthUser): Promise<void>
    get(id: string): Promise<AuthUser>
}
