export interface KycSession {
  id: string;
  [key: string]: unknown;
}

export interface StartKycResponse {
  session: KycSession;
  [key: string]: unknown;
}

export interface KycUserData {
  firstName: string,
  lastName: string,
  birthDate: string,
  email: string,

  // Documento
  documentId: string,
  documentCategory: string,
  documentCountry: string,
  
  // Endereço
  address: string, // Apenas a rua e número
  city: string,
  state: string,
  postalCode: string, // CEP sem formatação

  livenessRequired: boolean
}


/**
 * @description Inicia uma nova sessão de KYC
 * @param kycUserData - Dados do usuário para KYC
 * @returns Resposta da API
 */
export async function startKyc(kycUserData: KycUserData): Promise<StartKycResponse> {
  const response = await fetch('/api/kyc/start', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kycUserData)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    const errorMessage = result.error || result.message || JSON.stringify(result) || 'Ocorreu um erro ao iniciar a sessão KYC.';
    throw new Error(errorMessage);
  }

  return result;
}


/**
 * @description Verifica o status de uma sessão de KYC
 * @param sessionId - ID da sessão de KYC
 * @returns Resposta da API
 */
export async function checkKycStatus(sessionId: string): Promise<unknown> {
  const response = await fetch(`/api/kyc/check-status?sessionId=${sessionId}`);

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result.error || result.message || JSON.stringify(result) || 'Ocorreu um erro ao verificar o status da sessão KYC.';
    throw new Error(errorMessage);
  }

  return result;
}


/**
 * @description Processa uma sessão de KYC
 * @param sessionId - ID da sessão de KYC
 * @returns Resposta da API
 */
export async function processKyc(sessionId: string): Promise<unknown> {
  const res = await fetch(`/api/kyc/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });

  const result = await res.json();

  if (!res.ok) {
    const errorMessage = result.error || result.message || JSON.stringify(result) || 'Ocorreu um erro ao processar a sessão KYC.';
    throw new Error(errorMessage);
  }

  return result;
}
