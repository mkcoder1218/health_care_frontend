"use client";
import React, { useState } from "react";
import VideoRoom from "@/components/VideoRoom";

export default function Page() {
  const [userId, setUserId] = useState("");
  const [joined, setJoined] = useState(false);
  const roomId = "room1"; // static room for now

  if (!joined) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Enter your User ID</h1>
        <input
          type="text"
          placeholder="Type your ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border px-2 py-1 rounded-md w-64"
        />
        <button
          disabled={!userId}
          onClick={() => setJoined(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-fit"
        >
          Join Room
        </button>
      </div>
    );
  }

  return <VideoRoom roomId={roomId} userId={userId} />;
}
