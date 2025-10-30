"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  sender: "client" | "professional"
  content: string
  timestamp: string
}

export function MessagingInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "professional",
      content: "Hello! I'm looking forward to our session tomorrow. How have you been feeling this week?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "client",
      content:
        "Hi Dr. Johnson! I've been doing better. The breathing exercises you taught me have been really helpful.",
      timestamp: "10:45 AM",
    },
    {
      id: 3,
      sender: "professional",
      content:
        "That's wonderful to hear! Keep practicing them daily. Is there anything specific you'd like to discuss in our next session?",
      timestamp: "10:50 AM",
    },
    {
      id: 4,
      sender: "client",
      content: "Yes, I'd like to talk about managing work-related stress. It's been challenging lately.",
      timestamp: "11:00 AM",
    },
    {
      id: 5,
      sender: "professional",
      content:
        "Absolutely, we'll focus on that. I'll prepare some strategies we can work through together. See you tomorrow!",
      timestamp: "11:05 AM",
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "client",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src="/therapist-avatar.png"
            alt="Dr. Sarah Johnson"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-foreground">Dr. Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">Clinical Psychologist</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "client" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2",
                  message.sender === "client" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    message.sender === "client" ? "text-primary-foreground/70" : "text-muted-foreground/70",
                  )}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Messages are secure and confidential. Response time: Usually within 24 hours.
        </p>
      </form>
    </Card>
  )
}
