// Serviços relacionados à carteira inteligente
export interface SmartWallet {
  id: string;
  accountAbstraction: string;
  externallyOwnedAccount: string;
  factory: string;
  salt: string;
  registeredAt: string;
}

export interface CreateWalletRequest {
  externallyOwnedAccount: string;
}

export interface CreateWalletResponse {
  wallet: SmartWallet;
}

export interface GetWalletResponse {
  wallet: SmartWallet;
}

export interface PortfolioResponse {
  // Defina a estrutura baseada na resposta real da API
  [key: string]: any;
}

/**
 * Cria uma nova carteira inteligente
 */
export async function createSmartWallet(data: CreateWalletRequest): Promise<CreateWalletResponse> {
  const response = await fetch('/api/wallet/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMessage = result.error || result.message || JSON.stringify(result) || 'Ocorreu um erro ao criar a carteira.';
    throw new Error(errorMessage);
  }

  return result;
}

/**
 * Busca uma carteira existente pelo EOA
 */
export async function getWalletByEoa(externallyOwnedAccount: string): Promise<GetWalletResponse> {
  const response = await fetch(`/api/wallet/get-by-eoa?externallyOwnedAccount=${externallyOwnedAccount}`);
  
  const result = await response.json();
  
  if (!response.ok) {
    const errorMessage = result.error || result.message || JSON.stringify(result) || 'Ocorreu um erro ao verificar a carteira.';
    throw new Error(errorMessage);
  }

  return result;
}

/**
 * Busca o portfólio de uma carteira
 */
export async function getPortfolio(walletAddress: string): Promise<PortfolioResponse> {
  const response = await fetch(`/api/wallet/get-portfolio?walletAddress=${walletAddress}`);
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Ocorreu um erro ao buscar o portfólio.');
  }

  return result;
}
