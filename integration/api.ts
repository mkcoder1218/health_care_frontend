import { createResource } from "./createResource";
import { ClientLevelRoot } from "./types/clientLevel";

export const api = {
  auth: createResource("/api/auth/login"),
  profile: createResource("/api/auth/profile"),
  register: createResource("/api/auth/register"),
  ClientLevel: createResource<ClientLevelRoot>("/api/clientlevel"),
  ClientType: createResource<ClientLevelRoot>("/api/clienttypes"),
  role: createResource<ClientLevelRoot>("/api/role"),
  file: createResource<ClientLevelRoot>("/api/file/upload/upload"),
};
