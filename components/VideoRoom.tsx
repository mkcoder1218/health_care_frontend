"use client";
import React, { useRef, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { BASE_URL } from "@/integration/config";

interface VideoRoomProps {
  roomId: string;
  userId: string;
  socketUrl?: string;
}

export default function VideoRoom({ roomId, userId, socketUrl }: VideoRoomProps) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const socketIdRef = useRef<string>("");
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [recordingOwner, setRecordingOwner] = useState<string | null>(null);

  const startMeeting = async () => {
    try {
      if (!roomId) {
        alert("Missing booking id for meeting.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
        audio: true,
      });
      localStreamRef.current = stream;
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
        const remoteStream = event.streams[0];
        remoteStreamRef.current = remoteStream;
        if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
      };

      // ICE candidates
      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("ice-candidate", {
            candidate: event.candidate,
            roomId,
            from: socketIdRef.current,
          });
        }
      };

      // Join room
      socketRef.current?.emit("join-room", { roomId, userId });
      socketRef.current?.emit("meeting-started", {
        bookingId: roomId,
        userId,
      });
      setStarted(true);
    } catch (err) {
      console.error("Camera/Mic error:", err);
      alert("Cannot access camera/mic");
    }
  };

  useEffect(() => {
    socketRef.current = io(socketUrl || BASE_URL);
    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current?.id || "";
    });

    socketRef.current.on("room-users", (users: string[]) => {
      setParticipants(users);
      const owner = [socketIdRef.current, ...users].filter(Boolean).sort()[0] || null;
      setRecordingOwner(owner);
    });

    socketRef.current.on("new-participant", async (otherUserId: string) => {
      setParticipants((prev) => {
        const next = prev.includes(otherUserId) ? prev : [...prev, otherUserId];
        const owner = [socketIdRef.current, ...next].filter(Boolean).sort()[0] || null;
        setRecordingOwner(owner);
        return next;
      });
      if (!pc.current) return;
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socketRef.current?.emit("offer", {
        sdp: offer,
        to: otherUserId,
        from: socketIdRef.current,
      });
    });

    socketRef.current.on(
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
        socketRef.current?.emit("answer", {
          sdp: answer,
          to: from,
          from: socketIdRef.current,
        });
      }
    );

    socketRef.current.on("answer", async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      if (!pc.current) return;
      await pc.current.setRemoteDescription(sdp);
    });

    socketRef.current.on(
      "ice-candidate",
      async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        if (!pc.current || !candidate) return;
        await pc.current.addIceCandidate(candidate);
      }
    );

    socketRef.current.on("participant-left", (leftId: string) => {
      setParticipants((prev) => {
        const next = prev.filter((id) => id !== leftId);
        const owner = [socketIdRef.current, ...next].filter(Boolean).sort()[0] || null;
        setRecordingOwner(owner);
        return next;
      });
    });

    return () => {
      socketRef.current?.off("new-participant");
      socketRef.current?.off("offer");
      socketRef.current?.off("answer");
      socketRef.current?.off("ice-candidate");
      socketRef.current?.off("room-users");
      socketRef.current?.off("participant-left");
      socketRef.current?.disconnect();
    };
  }, [userId]);

  const startRecording = () => {
    if (!localStreamRef.current || isRecording) return;
    const local = localStreamRef.current;
    const remote = remoteStreamRef.current;
    const tracks = remote
      ? [...local.getTracks(), ...remote.getTracks()]
      : local.getTracks();
    const stream = new MediaStream(tracks);
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9,opus",
      videoBitsPerSecond: 500_000,
      audioBitsPerSecond: 64_000,
    });
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const form = new FormData();
      form.append(
        "file",
        blob,
        `meeting-${roomId}-${Date.now()}.webm`,
      );
      form.append("booking_id", roomId);
      form.append("uploader_user_id", userId);
      try {
        await fetch(`${BASE_URL}/api/meeting/upload`, {
          method: "POST",
          body: form,
        });
      } catch (err) {
        console.error("Failed to upload recording", err);
      }
    };
    recorderRef.current = recorder;
    recorder.start(2000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!recorderRef.current || recorderRef.current.state === "inactive") {
      return;
    }
    recorderRef.current.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    if (!started || !recordingOwner) return;
    const isOwner = recordingOwner === socketIdRef.current;
    if (isOwner && !isRecording) startRecording();
    if (!isOwner && isRecording) stopRecording();
  }, [recordingOwner, started]);

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted((prev) => !prev);
  };

  const toggleCamera = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsCameraOff((prev) => !prev);
  };

  const endCall = () => {
    pc.current?.close();
    pc.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    if (localRef.current) localRef.current.srcObject = null;
    if (remoteRef.current) remoteRef.current.srcObject = null;
    stopRecording();
    setStarted(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {!started ? null : null}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 h-28 w-40 rounded-xl border border-white/30 object-cover shadow-lg"
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleMute}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${isMuted ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700"}`}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${isCameraOff ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-700"}`}
        >
          {isCameraOff ? "Camera On" : "Camera Off"}
        </button>
        <button
          onClick={endCall}
          className="px-5 py-2 rounded-full text-sm font-semibold bg-rose-600 text-white"
        >
          End
        </button>
      </div>

      {!started && (
        <button
          onClick={startMeeting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-fit"
        >
          Start Meeting
        </button>
      )}
    </div>
  );
}
