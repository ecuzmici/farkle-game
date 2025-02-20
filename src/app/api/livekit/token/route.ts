// app/api/livekit/token/route.ts
import { AccessToken } from 'livekit-server-sdk';

export async function POST(req: Request) {
  try {
    const { roomName, participantName } = await req.json();
    
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: participantName,
        name: participantName
      }
    );

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true
    });

    const token = await at.toJwt();
    return new Response(JSON.stringify({ token }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
