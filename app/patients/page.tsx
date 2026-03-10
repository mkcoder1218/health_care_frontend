"use client";

import Link from "next/link";
import { api } from "@/integration/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientsPage() {
  const { data: profile, isLoading: loadingProfile } = api.profile.getAll({
    include: [
      { model: "Role", as: "role" },
      { model: "ProfessionalProfile", as: "professionalProfile" },
    ],
  });
  const roleName = profile?.user?.role?.name?.toLowerCase?.() || "";
  const isProfessional = roleName === "professional";

  const { data: bookingsData, isLoading: loadingBookings } =
    api.professionalBookings.getAll();
  const bookings = bookingsData?.data || [];

  if (loadingProfile || loadingBookings) {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (!isProfessional) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              This page is available for professionals only.
            </p>
            <Button asChild>
              <Link href="/services">Go to Services</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">My Patients</h1>
        <p className="text-muted-foreground">
          Patients assigned to you via admin bookings.
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-8 text-muted-foreground">
            No assigned patients yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <Card key={booking.id} className="border-border">
              <CardHeader>
                <CardTitle>
                  {booking?.client?.user?.name || "Patient"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Service: <span className="font-medium text-foreground">{booking?.service?.name || "Service"}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: <span className="font-medium text-foreground">{booking?.date || "-"}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Time: <span className="font-medium text-foreground">{booking?.time || "-"}</span>
                </p>
                <div className="pt-2">
                  <Button asChild>
                    <Link href={`/meeting/${booking.id}`}>Connect</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
