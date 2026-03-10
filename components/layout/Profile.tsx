"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/integration/api";
import { BASE_URL } from "@/integration/config";

interface ProfileProps {
  data: any;
  type: "client" | "professional";
  onRefresh?: () => Promise<any> | void;
}

export function ProfileLayout({ data, type, onRefresh }: ProfileProps) {
  const user = data?.user;
  const clientProfile = user?.clientProfile;
  const professionalProfile = user?.professionalProfile;
  const sex = clientProfile?.sex || professionalProfile?.sex;
  const { data: bookingsData, isLoading: loadingBookings } =
    api.myBookings.getAll();
  const bookings = bookingsData?.data || [];

  const initials = user?.name?.substring(0, 2).toUpperCase();
  const maleAvatar =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='24' fill='%23e2f2ff'/><circle cx='60' cy='46' r='22' fill='%230ea5e9'/><rect x='28' y='74' width='64' height='30' rx='15' fill='%2393c5fd'/></svg>";
  const femaleAvatar =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='24' fill='%23ffe4f1'/><circle cx='60' cy='46' r='22' fill='%23f472b6'/><rect x='28' y='74' width='64' height='30' rx='15' fill='%23f9a8d4'/></svg>";
  const profileImageUrl = user?.profileImage?.url
    ? `${BASE_URL}${user.profileImage.url}`
    : sex === "Male"
      ? maleAvatar
      : femaleAvatar;

  const [formState, setFormState] = useState({
    name: user?.name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [clientEdit, setClientEdit] = useState({
    age: clientProfile?.age || "",
    sex: clientProfile?.sex || "",
    marital_status: clientProfile?.marital_status || "",
    residency: clientProfile?.residency || "",
    academic_level: clientProfile?.academic_level || "",
    work_status: clientProfile?.work_status || "",
    problem_description: clientProfile?.problem_description || "",
  });
  const [professionalEdit, setProfessionalEdit] = useState({
    profession: professionalProfile?.profession || "",
    bio: professionalProfile?.bio || "",
  });
  const [activeTab, setActiveTab] = useState<"profile" | "bookings">("profile");
  const [profileTab, setProfileTab] = useState<"overview" | "edit">("overview");

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name || "",
        phone_number: user.phone_number || "",
        email: user.email || "",
      });
    }
    if (clientProfile) {
      setClientEdit({
        age: clientProfile.age || "",
        sex: clientProfile.sex || "",
        marital_status: clientProfile.marital_status || "",
        residency: clientProfile.residency || "",
        academic_level: clientProfile.academic_level || "",
        work_status: clientProfile.work_status || "",
        problem_description: clientProfile.problem_description || "",
      });
    }
    if (professionalProfile) {
      setProfessionalEdit({
        profession: professionalProfile.profession || "",
        bio: professionalProfile.bio || "",
      });
    }
  }, [user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    setNotice(null);
    setFormError(null);

    try {
      await api.user.update(user.id, {
        name: formState.name,
        phone_number: formState.phone_number,
        email: formState.email,
      });
      setNotice("Profile updated.");
      await onRefresh?.();
    } catch (err) {
      console.error("Profile update failed", err);
      setFormError("Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file || !user?.id) return;
    setIsUploading(true);
    setNotice(null);
    setFormError(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("description", "Profile image");
      form.append("type", "Profile");
      const uploaded: any = await api.file.create(form as any);
      await api.user.update(user.id, { profile_image_id: uploaded?.id });
      setNotice("Profile photo updated.");
      await onRefresh?.();
    } catch (err) {
      console.error("Profile image upload failed", err);
      setFormError("Unable to update profile photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateClientProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setNotice(null);
    try {
      const payload = {
        user_id: user?.id,
        age: clientEdit.age ? Number(clientEdit.age) : null,
        sex: clientEdit.sex || null,
        marital_status: clientEdit.marital_status || null,
        residency: clientEdit.residency || null,
        academic_level: clientEdit.academic_level || null,
        work_status: clientEdit.work_status || null,
        problem_description: clientEdit.problem_description || null,
      };
      if (clientProfile?.id) {
        await api.clientProfile.update(clientProfile.id, payload);
        setNotice("Client profile updated.");
      } else {
        await api.clientProfile.create(payload as any);
        setNotice("Client profile created.");
      }
      await onRefresh?.();
    } catch (err) {
      console.error("Update client profile failed", err);
      setFormError("Unable to save client profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProfessionalProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setNotice(null);
    try {
      const payload = {
        user_id: user?.id,
        profession: professionalEdit.profession || null,
        bio: professionalEdit.bio || null,
      };
      if (professionalProfile?.id) {
        await api.professionalProfile.update(professionalProfile.id, payload);
        setNotice("Professional profile updated.");
      } else {
        await api.professionalProfile.create(payload as any);
        setNotice("Professional profile created.");
      }
      await onRefresh?.();
    } catch (err) {
      console.error("Update professional profile failed", err);
      setFormError("Unable to save professional profile.");
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
      <div className="inline-flex items-center gap-1 bg-muted/70 p-1 rounded-xl border border-muted">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "profile"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "bookings"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Bookings
        </button>
      </div>

      {activeTab === "bookings" ? (
        <Card className="border-muted/40 shadow-md">
          <CardHeader className="border-b border-muted/40 bg-muted/20">
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {loadingBookings ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You do not have any bookings yet.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-muted/40 rounded-lg p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {booking?.service?.name || "Service"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking?.date || "-"} • {booking?.time || "-"}
                      </p>
                      {booking?.professional?.user?.name ? (
                        <p className="text-xs text-muted-foreground">
                          Professional: {booking.professional.user.name}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-semibold text-primary">
                        {booking?.status || "Pending"}
                      </div>
                      {booking?.professional_id ? (
                        <Button size="sm" asChild>
                          <Link href={`/meeting/${booking.id}`}>Connect</Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
      {/* Header Profile Card */}
      {activeTab === "profile" && (
        <>
        <Card className="border-muted/40 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <Avatar className="h-24 w-24 border-2 border-background shadow-lg ring-1 ring-primary/20">
                <AvatarImage src={profileImageUrl} />
                <AvatarFallback className="text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-serif font-bold tracking-tight">
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
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
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
              <div>
                <label className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-muted-foreground border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                  {isUploading ? "Uploading..." : "Change photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

          <div className="grid grid-cols-1 gap-4">
        {/* Left Sidebar - Meta Info */}
            <div className="inline-flex items-center gap-1 bg-muted/70 p-1 rounded-xl border border-muted w-fit">
              <button
                type="button"
                onClick={() => setProfileTab("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  profileTab === "overview"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setProfileTab("edit")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  profileTab === "edit"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Edit
              </button>
            </div>

            <div className="space-y-4">
              {profileTab === "overview" && (
                <>
                  <Card className="overflow-hidden border-muted/40 shadow-sm">
                    <CardHeader className="bg-muted/40">
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

                  <Card className="border-muted/40 shadow-md">
                    <CardHeader className="border-b border-muted/40 bg-muted/20">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        {type === "client"
                          ? "Patient Profile"
                          : "Professional Portfolio"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
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
                        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
                          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <User className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                          <h3 className="text-base font-semibold">
                            No {type === "client" ? "client" : "professional"} profile
                            details yet
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            Your account information above is available. Additional
                            profile details will appear here once created by admin.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {profileTab === "edit" && (
                <>
          <Card className="border-muted/40 shadow-md">
            <CardHeader className="border-b border-muted/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Update Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formState.phone_number}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        phone_number: e.target.value,
                      })
                    }
                    placeholder="+251..."
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    placeholder="name@company.com"
                  />
                </div>

                {formError ? (
                  <div className="sm:col-span-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    {formError}
                  </div>
                ) : null}
                {notice ? (
                  <div className="sm:col-span-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                    {notice}
                  </div>
                ) : null}

                <div className="sm:col-span-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {type === "client" && (
            <Card className="border-muted/40 shadow-md">
              <CardHeader className="border-b border-muted/40 bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {clientProfile ? "Update Client Profile" : "Complete Client Profile"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form
                  onSubmit={handleUpdateClientProfile}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={clientEdit.age}
                      onChange={(e) =>
                        setClientEdit({ ...clientEdit, age: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sex</Label>
                    <select
                      className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                      value={clientEdit.sex}
                      onChange={(e) =>
                        setClientEdit({ ...clientEdit, sex: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Marital Status</Label>
                    <select
                      className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                      value={clientEdit.marital_status}
                      onChange={(e) =>
                        setClientEdit({
                          ...clientEdit,
                          marital_status: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="separated">Separated</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Residency</Label>
                    <select
                      className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                      value={clientEdit.residency}
                      onChange={(e) =>
                        setClientEdit({
                          ...clientEdit,
                          residency: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="urban">Urban</option>
                      <option value="rural">Rural</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Academic Level</Label>
                    <select
                      className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                      value={clientEdit.academic_level}
                      onChange={(e) =>
                        setClientEdit({
                          ...clientEdit,
                          academic_level: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="no-formal">No Formal Education</option>
                      <option value="primary">Primary School</option>
                      <option value="secondary">Secondary School</option>
                      <option value="diploma">Diploma</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="doctorate">Doctorate</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Work Status</Label>
                    <select
                      className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                      value={clientEdit.work_status}
                      onChange={(e) =>
                        setClientEdit({
                          ...clientEdit,
                          work_status: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="employed-full">Employed Full-time</option>
                      <option value="employed-part">Employed Part-time</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Problem Description</Label>
                    <Input
                      value={clientEdit.problem_description}
                      onChange={(e) =>
                        setClientEdit({
                          ...clientEdit,
                          problem_description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : clientProfile ? "Save Client Profile" : "Create Client Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {type === "professional" && (
            <Card className="border-muted/40 shadow-md">
              <CardHeader className="border-b border-muted/40 bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  {professionalProfile ? "Update Professional Profile" : "Complete Professional Profile"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form
                  onSubmit={handleUpdateProfessionalProfile}
                  className="grid grid-cols-1 gap-6"
                >
                  <div className="space-y-2">
                    <Label>Profession</Label>
                    <Input
                      value={professionalEdit.profession}
                      onChange={(e) =>
                        setProfessionalEdit({
                          ...professionalEdit,
                          profession: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Input
                      value={professionalEdit.bio}
                      onChange={(e) =>
                        setProfessionalEdit({
                          ...professionalEdit,
                          bio: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : professionalProfile ? "Save Professional Profile" : "Create Professional Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
                </>
              )}
        </div>
      </div>
        </>
      )}
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
