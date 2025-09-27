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
import Header from './components/layout/Header';
import WalletInfo from './components/wallet/WalletInfo';
import Button from './components/ui/button';
import ApiResponse from './components/api-response/apiResponse';

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
      setError('Recover or create a Smart Wallet first.');
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
    alert('TODO: Implement the call to /api/get-history');
  };

  const handleStartKyc = async () => {
    setIsLoading(true);
    setError('');
    setResponseJson(null);
    try {
      setApiCalled('POST /api/start-kyc');
      const data = await startKyc();
      
      setResponseJson(data);
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
      alert('Start a KYC session first to get a Session ID.');
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
      alert('Start a KYC session first to get a Session ID.');
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
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-6 font-sans">
      <main className="max-w-6xl mx-auto flex flex-col gap-6">
        <Header />

        <WalletInfo 
          eoa={eoa}
          smartWallet={smartWallet}
          kycSessionId={kycSessionId}
        />
        
        {/* Actions Section */}
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
              <Button
                onClick={handleCreateSmartWallet}
                disabled={isLoading || !eoa}
                color="blue"
                icon="🏦"
              >
                1. Create Smart Wallet
              </Button>
              <Button
                onClick={handleGetExistingWallet}
                disabled={isLoading || !eoa}
                color="blue"
                icon="🔍"
              >
                1b. Check Existing Wallet
              </Button>
            </div>

            {/* Portfolio Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Portfolio</h3>
              <Button
                onClick={handleGetPortfolio}
                disabled={isLoading || !smartWallet}
                color="green"
                icon="📊"
              >
                2. Check Portfolio
              </Button>
              <Button
                onClick={handleGetHistory}
                disabled={isLoading || !smartWallet}
                color="green"
                icon="📈"
              >
                3. Check History
              </Button>
            </div>

            {/* KYC Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">KYC Process</h3>
              <Button
                onClick={handleStartKyc}
                disabled={isLoading}
                color="purple"
                icon="🚀"
              >
                4. Start KYC
              </Button>
              <Button
                onClick={handleCheckKycStatus}
                disabled={isLoading || !kycSessionId}
                color="purple"
                icon="🔍"
              >
                5. Check Status
              </Button>
              <Button
                onClick={handleProcessKyc}
                disabled={isLoading || !kycSessionId}
                color="purple"
                icon="⚙️"
              >
                6. Process KYC
              </Button>
            </div>

            {/* Utility Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-red-300 mb-3">Utilities</h3>
              <Button
                onClick={handleClearStorage}
                color="red"
                icon="🗑️"
              >
                Clear Storage
              </Button>
            </div>
          </div>
        </section>
        
        <ApiResponse 
          isLoading={isLoading}
          error={error}
          responseJson={responseJson}
          apiCalled={apiCalled}
        />
      </main>
    </div>
  );
}