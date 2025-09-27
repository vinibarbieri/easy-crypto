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
import Tabs from './components/ui/tabs';
import ApiResponse from './components/api-response/apiResponse';
import Modal from './components/ui/modal';
import KycForm from './components/kyc/KycForm';

export default function Home() {
  const [eoa, setEoa] = useState<PrivateKeyAccount | null>(null);
  const [smartWallet, setSmartWallet] = useState<SmartWallet | null>(null);
  const [kycSessionId, setKycSessionId] = useState<string | null>(null);

  const [apiCalled, setApiCalled] = useState<string>('');
  
  const [responseJson, setResponseJson] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Modal states
  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let pk = localStorage.getItem('testerPrivateKey');
    if (!pk) {
      pk = generatePrivateKey();
      localStorage.setItem('testerPrivateKey', pk);
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
      setApiCalled(`GET /api/v1/wallets/${smartWallet.accountAbstraction}/portfolio`);
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

  const handleStartKyc = async (kycUserData: any) => {
    setIsLoading(true);
    setError('');
    setResponseJson(null);
    try {
      setApiCalled('POST /kyc/individual-verification-sessions/standard');
      const data = await startKyc(kycUserData);
      
      setResponseJson(data);
      if (data.session && data.session.id) {
        setKycSessionId(data.session.id);
      }
      setIsKycModalOpen(false); // Fechar modal após sucesso
    } catch (err: any) {
      setError(err.message);
      setResponseJson({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenKycModal = () => {
    setIsKycModalOpen(true);
  };

  const handleCloseKycModal = () => {
    setIsKycModalOpen(false);
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
      setApiCalled(`GET /kyc/individual-verification-sessions/standard/${kycSessionId}`);
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
      setApiCalled(`POST /kyc/individual-verification-sessions/standard/${kycSessionId}/process`);
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
    localStorage.removeItem('testerPrivateKey');
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-4 font-sans scrollbar-thin overflow-y-auto">
      <main className="max-w-7xl mx-auto flex flex-col gap-4">
        <Header />

        {/* Top Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Wallet Info */}
          <WalletInfo 
            eoa={eoa}
            smartWallet={smartWallet}
            kycSessionId={kycSessionId}
          />
          
          {/* Right Column - Actions */}
          <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 rounded-xl border border-gray-600 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">⚡</span>
              </div>
              <h2 className="text-lg font-bold">Track A Actions</h2>
            </div>
            
            <Tabs 
              tabs={[
                { id: 'wallet', label: 'Wallet', icon: '🏦', color: 'blue' },
                { id: 'portfolio', label: 'Portfolio', icon: '📊', color: 'green' },
                { id: 'kyc', label: 'KYC', icon: '🚀', color: 'purple' },
                { id: 'utils', label: 'Utils', icon: '⚙️', color: 'red' }
              ]}
              defaultTab="wallet"
            >
              {/* Wallet Tab */}
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
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
              </div>

              {/* Portfolio Tab */}
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
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
              </div>

              {/* KYC Tab */}
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleOpenKycModal}
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
              </div>

              {/* Utils Tab */}
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleClearStorage}
                    color="red"
                    icon="🗑️"
                  >
                    Clear Storage
                  </Button>
                </div>
              </div>
            </Tabs>
          </section>
        </div>
        
        <ApiResponse 
          isLoading={isLoading}
          error={error}
          responseJson={responseJson}
          apiCalled={apiCalled}
        />

        {/* KYC Modal */}
        <Modal
          isOpen={isKycModalOpen}
          onClose={handleCloseKycModal}
          title="Iniciar Processo KYC"
          size="xl"
        >
          <KycForm
            onSubmit={handleStartKyc}
            onCancel={handleCloseKycModal}
            isLoading={isLoading}
          />
        </Modal>
      </main>
    </div>
  );
}