// Serviços relacionados ao KYC (Know Your Customer)

export interface KycSession {
  id: string;
  // Adicione outros campos conforme a resposta real da API
  [key: string]: any;
}

export interface StartKycResponse {
  session: KycSession;
  // Adicione outros campos conforme a resposta real da API
  [key: string]: any;
}

/**
 * Inicia uma nova sessão de KYC
 */
export async function startKyc(): Promise<StartKycResponse> {
  const response = await fetch('/api/kyc/start', { 
    method: 'POST' 
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    const errorMessage = result.error || result.message || JSON.stringify(result) || 'Ocorreu um erro ao iniciar a sessão KYC.';
    throw new Error(errorMessage);
  }

  return result;
}

/**
 * Verifica o status de uma sessão de KYC
 */
export async function checkKycStatus(sessionId: string): Promise<any> {
  const response = await fetch(`/api/kyc/check-status?sessionId=${sessionId}`);

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.error || result.message || JSON.stringify(result) || 'Ocorreu um erro ao verificar o status da sessão KYC.';
    throw new Error(errorMessage);
  }

  return result;
}

export async function processKyc(sessionId: string): Promise<any> {
  const res = await fetch(`/api/kyc/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: sessionId }),
  });

  const result = await res.json();

  if (!res.ok) {
    const errorMessage = result.error || result.message || JSON.stringify(result) || 'Ocorreu um erro ao processar a sessão KYC.';
    throw new Error(errorMessage);
  }

  return result;
}
