import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoEmbed } from "@/components/ui/video-embed";
import { InfoCard } from "@/components/ui/info-card";
import {
  Users,
  BookOpen,
  ArrowRight,
  Heart,
  Shield,
  Clock,
} from "lucide-react";

export default function HomePage() {
  const mentalHealthVideos = [
    {
      url: "https://www.youtube.com/watch?v=3QIfkeA6HBY",
      title: "Understanding Mental Health",
    },
    {
      url: "https://www.youtube.com/watch?v=DxIDKZHW3-E",
      title: "Managing Anxiety and Stress",
    },
    {
      url: "https://www.youtube.com/watch?v=NOAgplgTxfc",
      title: "Depression: What You Need to Know",
    },
    {
      url: "https://www.youtube.com/watch?v=rkZl2gsLUp4",
      title: "Building Resilience",
    },
    {
      url: "https://www.youtube.com/watch?v=Ie5zO-mN31E",
      title: "Self-Care Strategies",
    },
    {
      url: "https://www.youtube.com/watch?v=8Su5VtKeXU8",
      title: "Breaking the Stigma",
    },
  ];

  const advocacyArticles = [
    {
      title: "Mental Health Awareness Month: Breaking Down Barriers",
      excerpt:
        "Exploring the importance of mental health awareness and reducing stigma in our communities.",
      date: "March 15, 2024",
    },
    {
      title: "The Impact of Social Media on Youth Mental Health",
      excerpt:
        "Understanding how digital connectivity affects the mental wellbeing of young people.",
      date: "March 10, 2024",
    },
    {
      title: "Workplace Mental Health: Creating Supportive Environments",
      excerpt:
        "How organizations can foster mental health support and reduce workplace stress.",
      date: "March 5, 2024",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground text-balance leading-tight">
                Your Journey to Mental Wellness Starts Here
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
                Professional mental health support tailored to your needs.
                Connect with experienced therapists and counselors who care
                about your wellbeing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-base">
                  <Link href="/register/client">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-base bg-transparent"
                >
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Heart
                    className="h-24 w-24 text-primary mx-auto"
                    strokeWidth={1.5}
                  />
                  <p className="text-lg font-medium text-foreground">
                    Compassionate Care
                  </p>
                  <p className="text-muted-foreground">
                    Professional support when you need it most
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose MindCare"
            subtitle="We provide comprehensive mental health services with a focus on accessibility, professionalism, and compassionate care."
            centered
            className="mb-12 flex flex-col items-center"
          />
          <div className="grid md:grid-cols-3 gap-8">
            <InfoCard
              icon={Shield}
              title="Confidential & Safe"
              description="Your privacy is our priority. All sessions are conducted in a secure, confidential environment."
            />
            <InfoCard
              icon={Users}
              title="Expert Professionals"
              description="Connect with licensed psychiatrists, psychologists, and mental health specialists."
            />
            <InfoCard
              icon={Clock}
              title="Flexible Scheduling"
              description="Choose between online therapy or face-to-face sessions at times that work for you."
            />
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Mental Health Resources"
            subtitle="Educational videos to help you understand and manage your mental health journey."
            centered
            className="mb-12 flex flex-col items-center"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentalHealthVideos.map((video, index) => (
              <VideoEmbed key={index} url={video.url} title={video.title} />
            ))}
          </div>
        </div>
      </section>

      {/* Advocacy Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Advocacy & News"
            subtitle="Stay informed about mental health awareness, research, and community initiatives."
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {advocacyArticles.map((article, index) => (
              <article
                key={index}
                className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <time className="text-sm text-muted-foreground">
                  {article.date}
                </time>
                <h3 className="mt-2 text-xl font-semibold text-foreground mb-3">
                  {article.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <Link
                  href="#"
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Professionals */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Are You a Mental Health Professional?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
            Join our network of dedicated professionals making a difference in
            people's lives. Help us expand access to quality mental health care.
          </p>
          <Button size="lg" asChild>
            <Link href="/professional-registration">Join Our Network</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
