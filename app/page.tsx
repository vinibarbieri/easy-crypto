"use client";

import { useState, useEffect } from 'react';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import type { PrivateKeyAccount } from 'viem/accounts';
import { 
  SmartWallet, 
  createSmartWallet, 
  getWalletByEoa, 
  getPortfolio,
  startKyc,
  checkKycStatus,
  processKyc
} from './services';

export default function Home() {
  const [eoa, setEoa] = useState<PrivateKeyAccount | null>(null);
  const [smartWallet, setSmartWallet] = useState<SmartWallet | null>(null);
  const [kycSessionId, setKycSessionId] = useState<string | null>(null);

  const [apiCalled, setApiCalled] = useState<string>('');
  
  const [responseJson, setResponseJson] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let pk = localStorage.getItem('ponteCriptoTesterPrivateKey');
    if (!pk) {
      pk = generatePrivateKey();
      localStorage.setItem('ponteCriptoTesterPrivateKey', pk);
    }
    const account = privateKeyToAccount(pk as `0x${string}`);
    setEoa(account);
  }, []);

  const handleCreateSmartWallet = async () => {
    if (!eoa) return;
    setIsLoading(true);
    setError('');
    setResponseJson(null);
    try {
      setApiCalled('POST /api/v1/wallets/register');
      const data = await createSmartWallet({ externallyOwnedAccount: eoa.address });
      setSmartWallet(data.wallet);
      setResponseJson(data);
    } catch (err: any) {
      console.log(err);
      setError(err.message);
      setResponseJson({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetExistingWallet = async () => {
    if (!eoa) return;
    setIsLoading(true);
    setError('');
    setResponseJson(null);
    try {
      setApiCalled('GET /api/v1/wallets/address');
      const data = await getWalletByEoa(eoa.address);
      setSmartWallet(data.wallet);
      setResponseJson(data);
    } catch (err: any) {
      setError(err.message);
      setResponseJson({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPortfolio = async () => {
     if (!smartWallet) {
      setError('Recupere ou crie uma Smart Wallet primeiro.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResponseJson(null);
    try {
      setApiCalled('GET /api/v1/wallets/{walletAddress}/portfolio');
      const data = await getPortfolio(smartWallet.accountAbstraction);
      setResponseJson(data);
    } catch (err: any) {
      setError(err.message);
      setResponseJson({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHistory = async () => {
    setApiCalled('get-history');
    alert('TODO: Implementar chamada para /api/get-history');
  };

  const handleStartKyc = async () => {
    setIsLoading(true);
    setError('');
    setResponseJson(null);
    try {
      setApiCalled('POST /api/start-kyc');
      const data = await startKyc();
      
      // Salva a resposta completa para exibição
      setResponseJson(data);
      // Extrai e salva o ID da sessão para o próximo passo
      if (data.session && data.session.id) {
        setKycSessionId(data.session.id);
      }
    } catch (err: any) {
      setError(err.message);
      setResponseJson({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckKycStatus = async () => {
    if(!kycSessionId) {
      alert('Inicie uma sessão KYC primeiro para obter um Session ID.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResponseJson(null);
    try {
      setApiCalled('GET /api/kyc-status');
      const data = await checkKycStatus(kycSessionId);
      setResponseJson(data);
    } catch (err: any) {
      setError(err.message);
      setResponseJson({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessKyc = async () => {
    if(!kycSessionId) {
      alert('Inicie uma sessão KYC primeiro para obter um Session ID.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResponseJson(null);

    try {
      setApiCalled(`POST /api/process-kyc (sessionId: ${kycSessionId})`);
      const data = processKyc(kycSessionId);

      setResponseJson(data);

    } catch (err: any) {
      setError(err.message);
      setResponseJson({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearStorage = () => {
    localStorage.removeItem('ponteCriptoTesterPrivateKey');
    window.location.reload(); // Recarrega a página para gerar nova chave
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-6 font-sans">
      <main className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header melhorado */}
        <header className="text-center py-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold">₿</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Easy Crypto
            </h1>
          </div>
          <p className="text-xl text-gray-300 font-medium">Tests Panel - Notus API (Track A)</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">System Online</span>
          </div>
        </header>

        {/* Seção de Informações da Carteira melhorada */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl border border-gray-600 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">💼</span>
            </div>
            <h2 className="text-2xl font-bold">Wallet Information</h2>
          </div>
          {eoa ? (
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 font-semibold">EOA Address</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <p className="font-mono text-sm break-all text-gray-200 bg-gray-800 p-3 rounded-lg">
                  {eoa.address}
                </p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 font-semibold">Smart Wallet</span>
                  {smartWallet ? (
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
                <p className="font-mono text-sm break-all text-gray-200 bg-gray-800 p-3 rounded-lg">
                  {smartWallet?.accountAbstraction || 'N/A - Crie uma Smart Wallet primeiro'}
                </p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 font-semibold">KYC Session ID</span>
                  {kycSessionId ? (
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
                <p className="font-mono text-sm break-all text-gray-200 bg-gray-800 p-3 rounded-lg">
                  {kycSessionId || 'N/A - Inicie um processo KYC primeiro'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-600">
              <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <p className="text-gray-300">Gerando carteira de testes...</p>
            </div>
          )}
        </section>
        
        {/* Seção de Ações melhorada */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl border border-gray-600 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h2 className="text-2xl font-bold">Track A Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Wallet Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Wallet</h3>
              <button
                onClick={handleCreateSmartWallet}
                disabled={isLoading || !eoa}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🏦</span>
                  <span>1. Create Smart Wallet</span>
                </div>
              </button>
              <button
                onClick={handleGetExistingWallet}
                disabled={isLoading || !eoa}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🔍</span>
                  <span>1b. Check Existing</span>
                </div>
              </button>
            </div>

            {/* Portfolio Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Portfolio</h3>
              <button
                onClick={handleGetPortfolio}
                disabled={isLoading || !smartWallet}
                className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📊</span>
                  <span>2. Check Portfolio</span>
                </div>
              </button>
              <button
                onClick={handleGetHistory}
                disabled={isLoading || !smartWallet}
                className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📈</span>
                  <span>3. Check History</span>
                </div>
              </button>
            </div>

            {/* KYC Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">KYC Process</h3>
              <button
                onClick={handleStartKyc}
                disabled={isLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  <span>4. Start KYC</span>
                </div>
              </button>
              <button
                onClick={handleCheckKycStatus}
                disabled={isLoading || !kycSessionId}
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🔍</span>
                  <span>5. Check Status</span>
                </div>
              </button>
              <button
                onClick={handleProcessKyc}
                disabled={isLoading || !kycSessionId}
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>⚙️</span>
                  <span>6. Process KYC</span>
                </div>
              </button>
            </div>

            {/* Utility Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-red-300 mb-3">Utilities</h3>
              <button
                onClick={handleClearStorage}
                className="w-full cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🗑️</span>
                  <span>Clear Storage</span>
                </div>
              </button>
            </div>
          </div>
        </section>
        
        {/* Seção de Resposta da API melhorada */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl border border-gray-600 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📡</span>
            </div>
            <h2 className="text-2xl font-bold">API Response</h2>
            {isLoading && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                <span className="text-yellow-400 font-medium">Processing...</span>
              </div>
            )}
          </div>
          
          {apiCalled && (
            <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-600">
              <span className="text-sm text-gray-400">Endpoint:</span>
              <span className="text-sm text-blue-300 font-mono ml-2">{apiCalled}</span>
            </div>
          )}
          
          <div className="min-h-[200px] bg-gray-900 rounded-xl border border-gray-600 p-4">
            {error ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-red-400">❌</span>
                  <span className="text-red-400 font-semibold">Error</span>
                </div>
                <pre className="text-red-300 text-sm whitespace-pre-wrap bg-red-900/20 p-4 rounded-lg border border-red-800">
                  {error}
                </pre>
              </div>
            ) : responseJson ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-400">✅</span>
                  <span className="text-green-400 font-semibold">Success</span>
                </div>
                <pre className="text-green-300 text-sm whitespace-pre-wrap bg-green-900/20 p-4 rounded-lg border border-green-800 overflow-x-auto">
                  {JSON.stringify(responseJson, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📋</div>
                  <p>No response yet</p>
                  <p className="text-sm">Execute an action to see the API response</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}