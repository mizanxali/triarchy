import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export const generateRandomAddress = () => {
  const privateKey = generatePrivateKey();

  const account = privateKeyToAccount(privateKey);

  return account.address;
};

// Generate burner wallet, and return the private key and address
export const generateBurnerWallet = () => {
  const privateKey = generatePrivateKey();

  const account = privateKeyToAccount(privateKey);

  return {
    privateKey,
    address: account.address,
  };
};
