import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Award, Calendar } from "lucide-react"

export function ProfessionalProfile() {
  // Mock professional data
  const professional = {
    name: "Dr. Sarah Johnson",
    profession: "Clinical Psychologist",
    specializations: ["Anxiety Disorders", "Depression", "Trauma", "CBT"],
    bio: "Dr. Sarah Johnson is a licensed clinical psychologist with over 12 years of experience in treating anxiety, depression, and trauma-related disorders. She specializes in Cognitive Behavioral Therapy (CBT) and has helped hundreds of clients achieve their mental health goals.",
    education: ["PhD in Clinical Psychology - Stanford University", "MA in Counseling Psychology - UCLA"],
    email: "dr.johnson@mindcare.com",
    phone: "+1 (555) 987-6543",
    image: "/therapist-portrait.png",
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-6 mb-6">
        <img
          src={professional.image || "/placeholder.svg"}
          alt={professional.name}
          className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-1">{professional.name}</h2>
          <p className="text-lg text-primary font-medium mb-3">{professional.profession}</p>
          <div className="flex flex-wrap gap-2">
            {professional.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary">
                {spec}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            About
          </h3>
          <p className="text-muted-foreground leading-relaxed">{professional.bio}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Education</h3>
          <ul className="space-y-1">
            {professional.education.map((edu, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {edu}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <a href={`mailto:${professional.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <a href={`tel:${professional.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </a>
            </Button>
            <Button className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
