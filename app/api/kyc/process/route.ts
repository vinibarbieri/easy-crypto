import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId é obrigatório' }, { status: 400 });
  }

  const apiKey = process.env.NOTUS_API_KEY;
  const baseUrl = process.env.NOTUS_API_BASE_URL;

  try {
    // Conforme a documentação: POST /kyc/individual-verification-sessions/standard/{sessionId}/process
    const response = await fetch(`${baseUrl}/kyc/individual-verification-sessions/standard/${sessionId}/process`, {
      method: 'POST',
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
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao chamar a Notus API:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}