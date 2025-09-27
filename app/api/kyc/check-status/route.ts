import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'O parâmetro sessionId é obrigatório' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NOTUS_API_KEY;
  const baseUrl = process.env.NOTUS_API_BASE_URL;

  try {
    // Conforme a documentação: GET /kyc/individual-verification-sessions/standard/{sessionId}
    const response = await fetch(`${baseUrl}/kyc/individual-verification-sessions/standard/${sessionId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey!,
      },
    });

    // Verificar se a resposta tem conteúdo antes de tentar fazer parse
    const responseText = await response.text();
    console.log('Resposta da Notus API:', responseText);
    
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.error('Conteúdo da resposta:', responseText);
      return NextResponse.json(
        { 
          error: 'Resposta inválida da API externa', 
          details: 'A resposta não contém JSON válido',
          responseText: responseText.substring(0, 200) // Primeiros 200 caracteres para debug
        }, 
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.log("Erro da Notus API:", data);
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
