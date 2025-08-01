export async function POST(request: Request) {
  try {
    const { level, message, walletAddress, context } = await request.json();
    
    const logMessage = `[${level.toUpperCase()}] ${walletAddress ? `[Wallet: ${walletAddress}] ` : ''}${message}`;
    
    if (context) {
      console.log(logMessage, context);
    } else {
      console.log(logMessage);
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('[SERVER LOG ERROR]', error);
    return Response.json({ error: 'Failed to log' }, { status: 500 });
  }
}