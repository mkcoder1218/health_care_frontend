"use client";
import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://192.168.1.3:3002"); // replace with your server URL if needed

interface VideoRoomProps {
  roomId: string;
  userId: string;
}

export default function VideoRoom({ roomId, userId }: VideoRoomProps) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const [started, setStarted] = useState(false);

  const startMeeting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localRef.current) localRef.current.srcObject = stream;

      pc.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // Add local tracks
      stream
        .getTracks()
        .forEach((track) => pc.current?.addTrack(track, stream));

      // Remote tracks
      pc.current.ontrack = (event) => {
        if (remoteRef.current) remoteRef.current.srcObject = event.streams[0];
      };

      // ICE candidates
      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            roomId,
            from: userId,
          });
        }
      };

      // Join room
      socket.emit("join-room", { roomId, userId });
      setStarted(true);
    } catch (err) {
      console.error("Camera/Mic error:", err);
      alert("Cannot access camera/mic");
    }
  };

  useEffect(() => {
    socket.on("new-participant", async (otherUserId: string) => {
      if (!pc.current) return;
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.emit("offer", { sdp: offer, to: otherUserId, from: userId });
    });

    socket.on(
      "offer",
      async ({
        sdp,
        from,
      }: {
        sdp: RTCSessionDescriptionInit;
        from: string;
      }) => {
        if (!pc.current) return;
        await pc.current.setRemoteDescription(sdp);
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        socket.emit("answer", { sdp: answer, to: from, from: userId });
      }
    );

    socket.on("answer", async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      if (!pc.current) return;
      await pc.current.setRemoteDescription(sdp);
    });

    socket.on(
      "ice-candidate",
      async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        if (!pc.current || !candidate) return;
        await pc.current.addIceCandidate(candidate);
      }
    );

    return () => {
      socket.off("new-participant");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [userId]);

  return (
    <div className="flex flex-col gap-4">
      {!started && (
        <button
          onClick={startMeeting}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-fit"
        >
          Start Meeting
        </button>
      )}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="rounded-md w-full"
        />
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="rounded-md w-full"
        />
      </div>
    </div>
  );
}
