import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Pega o endereço da EOA que veio do frontend pela URL
  const { searchParams } = new URL(request.url);
  const externallyOwnedAccount = searchParams.get('externallyOwnedAccount');

  if (!externallyOwnedAccount) {
    return NextResponse.json(
      { error: 'O parâmetro externallyOwnedAccount é obrigatório' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NOTUS_API_KEY;
  const baseUrl = process.env.NOTUS_API_BASE_URL;

  // Conforme a documentação, esses são os mesmos Factory e Salt usados na criação
  const FACTORY_ADDRESS = "0x0000000000400CdFef5E2714E63d8040b700BC24";
  const SALT = "0";

  try {
    // Constrói a URL para o endpoint de busca da Notus API
    // Documentação: GET /api/v1/wallets/address
    const url = `${baseUrl}/wallets/address?externallyOwnedAccount=${externallyOwnedAccount}&factory=${FACTORY_ADDRESS}&salt=${SALT}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey!,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // O endpoint retorna um status 200 com 'wallet: null' se não encontrar,
      // então um erro aqui significa outro problema.
      return NextResponse.json(data, { status: response.status });
    }

    // Se a carteira não existir, o endpoint retorna { "wallet": null }
    if (data.wallet === null) {
      return NextResponse.json(
        { error: 'Nenhuma Smart Wallet encontrada para esta EOA.' },
        { status: 404 }
      );
    }

    // Retorna os dados da carteira encontrada para o frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao chamar a Notus API:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}