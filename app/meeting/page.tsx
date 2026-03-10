"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Meeting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Please open a meeting from your booking.</p>
          <Button asChild>
            <Link href="/profile/client">Go to My Bookings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
