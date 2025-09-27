import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.NOTUS_API_KEY;
  const baseUrl = process.env.NOTUS_API_BASE_URL;

  try {
    // Receber os dados do usuário KYC do frontend
    const kycUserData = await request.json();
    
    console.log('Dados do usuário KYC recebidos:', kycUserData);

    // Validar campos obrigatórios
    const requiredFields = [
      'firstName', 'lastName', 'birthDate', 'email',
      'documentId', 'documentCategory', 'documentCountry',
      'address', 'city', 'state', 'postalCode'
    ];

    const missingFields = requiredFields.filter(field => !kycUserData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios ausentes', 
          missingFields: missingFields 
        }, 
        { status: 400 }
      );
    }

    // Conforme a documentação: POST /kyc/individual-verification-sessions/standard
    const response = await fetch(`${baseUrl}/kyc/individual-verification-sessions/standard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
      },
      body: JSON.stringify(kycUserData),
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
      // Repassa o erro da Notus API para o nosso frontend
      console.log("Erro da Notus API:", data);
      return NextResponse.json(data, { status: response.status });
    }

    // Retorna a resposta de sucesso para o nosso frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao chamar a Notus API:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}