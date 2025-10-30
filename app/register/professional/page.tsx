"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/integration/api";

export default function ProfessionalRegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    profession: "",
    password: "",
    license: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });
    formData.append("role", "professional");

    await api.auth.create(formData);
    alert("Registration submitted. Pending verification by admin.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4 border rounded-lg mt-12">
      <h2 className="text-2xl font-bold mb-4">Professional Registration</h2>

      <div>
        <Label>Full Name</Label>
        <Input name="full_name" value={form.full_name} onChange={handleChange} required />
      </div>

      <div>
        <Label>Email</Label>
        <Input name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>

      <div>
        <Label>Phone</Label>
        <Input name="phone" value={form.phone} onChange={handleChange} required />
      </div>

      <div>
        <Label>Profession</Label>
        <Input name="profession" value={form.profession} onChange={handleChange} required />
      </div>

      <div>
        <Label>Password</Label>
        <Input name="password" type="password" value={form.password} onChange={handleChange} required />
      </div>

      <div>
        <Label>Upload License</Label>
        <Input name="license" type="file" onChange={handleChange} />
      </div>

      <Button type="submit">Submit Application</Button>
    </form>
  );
}
