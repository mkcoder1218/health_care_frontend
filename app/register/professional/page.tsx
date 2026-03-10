"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/integration/api";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function ProfessionalRegisterPage() {
  const { data: role } = api.role.getAll();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    profession: "",
    bio: "",
    password: "",
    confirmPassword: "",
    license_file_id: "",
    degree_file_id: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!form.full_name || !form.phone || !form.password || !form.profession) {
      setFormError("Please fill all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const roleId = role?.data?.find((item) => item?.name === "professional")?.id;
    if (!roleId) {
      setFormError("Professional role not found. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.register.create({
        name: form.full_name,
        email: form.email,
        phone_number: form.phone,
        password: form.password,
        role_id: roleId,
        professionalProfile: {
          profession: form.profession,
          bio: form.bio,
          license_file_id: form.license_file_id || null,
          degree_file_id: form.degree_file_id || null,
        },
      });
      setFormSuccess("Registration submitted. Pending verification by admin.");
    } catch (err: any) {
      console.error("Registration failed", err);
      setFormError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (
    file: File | undefined,
    field: "license_file_id" | "degree_file_id",
  ) => {
    if (!file) return;
    setIsUploading(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", field === "license_file_id" ? "License" : "Degree");
      formData.append("type", field === "license_file_id" ? "License" : "Degree");
      const res: any = await api.file.create(formData as any);
      setForm((prev) => ({ ...prev, [field]: res?.id || "" }));
    } catch (err) {
      console.error("Upload failed", err);
      setFormError("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-2xl font-serif font-bold text-foreground">
              MindCare
            </span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Professional Registration
          </h1>
          <p className="text-muted-foreground">
            Apply to join our professional network.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 border rounded-lg bg-card shadow-sm"
        >
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Full Name</Label>
          <Input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <Label>Email</Label>
        <Input name="email" value={form.email} onChange={handleChange} />
      </div>

      <div>
        <Label>Tell us about yourself</Label>
        <Textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Profession</Label>
        <Input
          name="profession"
          value={form.profession}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Confirm Password</Label>
        <Input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Upload License</Label>
          <Input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleUpload(e.target.files?.[0], "license_file_id");
            }}
          />
        </div>
        <div>
          <Label>Upload degree</Label>
          <Input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleUpload(e.target.files?.[0], "degree_file_id");
            }}
          />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting || isUploading}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
      </div>
    </div>
  );
}
