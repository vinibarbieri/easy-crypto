import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Pega os dados que o seu front-end enviou (ex: o endereço da EOA)
  const { externallyOwnedAccount } = await request.json();

  if (!externallyOwnedAccount) {
    return NextResponse.json(
      { error: 'externallyOwnedAccount é obrigatório' },
      { status: 400 }
    );
  }

  // 2. Pega as variáveis de ambiente de forma segura no servidor
  const apiKey = process.env.NOTUS_API_KEY;
  const baseUrl = process.env.NOTUS_API_BASE_URL;

  // A documentação especifica este Factory Address para o Light Account
  const FACTORY_ADDRESS = "0x0000000000400CdFef5E2714E63d8040b700BC24";

  try {
    // 3. Monta e faz a chamada para a Notus API
    const response = await fetch(`${baseUrl}/wallets/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!, // O "!" diz ao TypeScript que temos certeza que a variável existe
      },
      body: JSON.stringify({
        externallyOwnedAccount,
        factory: FACTORY_ADDRESS,
        salt: '0', // Conforme os exemplos da documentação
      }),
    });

    const data = await response.json();

    // Se a resposta da Notus API não for OK, repassa o erro
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