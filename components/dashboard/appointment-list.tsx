"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Appointment {
  id: number
  date: string
  time: string
  type: "online" | "in-person"
  status: "upcoming" | "confirmed" | "completed" | "cancelled"
  professional: string
  location?: string
}

interface AppointmentListProps {
  compact?: boolean
}

export function AppointmentList({ compact = false }: AppointmentListProps) {
  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      date: "2024-03-20",
      time: "10:00 AM",
      type: "online",
      status: "confirmed",
      professional: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      date: "2024-03-27",
      time: "2:00 PM",
      type: "in-person",
      status: "upcoming",
      professional: "Dr. Sarah Johnson",
      location: "123 Wellness Street, Suite 200",
    },
    {
      id: 3,
      date: "2024-03-13",
      time: "10:00 AM",
      type: "online",
      status: "completed",
      professional: "Dr. Sarah Johnson",
    },
  ])

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success border-success/20"
      case "upcoming":
        return "bg-primary/10 text-primary border-primary/20"
      case "completed":
        return "bg-muted text-muted-foreground border-border"
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"
    }
  }

  const displayAppointments = compact ? appointments.filter((a) => a.status !== "completed").slice(0, 3) : appointments

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-bold text-foreground">
          {compact ? "Upcoming Appointments" : "My Appointments"}
        </h2>
        {compact && (
          <Button variant="ghost" size="sm">
            View All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {displayAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No appointments scheduled</p>
            <Button className="mt-4">Schedule Appointment</Button>
          </div>
        ) : (
          displayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={cn(
                "rounded-lg border border-border p-4 transition-shadow hover:shadow-md",
                appointment.status === "completed" && "opacity-60",
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {appointment.type === "online" ? (
                    <Video className="h-5 w-5 text-primary" />
                  ) : (
                    <MapPin className="h-5 w-5 text-primary" />
                  )}
                  <span className="font-medium text-foreground">
                    {appointment.type === "online" ? "Online Session" : "In-Person Session"}
                  </span>
                </div>
                <Badge variant="outline" className={getStatusColor(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
                <p className="font-medium text-foreground">{appointment.professional}</p>
                {appointment.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{appointment.location}</span>
                  </div>
                )}
              </div>

              {appointment.status === "upcoming" && (
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Reschedule
                  </Button>
                  <Button size="sm" variant="ghost">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {appointment.status === "confirmed" && appointment.type === "online" && (
                <Button size="sm" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Join Video Session
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
