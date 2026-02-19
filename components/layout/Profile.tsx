"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  Briefcase,
  MapPin,
  GraduationCap,
  Award,
  CircleDot,
  FileText,
  Calendar,
  Heart,
} from "lucide-react";

interface ProfileProps {
  data: any;
  type: "client" | "professional";
}

export function ProfileLayout({ data, type }: ProfileProps) {
  const user = data?.user;
  const clientProfile = user?.clientProfile;
  const professionalProfile = user?.professionalProfile;

  const initials = user?.name?.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Profile Card */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/30">
        <div className="h-40 bg-linear-to-r from-primary/30 via-primary/10 to-transparent relative">
          <div className="absolute inset-0 bg-grid-white/10" />
        </div>
        <CardContent className="relative pt-0 px-8 pb-8">
          <div className="flex flex-col md:flex-row items-end gap-6 -mt-16">
            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-2 ring-primary/20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              />
              <AvatarFallback className="text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold tracking-tight">
                  {user?.name}
                </h1>
                <Badge
                  variant={user?.status === "Active" ? "default" : "secondary"}
                  className="rounded-full"
                >
                  <CircleDot className="w-3 h-3 mr-1 animate-pulse" />
                  {user?.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {user?.role?.name}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <Phone className="w-4 h-4 text-primary" />
                  {user?.phone_number}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar - Meta Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-muted/40 shadow-sm">
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">
                  Member Since
                </p>
                <p className="text-sm font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">
                  Last Updated
                </p>
                <p className="text-sm font-medium">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">
                  User ID
                </p>
                <p className="text-xs font-mono bg-muted p-1 rounded overflow-hidden text-ellipsis">
                  {user?.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Profile Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-muted/40 shadow-md">
            <CardHeader className="border-b border-muted/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {type === "client"
                  ? "Patient Profile"
                  : "Professional Portfolio"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              {type === "client" && clientProfile ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <DetailItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="Basic Info"
                    value={`${clientProfile.age} Years Old, ${clientProfile.sex}`}
                  />
                  <DetailItem
                    icon={<Heart className="w-4 h-4" />}
                    label="Marital Status"
                    value={clientProfile.marital_status}
                  />
                  <DetailItem
                    icon={<GraduationCap className="w-4 h-4" />}
                    label="Academic Level"
                    value={clientProfile.academic_level}
                  />
                  <DetailItem
                    icon={<Briefcase className="w-4 h-4" />}
                    label="Current Occupation"
                    value={clientProfile.work_status}
                  />
                  <DetailItem
                    icon={<MapPin className="w-4 h-4" />}
                    label="Main Residency"
                    value={clientProfile.residency}
                    fullWidth
                  />

                  <div className="col-span-full space-y-3 pt-4 border-t border-muted/40">
                    <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      Condition Description
                    </label>
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                      <p className="text-sm leading-relaxed text-foreground/90 italic">
                        "{clientProfile.problem_description}"
                      </p>
                    </div>
                  </div>

                  {clientProfile.substance_use?.length > 0 && (
                    <div className="col-span-full space-y-3">
                      <label className="text-xs font-bold uppercase text-muted-foreground">
                        Substance Use History
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {clientProfile.substance_use.map((item: string) => (
                          <Badge
                            key={item}
                            variant="secondary"
                            className="px-3 py-1 bg-muted"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : type === "professional" && professionalProfile ? (
                <div className="grid grid-cols-1 gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <DetailItem
                      icon={<Briefcase className="w-4 h-4" />}
                      label="Profession"
                      value={professionalProfile.profession}
                    />
                    <DetailItem
                      icon={<GraduationCap className="w-4 h-4" />}
                      label="Academic Level"
                      value={professionalProfile.academic_level}
                    />
                  </div>

                  {professionalProfile.specializations?.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <Award className="w-3 h-3" />
                        Specializations
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {professionalProfile.specializations.map(
                          (spec: string) => (
                            <Badge
                              key={spec}
                              variant="secondary"
                              className="px-3 py-1 bg-primary/10 text-primary border-none"
                            >
                              {spec}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {professionalProfile.bio && (
                    <div className="space-y-3 pt-4 border-t border-muted/40">
                      <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        Professional Bio
                      </label>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {professionalProfile.bio}
                      </p>
                    </div>
                  )}

                  {!professionalProfile.profession &&
                    !professionalProfile.bio && (
                      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/10 rounded-2xl border-2 border-dashed border-muted">
                        <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          Professional Profile
                        </h3>
                        <p className="text-muted-foreground max-w-sm">
                          Detailed professional credentials and portfolio
                          information will be displayed here once your profile
                          is complete.
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                  <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <User className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium">
                    No Detail Record Found
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mt-1">
                    Complete your profile to share more about yourself and get
                    better recommendations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`space-y-2 ${fullWidth ? "col-span-full" : ""}`}>
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold pl-6">{value || "Not Specified"}</p>
    </div>
  );
}
