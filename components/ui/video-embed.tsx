interface VideoEmbedProps {
  url: string
  title: string
  className?: string
}

export function VideoEmbed({ url, title, className }: VideoEmbedProps) {
  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getYouTubeId(url)
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url

  return (
    <div className={className}>
      <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-muted">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  )
}
