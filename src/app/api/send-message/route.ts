import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  console.log("➡️ Received request on /api/send-message");

  await dbConnect();

  try {
    const { username, content } = await request.json();
    console.log("📩 Request body:", { username, content });

    if (!username || !content) {
      console.log("❌ Missing username or content");
      return Response.json(
        { success: false, message: "Username and message content are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });
    console.log("👤 User lookup result:", user);

    if (!user) {
      console.log(`❌ User not found: ${username}`);
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    console.log(
      `✅ Found user: ${user.username}, accepting messages: ${user.isAcceptingMessages}`
    );

    if (!user.isAcceptingMessages) {
      console.log(`⚠️ User ${username} is NOT accepting messages`);
      return Response.json(
        { success: false, message: `User ${username} is not accepting messages` },
        { status: 403 }
      );
    }

    console.log("📝 Pushing new message to user.messages...");
    user.messages.push({ content, createdAt: new Date() });

    await user
      .save()
      .then(() => console.log("💾 Message saved to DB successfully"))
      .catch((error:Error) => console.error("❌ Error while saving message:", error));

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error in send-message API:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
