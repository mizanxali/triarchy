export const constructMessage = ({
  walletAddress,
  issuedAt,
  expiresAt,
  nonce,
}: {
  walletAddress: string;
  issuedAt: Date;
  expiresAt: Date;
  nonce: string;
}) => {
  const message = [
    'Click "Sign" to confirm your understanding and consent.',
    'This signature does not trigger any blockchain transaction or incur gas fees.',
    'It serves as proof of your agreement to the following:',
    '\nComprehensive Understanding:',
    '- I fully understand the functions, purposes, and technical details of Media nodes.',
    '- This includes their role in the Huddle01 architecture, working principles, profit mechanisms, and operational requirements.',
    '\nInformed Consent:',
    '- I have carefully read and understood all relevant documents and information.',
    '- This includes the technical whitepaper, user guides, FAQs, and other official materials.',
    '- I confirm I have a comprehensive and accurate understanding of the product.',
    `\nAccount: ${walletAddress}`,
    `\nIssued At: ${issuedAt.toISOString()}`,
    `\nExpires At: ${expiresAt.toISOString()}`,
    `\nNonce: ${nonce}`,
  ].join('\n');

  return message;
};

const encodeFormat = 'hex';

const createHmac = async (message: string, secretKey: string) => {
  // Convert the secret key to an ArrayBuffer
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);

  // Import the key
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  // Sign the message
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message),
  );

  // Convert the signature to hex
  return Buffer.from(signature).toString(encodeFormat);
};

export const generateNonce = async () => {
  const sessionId = Math.random().toString(36).substring(7);
  const randomValue = Math.random().toString(36).substring(7);
  const message = `${sessionId}!${randomValue}`;
  const hmac = await createHmac(message, process.env.AUTH_SECRET ?? '');

  return `${hmac}.${message}`;
};
