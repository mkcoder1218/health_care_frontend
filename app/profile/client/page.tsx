"use client";

import { ProfileLayout } from "@/components/layout/Profile";
import { api } from "@/integration/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientProfilePage() {
  const { data: profile, isLoading } = api.profile.getAll({
    include: [
      { model: "Role", as: "role" },
      { model: "ClientProfile", as: "clientProfile" },
    ],
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-96 md:col-span-2 rounded-xl" />
        </div>
      </div>
    );
  }

  return <ProfileLayout data={profile} type="client" />;
}
