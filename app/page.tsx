// app/page.tsx

"use client"; // Marca este componente como interativo (Client Component)

import { useState, useEffect } from 'react';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import type { PrivateKeyAccount } from 'viem/accounts';

// Tipagem para a resposta da Smart Wallet (baseado na documentação)
interface SmartWallet {
  id: string;
  accountAbstraction: string;
  externallyOwnedAccount: string;
  factory: string;
  salt: string;
  registeredAt: string;
}

export default function Home() {
  // Estados para gerenciar as informações na tela
  const [eoa, setEoa] = useState<PrivateKeyAccount | null>(null);
  const [smartWallet, setSmartWallet] = useState<SmartWallet | null>(null);
  
  const [responseJson, setResponseJson] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Efeito que roda uma vez quando a página carrega
  useEffect(() => {
    // Procura por uma chave privada no armazenamento local do navegador
    let pk = localStorage.getItem('easyCryptoTesterPrivateKey');
    
    // Se não encontrar, cria uma nova e salva
    if (!pk) {
      console.log("Nenhuma chave privada encontrada. Gerando uma nova...");
      pk = generatePrivateKey();
      localStorage.setItem('easyCryptoTesterPrivateKey', pk);
    }

    // Cria a conta (EOA) a partir da chave privada
    const account = privateKeyToAccount(pk as `0x${string}`);
    setEoa(account);
  }, []); // O array vazio [] garante que isso só rode na montagem do componente

  // Função para chamar nossa API BFF e criar a Smart Wallet
  const handleCreateSmartWallet = async () => {
    if (!eoa) return; // Garante que a EOA já foi carregada

    setIsLoading(true);
    setError('');
    setResponseJson(null);

    try {
      const res = await fetch('/api/create-smart-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externallyOwnedAccount: eoa.address }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Se a API retornar um erro, lança uma exceção para ser pega no catch
        throw new Error(data.message || 'Ocorreu um erro ao criar a carteira.');
      }
      
      // Se deu tudo certo, atualiza os estados
      setSmartWallet(data.wallet);
      setResponseJson(data);

    } catch (err: any) {
      setError(err.message);
      setResponseJson({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- Funções para os próximos passos (placeholders) ---
  const handleGetPortfolio = async () => {
    alert('TODO: Implementar chamada para /api/get-portfolio');
  }
  const handleGetHistory = async () => {
    alert('TODO: Implementar chamada para /api/get-history');
  }
  const handleStartKyc = async () => {
    alert('TODO: Implementar chamada para /api/start-kyc');
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
      <main className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold">Ponte Cripto Fácil</h1>
          <p className="text-lg text-gray-400">Painel de Testes - Notus API (Trilha A)</p>
        </header>

        <section className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Informações da Carteira</h2>
          {eoa ? (
            <div className="font-mono text-sm break-all">
              <p><strong>EOA Address:</strong> {eoa.address}</p>
              <p><strong>Smart Wallet:</strong> {smartWallet?.accountAbstraction || 'Ainda não criada'}</p>
            </div>
          ) : (
            <p>Gerando carteira de testes...</p>
          )}
        </section>

        <section className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Ações da Trilha A</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={handleCreateSmartWallet}
              disabled={isLoading || !eoa}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              1. Criar Smart Wallet
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
          </div>
        </section>

        <section className="bg-gray-950 p-4 rounded-lg min-h-[200px]">
          <h2 className="text-xl font-semibold mb-2">Resposta da API</h2>
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