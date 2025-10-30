import { SectionHeading } from "@/components/ui/section-heading"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Award, Heart, TrendingUp } from "lucide-react"

export default function ProfessionalRegistrationPage() {
  const benefits = [
    {
      icon: Users,
      title: "Expand Your Practice",
      description: "Connect with clients who need your expertise and grow your professional practice.",
    },
    {
      icon: Award,
      title: "Professional Development",
      description: "Access continuing education resources and collaborate with experienced colleagues.",
    },
    {
      icon: Heart,
      title: "Make a Difference",
      description: "Help individuals on their mental health journey and contribute to community wellbeing.",
    },
    {
      icon: TrendingUp,
      title: "Flexible Opportunities",
      description: "Choose your schedule and service delivery method - online, in-person, or both.",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading
              title="Join Our Professional Network"
              subtitle="Be part of a dedicated team of mental health professionals making a real difference in people's lives."
              centered
            />
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/contact">Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Join MindCare?"
            subtitle="Discover the benefits of being part of our professional community."
            centered
            className="mb-12 flex flex-col items-center"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="rounded-lg border border-border bg-card p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Professional Requirements"
            subtitle="We welcome qualified mental health professionals from various specializations."
            centered
            className="mb-12 flex flex-col items-center"
          />
          <div className="rounded-lg border border-border bg-card p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">We're Looking For:</h3>
            <ul className="space-y-4">
              {[
                "Licensed Psychiatrists",
                "Clinical Psychologists (PhD or PsyD)",
                "Licensed Clinical Social Workers (LCSW)",
                "Licensed Professional Counselors (LPC)",
                "Marriage and Family Therapists (LMFT)",
                "Psychiatric Nurses (RN with psychiatric specialization)",
                "Community Mental Health Specialists",
              ].map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-success" />
                  </div>
                  <span className="text-muted-foreground">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
            Join our network of compassionate professionals and help us expand access to quality mental health care.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact Us to Apply</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
