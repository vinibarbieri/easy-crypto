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
  tokens: string[],
  nfts: string[],
  portfolio: string[];
}

export interface HistoryResponse {
  history: string[];
}



/**
 * @description Cria uma nova carteira inteligente
 * @param data - Dados da carteira para criação
 * @returns Resposta da API
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
 * @description Busca uma carteira existente pelo EOA
 * @param externallyOwnedAccount - Endereço da EOA
 * @returns Resposta da API
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
 * @description Busca o portfólio de uma carteira
 * @param walletAddress - Endereço da carteira
 * @returns Resposta da API
 */
export async function getPortfolio(walletAddress: string): Promise<PortfolioResponse> {
  const response = await fetch(`/api/wallet/get-portfolio?walletAddress=${walletAddress}`);
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Ocorreu um erro ao buscar o portfólio.');
  }

  return result;
}


/**
 * @description Busca o histórico de uma carteira
 * @param walletAddress - Endereço da carteira
 * @returns Resposta da API
 */
export async function getHistory(walletAddress: string): Promise<HistoryResponse> {
  const response = await fetch(`/api/wallet/get-history?walletAddress=${walletAddress}`);

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Ocorreu um erro ao buscar o histórico.');
  }

  return result;
}