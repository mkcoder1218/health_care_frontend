import { createResource } from "./createResource";
import { ClientLevelRoot } from "./types/clientLevel";

export const api = {
  auth: createResource("/api/auth/login"),
  profile: createResource("/api/auth/profile"),
  register: createResource("/api/auth/register"),
  ClientLevel: createResource<ClientLevelRoot>("/api/clientlevel"),
  ClientType: createResource<ClientLevelRoot>("/api/clienttypes"),
  role: createResource<ClientLevelRoot>("/api/role"),
  user: createResource<ClientLevelRoot>("/api/user"),
  file: createResource<ClientLevelRoot>("/api/file/upload/upload"),
  booking: createResource<ClientLevelRoot>("/api/booking"),
  myBookings: createResource<ClientLevelRoot>("/api/booking/my-bookings"),
  professionalBookings: createResource<ClientLevelRoot>(
    "/api/booking/professional-bookings",
  ),
  services: createResource<ClientLevelRoot>("/api/service"),
  clientProfile: createResource<ClientLevelRoot>("/api/clientprofile"),
  professionalProfile: createResource<ClientLevelRoot>("/api/professionalprofile"),
  notification: createResource<ClientLevelRoot>("/api/notification"),
};
