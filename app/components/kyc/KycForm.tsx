"use client";

import { useState } from 'react';
import { KycUserData } from '../../services/kyc';
import Button from '../ui/button';

interface KycFormProps {
  onSubmit: (data: KycUserData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function KycForm({ onSubmit, onCancel, isLoading = false }: KycFormProps) {
  const [formData, setFormData] = useState<KycUserData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    documentId: "",
    documentCategory: "DRIVERS_LICENSE",
    documentCountry: "BRAZIL",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    livenessRequired: false
  });

  const handleInputChange = (field: keyof KycUserData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const documentCategories = [
    { value: "DRIVERS_LICENSE", label: "Carteira de Habilitação" },
    { value: "PASSPORT", label: "Passaporte" },
    { value: "NATIONAL_ID", label: "RG" },
    { value: "OTHER", label: "Outro" }
  ];

  const countries = [
    { value: "BRAZIL", label: "Brasil" },
    { value: "USA", label: "Estados Unidos" },
    { value: "ARGENTINA", label: "Argentina" },
    { value: "OTHER", label: "Outro" }
  ];

  const states = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Pessoais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
          Informações Pessoais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Digite seu nome"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sobrenome *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Digite seu sobrenome"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data de Nascimento *
            </label>
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>
        </div>
      </div>

      {/* Documento */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
          Documento de Identificação
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Documento *
            </label>
            <select
              required
              value={formData.documentCategory}
              onChange={(e) => handleInputChange('documentCategory', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {documentCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              País *
            </label>
            <select
              required
              value={formData.documentCountry}
              onChange={(e) => handleInputChange('documentCountry', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {countries.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número do Documento *
            </label>
            <input
              type="text"
              required
              value={formData.documentId}
              onChange={(e) => handleInputChange('documentId', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Número do documento"
            />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
          Endereço
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rua e Número *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Rua das Flores, 123"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cidade *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="São Paulo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estado *
            </label>
            <select
              required
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Selecione o estado</option>
              {states.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CEP *
            </label>
            <input
              type="text"
              required
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="01234567"
              maxLength={8}
            />
          </div>
        </div>
      </div>

      {/* Configurações Adicionais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
          Configurações
        </h3>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="livenessRequired"
            checked={formData.livenessRequired}
            onChange={(e) => handleInputChange('livenessRequired', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
          />
          <label htmlFor="livenessRequired" className="text-sm font-medium text-gray-300">
            Requer verificação de vida (Liveness)
          </label>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-600">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <Button
          onClick={() => onSubmit(formData)}
          color="purple"
          disabled={isLoading}
          icon="🚀"
        >
          {isLoading ? 'Iniciando...' : 'Iniciar KYC'}
        </Button>
      </div>
    </form>
  );
}
