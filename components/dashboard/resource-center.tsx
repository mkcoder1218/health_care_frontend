import { Card } from "@/components/ui/card"
import { VideoEmbed } from "@/components/ui/video-embed"
import { FileText, Video, Headphones } from "lucide-react"

export function ResourceCenter() {
  const resources = {
    videos: [
      {
        url: "https://www.youtube.com/watch?v=3QIfkeA6HBY",
        title: "Understanding Anxiety",
        description: "Learn about anxiety symptoms and coping strategies",
      },
      {
        url: "https://www.youtube.com/watch?v=DxIDKZHW3-E",
        title: "Mindfulness Meditation",
        description: "Guided meditation for stress relief",
      },
    ],
    articles: [
      {
        title: "5 Daily Habits for Better Mental Health",
        description: "Simple practices you can incorporate into your routine",
        date: "Assigned 2 days ago",
      },
      {
        title: "Understanding Cognitive Behavioral Therapy",
        description: "How CBT works and what to expect in therapy",
        date: "Assigned 1 week ago",
      },
      {
        title: "Managing Work-Life Balance",
        description: "Strategies for reducing stress and preventing burnout",
        date: "Assigned 2 weeks ago",
      },
    ],
    exercises: [
      {
        title: "Deep Breathing Exercise",
        description: "5-minute guided breathing technique for anxiety relief",
        duration: "5 min",
      },
      {
        title: "Progressive Muscle Relaxation",
        description: "Reduce physical tension and promote relaxation",
        duration: "10 min",
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Assigned Videos */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-serif font-bold text-foreground">Assigned Videos</h2>
        </div>
        <p className="text-muted-foreground mb-6">Videos recommended by your therapist</p>
        <div className="grid md:grid-cols-2 gap-6">
          {resources.videos.map((video, index) => (
            <div key={index}>
              <VideoEmbed url={video.url} title={video.title} />
              <div className="mt-3">
                <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reading Materials */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-serif font-bold text-foreground">Reading Materials</h2>
        </div>
        <p className="text-muted-foreground mb-6">Articles and resources for your mental health journey</p>
        <div className="space-y-4">
          {resources.articles.map((article, index) => (
            <div
              key={index}
              className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold text-foreground mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
              <p className="text-xs text-muted-foreground">{article.date}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Exercises */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-serif font-bold text-foreground">Therapeutic Exercises</h2>
        </div>
        <p className="text-muted-foreground mb-6">Practice these exercises between sessions</p>
        <div className="grid md:grid-cols-2 gap-4">
          {resources.exercises.map((exercise, index) => (
            <div key={index} className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{exercise.title}</h3>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {exercise.duration}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{exercise.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
