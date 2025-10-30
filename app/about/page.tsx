import { SectionHeading } from "@/components/ui/section-heading"
import { Heart, Target, Lightbulb, Users, Shield } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every client with empathy, understanding, and genuine care for their wellbeing.",
    },
    {
      icon: Shield,
      title: "Confidentiality",
      description: "Your privacy and trust are paramount. We maintain the highest standards of confidentiality.",
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Mental health care should be available to everyone. We strive to remove barriers to access.",
    },
    {
      icon: Lightbulb,
      title: "Excellence",
      description: "We're committed to evidence-based practices and continuous professional development.",
    },
  ]

  const teamCategories = [
    {
      title: "Psychiatrists",
      description:
        "Medical doctors specializing in mental health, providing diagnosis, treatment, and medication management.",
      count: "12+ Professionals",
    },
    {
      title: "Clinical Psychologists",
      description:
        "Doctoral-level professionals offering psychological assessment, therapy, and evidence-based interventions.",
      count: "18+ Professionals",
    },
    {
      title: "Community Mental Health Specialists",
      description: "Experts in community-based mental health services, outreach, and support program coordination.",
      count: "15+ Professionals",
    },
    {
      title: "Psychiatry Nurses",
      description:
        "Registered nurses with specialized training in psychiatric care, providing holistic patient support.",
      count: "10+ Professionals",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionHeading
              title="About MindCare"
              subtitle="Dedicated to transforming mental health care through compassionate, professional, and accessible services."
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide accessible, high-quality mental health services that empower individuals to achieve optimal
                wellbeing. We believe everyone deserves compassionate, professional support on their mental health
                journey.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Through innovative service delivery, community education, and advocacy, we work to reduce stigma and
                create a world where mental health is prioritized and supported.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  <Lightbulb className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Our Vision</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A future where mental health care is universally accessible, stigma-free, and integrated into overall
                wellness. We envision communities where seeking help is normalized and support is readily available.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We strive to be leaders in mental health innovation, setting standards for compassionate care and
                evidence-based practice that inspire positive change across the healthcare landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Core Values"
            subtitle="The principles that guide everything we do."
            centered
            className="mb-12 flex flex-col items-center"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="rounded-lg border border-border bg-card p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Professional Team"
            subtitle="A diverse team of experienced mental health professionals dedicated to your care."
            centered
            className="mb-12 flex flex-col items-center"
          />
          <div className="grid md:grid-cols-2 gap-8">
            {teamCategories.map((category, index) => (
              <div key={index} className="rounded-lg border border-border bg-card p-8 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-serif font-bold text-foreground">{category.title}</h3>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">55+</div>
              <div className="text-muted-foreground">Mental Health Professionals</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Clients Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
