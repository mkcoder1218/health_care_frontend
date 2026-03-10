"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/integration/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VideoRoom from "@/components/VideoRoom";

const parseDurationMinutes = (duration?: string) => {
  if (!duration) return 30;
  const lower = duration.toLowerCase();
  const number = parseFloat(lower);
  if (Number.isNaN(number)) return 30;
  if (lower.includes("hour")) return Math.round(number * 60);
  return Math.round(number);
};

export default function MeetingPage() {
  const params = useParams<{ id: string }>();
  const bookingId = params?.id;
  const { data: bookingResponse, isLoading } = api.booking.getOne(
    bookingId as string,
  );
  const booking = (bookingResponse as any)?.data || bookingResponse;
  const { data: profile } = api.profile.getAll({
    include: [{ model: "Role", as: "role" }],
  });

  const [showRoom, setShowRoom] = useState(false);

  const bookingStart = useMemo(() => {
    const date = booking?.date;
    const time = booking?.time;
    if (!date || !time) return null;
    const iso = `${date}T${time}`;
    const start = new Date(iso);
    return Number.isNaN(start.getTime()) ? null : start;
  }, [booking?.date, booking?.time]);

  const durationMinutes = parseDurationMinutes(booking?.service?.duration);
  const bookingEnd = bookingStart
    ? new Date(bookingStart.getTime() + durationMinutes * 60 * 1000)
    : null;

  const now = new Date();
  const canJoin =
    bookingStart && bookingEnd ? now >= bookingStart && now <= bookingEnd : true;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card>
          <CardContent className="py-8 text-muted-foreground">
            Loading meeting...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card>
          <CardContent className="py-8 text-muted-foreground">
            Booking not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-5">
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Meeting Room</CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Service: <span className="font-medium text-foreground">{booking?.service?.name || "Service"}</span></span>
            <span>Date: <span className="font-medium text-foreground">{booking?.date}</span></span>
            <span>Time: <span className="font-medium text-foreground">{booking?.time}</span></span>
            <span>Duration: <span className="font-medium text-foreground">{booking?.service?.duration || "30 min"}</span></span>
          </div>

          {!canJoin ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Meeting can only be started between{" "}
              <span className="font-semibold">
                {bookingStart?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>{" "}
              and{" "}
              <span className="font-semibold">
                {bookingEnd?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>{" "}
              on{" "}
              <span className="font-semibold">
                {bookingStart?.toLocaleDateString()}
              </span>.
            </div>
          ) : null}

          {!showRoom ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                disabled={!canJoin}
                onClick={() => setShowRoom(true)}
              >
                Start Meeting
              </Button>
              <Button variant="outline">Copy Meeting Link</Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {showRoom && (
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <VideoRoom
              roomId={booking?.id}
              userId={profile?.user?.id || "guest"}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
