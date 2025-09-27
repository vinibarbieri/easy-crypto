import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Pega o endereço da URL (ex: /api/get-portfolio?walletAddress=0x123)
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'O parâmetro walletAddress é obrigatório' },
      { status: 400 }
    );
  }

  // 2. Pega as variáveis de ambiente de forma segura
  const apiKey = process.env.NOTUS_API_KEY;
  const baseUrl = process.env.NOTUS_API_BASE_URL;

  try {
    // 3. Monta e faz a chamada GET para a Notus API
    // Conforme a documentação: GET /api/v1/wallets/{walletAddress}/portfolio
    const response = await fetch(`${baseUrl}/wallets/${walletAddress}/portfolio`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey!,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 4. Retorna a resposta da Notus API para o seu front-end
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao chamar a Notus API:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}