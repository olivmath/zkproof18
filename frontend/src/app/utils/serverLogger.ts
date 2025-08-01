let currentWalletAddress: string | null = null;

export const setWalletAddress = (address: string | null) => {
  currentWalletAddress = address;
};

const sendLog = async (level: string, message: string, context?: any) => {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        message,
        walletAddress: currentWalletAddress,
        context
      })
    });
  } catch (error) {
    // Fallback silencioso
  }
};

export const serverLog = {
  info: (message: string, context?: any) => sendLog('info', message, context),
  error: (message: string, context?: any) => sendLog('error', message, context),
  warn: (message: string, context?: any) => sendLog('warn', message, context)
};