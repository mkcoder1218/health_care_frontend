"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/integration/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ServicesPage() {
  const { data: profile, isLoading: loadingProfile } = api.profile.getAll({
    include: [
      { model: "Role", as: "role" },
      { model: "ClientProfile", as: "clientProfile" },
      { model: "ProfessionalProfile", as: "professionalProfile" },
    ],
  });
  const roleName = profile?.user?.role?.name?.toLowerCase?.() || "";
  const isProfessional = roleName === "professional";
  const isUser = roleName === "user";

  const { data: servicesData, isLoading: loadingServices } =
    api.services.getAll();
  const services = servicesData?.data || [];

  const clientId = profile?.user?.clientProfile?.id || null;

  const [bookOpen, setBookOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const openBooking = (service: any) => {
    setSelectedService(service);
    setDate("");
    setTime("");
    setPaymentFile(null);
    setPaymentPreview(null);
    setFormError(null);
    setFormSuccess(null);
    setBookOpen(true);
  };

  const handleBook = async () => {
    setFormError(null);
    setFormSuccess(null);

    if (!clientId) {
      setFormError("Client profile not found. Please complete your profile.");
      return;
    }
    if (!date || !time) {
      setFormError("Please select date and time.");
      return;
    }

    setIsSubmitting(true);
    try {
      let paymentFileId: string | null = null;
      if (paymentFile) {
        setIsUploading(true);
        const form = new FormData();
        form.append("file", paymentFile);
        form.append("description", "Payment screenshot");
        form.append("type", "Payment");
        const uploaded: any = await api.file.create(form as any);
        paymentFileId = uploaded?.id || null;
        setIsUploading(false);
      }

      await api.booking.create({
        client_id: clientId,
        professional_id: null,
        service_id: selectedService?.id,
        payment_file_id: paymentFileId,
        date,
        time,
        status: "Pending",
        payment_status: paymentFileId ? "Pending" : "Unpaid",
      });
      setFormSuccess("Booking created. Admin will assign a professional.");
    } catch (err: any) {
      console.error("Booking failed", err);
      setFormError(err?.message || "Booking failed. Please try again.");
      setIsUploading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProfile || loadingServices) {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (isProfessional) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Professionals should use the Patients page to manage assigned bookings.
            </p>
            <Button asChild>
              <Link href="/patients">Go to Patients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isUser) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Please sign in as a user to view services.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Services</h1>
        <p className="text-muted-foreground">
          Choose a service and book a time. Admin will assign your professional.
        </p>
      </div>

      {services.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-8 text-muted-foreground">
            No services available.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service: any) => (
            <Card key={service.id} className="border-border">
              <CardHeader>
                <CardTitle>{service?.name || "Service"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {service?.description || ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  Price: <span className="font-medium text-foreground">{service?.price || "-"}</span>
                </p>
                <div className="pt-2">
                  <Button onClick={() => openBooking(service)}>Book Service</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              {selectedService?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Screenshot (optional)</Label>
              <Input
                id="payment"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPaymentFile(file);
                  setPaymentPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              {paymentFile ? (
                <p className="text-xs text-muted-foreground">
                  Selected: {paymentFile.name}
                </p>
              ) : null}
              {paymentPreview ? (
                <div className="rounded-lg border border-border bg-muted/20 p-2">
                  <img
                    src={paymentPreview}
                    alt="Payment preview"
                    className="h-40 w-full object-contain rounded-md bg-white"
                  />
                </div>
              ) : null}
            </div>

            {formError ? (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {formError}
              </div>
            ) : null}
            {formSuccess ? (
              <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                {formSuccess}
              </div>
            ) : null}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBookOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBook} disabled={isSubmitting}>
                {isSubmitting || isUploading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
