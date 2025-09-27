import type { PrivateKeyAccount } from 'viem/accounts';
import type { SmartWallet } from '../../services';

interface WalletInfoProps {
  eoa: PrivateKeyAccount | null;
  smartWallet: SmartWallet | null;
  kycSessionId: string | null;
}

export default function WalletInfo({ eoa, smartWallet, kycSessionId }: WalletInfoProps) {
  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl border border-gray-600 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">💼</span>
        </div>
        <h2 className="text-lg font-bold">Wallet Information</h2>
      </div>
      {eoa ? (
        <div className="space-y-3">
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-400 font-semibold text-sm">EOA</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <p className="font-mono text-sm break-all text-gray-200 bg-gray-800 p-2 rounded">
              {eoa.address}
            </p>
          </div>
          
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-400 font-semibold text-sm">Smart Wallet</span>
              {smartWallet ? (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              )}
            </div>
            <p className="font-mono text-sm break-all text-gray-200 bg-gray-800 p-2 rounded">
              {smartWallet?.accountAbstraction ? 
                `${smartWallet.accountAbstraction}` : 
                'N/A'
              }
            </p>
          </div>
          
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400 font-semibold text-sm">KYC Session</span>
              {kycSessionId ? (
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              )}
            </div>
            <p className="font-mono text-sm break-all text-gray-200 bg-gray-800 p-2 rounded">
              {kycSessionId ? 
                `${kycSessionId}` : 
                'N/A'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg border border-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          <p className="text-gray-300 text-sm">Gerando carteira de testes...</p>
        </div>
      )}
    </section>
  );
}
