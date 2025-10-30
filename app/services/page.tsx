import { SectionHeading } from "@/components/ui/section-heading"
import { InfoCard } from "@/components/ui/info-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Video, Users, GraduationCap, Network, Calendar, Shield, Heart, Clock } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Video,
      title: "Online Therapy",
      description:
        "Connect with licensed therapists from the comfort of your home through secure video sessions. Flexible scheduling and convenient access to professional mental health support.",
      features: ["Secure video conferencing", "Flexible scheduling", "Licensed professionals", "Privacy guaranteed"],
    },
    {
      icon: Users,
      title: "Face-to-Face Sessions",
      description:
        "Traditional in-person therapy sessions at our comfortable, welcoming facilities. Build a personal connection with your therapist in a safe, confidential environment.",
      features: ["Private consultation rooms", "Urban and rural locations", "Personalized care", "Comfortable setting"],
    },
    {
      icon: GraduationCap,
      title: "Mental Health Training Programs",
      description:
        "Comprehensive training programs for individuals, organizations, and communities. Learn about mental health awareness, stress management, and emotional wellbeing.",
      features: [
        "Workplace wellness programs",
        "Community workshops",
        "Professional development",
        "Customized training",
      ],
    },
    {
      icon: Network,
      title: "Referral Network",
      description:
        "Access our extensive network of partner organizations, specialists, and support services. We connect you with the right resources for your specific needs.",
      features: [
        "Specialist referrals",
        "Support group connections",
        "Community resources",
        "Integrated care coordination",
      ],
    },
  ]

  const benefits = [
    {
      icon: Calendar,
      title: "Flexible Appointments",
      description: "Schedule sessions at times that work best for you, including evenings and weekends.",
    },
    {
      icon: Shield,
      title: "Confidential Care",
      description: "Your privacy is protected with secure systems and strict confidentiality protocols.",
    },
    {
      icon: Heart,
      title: "Compassionate Support",
      description: "Our team is dedicated to providing empathetic, non-judgmental care.",
    },
    {
      icon: Clock,
      title: "Timely Access",
      description: "Quick appointment scheduling to ensure you get help when you need it most.",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionHeading
              title="Our Services"
              subtitle="Comprehensive mental health services designed to support your journey to wellness. Choose the approach that works best for you."
            />
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  id={service.title.toLowerCase().replace(/\s+/g, "-")}
                  className="grid lg:grid-cols-2 gap-8 items-start"
                >
                  <div className="space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-foreground">{service.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>
                    <Button asChild className="mt-4">
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1 h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-success" />
                          </div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Our Services Stand Out"
            subtitle="We're committed to providing accessible, professional, and compassionate mental health care."
            centered
            className="mb-12 flex flex-col items-center"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <InfoCard key={index} icon={benefit.icon} title={benefit.title} description={benefit.description} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
            Take the first step towards better mental health. Register today to connect with a professional who
            understands your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Register Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
