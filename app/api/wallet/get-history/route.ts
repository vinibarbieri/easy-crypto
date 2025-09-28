import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'O parâmetro walletAddress é obrigatório' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NOTUS_API_KEY;
  const baseUrl = process.env.NOTUS_API_BASE_URL;

  try {
    // Conforme a documentação: GET /api/v1/wallets/{walletAddress}/history
    const response = await fetch(`${baseUrl}/wallets/${walletAddress}/history`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey!,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao chamar a Notus API:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}