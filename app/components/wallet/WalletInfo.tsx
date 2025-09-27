import type { PrivateKeyAccount } from 'viem/accounts';
import type { SmartWallet } from '../../services';

interface WalletInfoProps {
  eoa: PrivateKeyAccount | null;
  smartWallet: SmartWallet | null;
  kycSessionId: string | null;
}

export default function WalletInfo({ eoa, smartWallet, kycSessionId }: WalletInfoProps) {
  return (
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
  );
}
