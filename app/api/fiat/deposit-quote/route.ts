import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { walletAddress } = await request.json();

  if (!walletAddress) {
    return NextResponse.json({ error: 'walletAddress é obrigatório' }, { status: 400 });
  }

  const apiKey = process.env.NOTUS_API_KEY;
  const baseUrl = process.env.NOTUS_API_BASE_URL;

  // Conforme a documentação, precisamos de um individualId.
  // Vamos enviar um valor inválido de propósito para testar a resposta de erro.
  const testData = {
    paymentMethodToSend: "PIX",
    receiveCryptoCurrency: "USDC",
    amountToSendInFiatCurrency: 100, // Valor em Reais (BRL)
    individualId: "ind_teste_id_invalido", // ID inválido, pois não temos um real
    walletAddress: walletAddress,
    chainId: 137 // Polygon
  };

  try {
    // Conforme a documentação: POST /fiat/deposit/quote
    const response = await fetch(`${baseUrl}/fiat/deposit/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro esperado da Notus API (Fiat):", data);
      return NextResponse.json(data, { status: response.status });
    }

    // Se por acaso funcionar, será uma surpresa!
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao chamar a Notus API:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}