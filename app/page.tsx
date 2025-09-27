"use client";

import { useState, useEffect } from 'react';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import type { PrivateKeyAccount } from 'viem/accounts';

interface SmartWallet {
  id: string;
  accountAbstraction: string;
  externallyOwnedAccount: string;
  factory: string;
  salt: string;
  registeredAt: string;
}

export default function Home() {
  const [eoa, setEoa] = useState<PrivateKeyAccount | null>(null);
  const [smartWallet, setSmartWallet] = useState<SmartWallet | null>(null);

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
      const res = await fetch('/api/create-smart-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externallyOwnedAccount: eoa.address }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao criar a carteira.');
      }
      setSmartWallet(data.wallet);
      setResponseJson(data);
    } catch (err: any) {
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
      const res = await fetch(`/api/get-wallet-by-eoa?externallyOwnedAccount=${eoa.address}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao verificar a carteira.');
      }
      setSmartWallet(data.wallet); // Atualiza o estado com a carteira recuperada
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
      const res = await fetch(`/api/get-portfolio?walletAddress=${smartWallet.accountAbstraction}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Ocorreu um erro ao buscar o portfólio.');
      }
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
    setApiCalled('start-kyc');
    alert('TODO: Implementar chamada para /api/start-kyc');
  };

  const handleClearStorage = () => {
    localStorage.removeItem('ponteCriptoTesterPrivateKey');
    window.location.reload(); // Recarrega a página para gerar nova chave
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
      <main className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header e Seção de Informações da Carteira (sem mudanças) */}
        <header className="text-center">
          <h1 className="text-4xl font-bold">Ponte Cripto Fácil</h1>
          <p className="text-lg text-gray-400">Painel de Testes - Notus API (Trilha A)</p>
        </header>
        <section className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Informações da Carteira</h2>
          {eoa ? (
            <div className="font-mono text-sm break-all">
              <p><strong>EOA Address:</strong> {eoa.address}</p>
              <p><strong>Smart Wallet:</strong> {smartWallet?.accountAbstraction || 'Ainda não criada ou recuperada'}</p>
            </div>
          ) : (
            <p>Gerando carteira de testes...</p>
          )}
        </section>
        
        {/* Seção de Ações com o novo botão */}
        <section className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Ações da Trilha A</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={handleCreateSmartWallet}
              disabled={isLoading || !eoa}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              1. Criar Smart Wallet
            </button>
            <button
              onClick={handleGetExistingWallet}
              disabled={isLoading || !eoa}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              1b. Verificar Existente
            </button>
            <button
              onClick={handleGetPortfolio}
              disabled={isLoading || !smartWallet}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              2. Ver Portfólio
            </button>
            <button
              onClick={handleGetHistory}
              disabled={isLoading || !smartWallet}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              3. Ver Histórico
            </button>
            <button
              onClick={handleStartKyc}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              4. Iniciar KYC
            </button>
            <button
              onClick={handleClearStorage}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Limpar Storage
            </button>
          </div>
        </section>
        
        {/* Seção de Resposta da API*/}
        <section className="bg-gray-950 p-4 rounded-lg min-h-[200px]">
          <h2 className="text-xl font-semibold mb-2">Resposta da API</h2>
          <p className="text-sm">{apiCalled}</p>
          {isLoading && <p className="text-yellow-400">Carregando...</p>}
          {error && <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>}
          {responseJson && (
            <pre className="text-green-300 text-xs whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(responseJson, null, 2)}
            </pre>
          )}
        </section>
      </main>
    </div>
  );
}