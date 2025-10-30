"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoEmbed } from "@/components/ui/video-embed"
import { Heart, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

type FormStep = 1 | 2 | 3 | 4

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1)
  const [formData, setFormData] = useState({
    // Step 1: Account Info
    username: "",
    password: "",
    confirmPassword: "",
    // Step 2: Personal Info
    age: "",
    sex: "",
    maritalStatus: "",
    residency: "",
    academicLevel: "",
    workStatus: "",
    // Step 3: Mental Health Info
    financialProblem: "",
    substanceUse: [] as string[],
    problemDescription: "",
    // Step 4: Service Preferences
    servicePreference: "",
    appointmentDate: "",
    appointmentTime: "",
    requestFreeService: false,
    // Payment (conditional)
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const substanceOptions = [
    "Alcohol",
    "Chat (Khat)",
    "Cigarette",
    "Cannabis",
    "Prescription Medication",
    "Other",
    "None",
  ]

  const handleSubstanceChange = (substance: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, substanceUse: [...formData.substanceUse, substance] })
    } else {
      setFormData({ ...formData, substanceUse: formData.substanceUse.filter((s) => s !== substance) })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Registration submitted:", formData)
    // Handle registration
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as FormStep)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as FormStep)
  }

  const showPaymentSection = formData.financialProblem === "no" && !formData.requestFreeService

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-2xl font-serif font-bold text-foreground">MindCare</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Client Registration</h1>
          <p className="text-muted-foreground">Take the first step towards better mental health</p>
        </div>

        {/* Tutorial Video */}
        <div className="mb-8">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-4">Registration Guide</h2>
            <p className="text-muted-foreground mb-4">
              Watch this short video to learn how to complete your registration and what to expect from our services.
            </p>
            <VideoEmbed url="https://www.youtube.com/watch?v=3QIfkeA6HBY" title="Registration Tutorial" />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors",
                    currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={cn("h-1 flex-1 mx-2 transition-colors", currentStep > step ? "bg-primary" : "bg-muted")}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Account</span>
            <span>Personal</span>
            <span>Health</span>
            <span>Service</span>
          </div>
        </div>

        {/* Registration Form */}
        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Account Information</h2>
                  <p className="text-muted-foreground">Create your secure account credentials</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Personal Information</h2>
                  <p className="text-muted-foreground">Help us understand your background</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                      <SelectTrigger id="sex">
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
                  >
                    <SelectTrigger id="maritalStatus">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                      <SelectItem value="separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Residency</Label>
                  <RadioGroup
                    value={formData.residency}
                    onValueChange={(value) => setFormData({ ...formData, residency: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urban" id="urban" />
                      <Label htmlFor="urban" className="font-normal cursor-pointer">
                        Urban
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rural" id="rural" />
                      <Label htmlFor="rural" className="font-normal cursor-pointer">
                        Rural
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicLevel">Academic Level</Label>
                  <Select
                    value={formData.academicLevel}
                    onValueChange={(value) => setFormData({ ...formData, academicLevel: value })}
                  >
                    <SelectTrigger id="academicLevel">
                      <SelectValue placeholder="Select academic level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-formal">No Formal Education</SelectItem>
                      <SelectItem value="primary">Primary School</SelectItem>
                      <SelectItem value="secondary">Secondary School</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workStatus">Work Status</Label>
                  <Select
                    value={formData.workStatus}
                    onValueChange={(value) => setFormData({ ...formData, workStatus: value })}
                  >
                    <SelectTrigger id="workStatus">
                      <SelectValue placeholder="Select work status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed-full">Employed Full-time</SelectItem>
                      <SelectItem value="employed-part">Employed Part-time</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Mental Health Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Mental Health Information</h2>
                  <p className="text-muted-foreground">This information helps us provide better care</p>
                </div>

                <div className="space-y-2">
                  <Label>Do you have financial problems?</Label>
                  <RadioGroup
                    value={formData.financialProblem}
                    onValueChange={(value) => setFormData({ ...formData, financialProblem: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="financial-yes" />
                      <Label htmlFor="financial-yes" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="financial-no" />
                      <Label htmlFor="financial-no" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Substance Use (Select all that apply)</Label>
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    {substanceOptions.map((substance) => (
                      <div key={substance} className="flex items-center space-x-2">
                        <Checkbox
                          id={substance}
                          checked={formData.substanceUse.includes(substance)}
                          onCheckedChange={(checked) => handleSubstanceChange(substance, checked as boolean)}
                        />
                        <Label htmlFor={substance} className="font-normal cursor-pointer">
                          {substance}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemDescription">Problem Description</Label>
                  <Textarea
                    id="problemDescription"
                    placeholder="Please describe what brings you here and what you hope to achieve through therapy..."
                    rows={6}
                    value={formData.problemDescription}
                    onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This information is confidential and helps us match you with the right professional.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Service Preferences & Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Service Preferences</h2>
                  <p className="text-muted-foreground">Choose how you'd like to receive care</p>
                </div>

                <div className="space-y-2">
                  <Label>Service Preference</Label>
                  <RadioGroup
                    value={formData.servicePreference}
                    onValueChange={(value) => setFormData({ ...formData, servicePreference: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="service-online" />
                      <Label htmlFor="service-online" className="font-normal cursor-pointer">
                        Online Therapy (Video Sessions)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="face-to-face" id="service-face" />
                      <Label htmlFor="service-face" className="font-normal cursor-pointer">
                        Face-to-Face Sessions (In-Person)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Preferred Appointment Date</Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Preferred Time</Label>
                    <Input
                      id="appointmentTime"
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {formData.financialProblem === "no" && (
                  <div className="flex items-start space-x-2 rounded-lg border border-border bg-muted/30 p-4">
                    <Checkbox
                      id="requestFreeService"
                      checked={formData.requestFreeService}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, requestFreeService: checked as boolean })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="requestFreeService" className="font-normal cursor-pointer">
                        I request free service if I cannot afford to pay
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        We offer sliding scale fees and free services based on financial need.
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Section (Conditional) */}
                {showPaymentSection && (
                  <div className="space-y-4 pt-6 border-t border-border">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Payment Information</h3>
                      <p className="text-muted-foreground text-sm">
                        Secure payment processing. Your information is encrypted and protected.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        required={showPaymentSection}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          type="text"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                          required={showPaymentSection}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvc">CVC</Label>
                        <Input
                          id="cardCvc"
                          type="text"
                          placeholder="123"
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                          required={showPaymentSection}
                        />
                      </div>
                    </div>

                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                      <p className="text-sm text-foreground">
                        <strong>Session Fee:</strong> $75 per session
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You will be charged after your first session is confirmed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">Complete Registration</Button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
