// app/api/livekit/token/route.ts
import { AccessToken } from 'livekit-server-sdk';

export async function POST(req: Request) {
  const { roomName, participantName } = await req.json();
  
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: participantName,
      name: participantName,
    }
  );
  
  at.addGrant({ 
    roomJoin: true, 
    room: roomName,
    canPublish: true,
    canSubscribe: true
  });

  return new Response(JSON.stringify({
    token: at.toJwt()
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
