"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function SendMessage() {
  const { username } = useParams<{ username: string }>();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const payload = { username, content };

    try {
      const res = await axios.post("/api/send-message", payload);
      console.log("✅ Response:", res.data);
      setStatus("success");
      setContent(""); 
    } catch (error: any) {
      console.error("❌ Error:", error.response?.data || error.message);
      setStatus("error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Send an Anonymous Message
        </h1>
        <p className="text-center text-gray-500 mb-6">
          to <span className="font-semibold text-indigo-600">{username}</span>
        </p>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your secret message..."
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700 resize-none"
            rows={4}
          />

          <button
            type="submit"
            disabled={status === "loading" || !content.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all disabled:bg-gray-400"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-green-600 text-center font-medium">
            🎉 Your message was sent!
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-600 text-center font-medium">
            ❌ Failed to send. Try again.
          </p>
        )}
      </div>
    </div>
  );
}
