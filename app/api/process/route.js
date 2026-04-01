import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json(
        { error: "Nenhuma imagem foi enviada." },
        { status: 400 }
      );
    }

    const prompt = `
Edite esta fotografia profissionalmente para fotografia social, ensaios e eventos.
Regras obrigatórias:
- corrigir luz e exposição com naturalidade
- melhorar balanço de branco
- refinar contraste sem exagero
- preservar tons de pele realistas
- aumentar definição de forma suave
- reduzir ruído sem plastificar
- manter enquadramento original
- não deformar rosto, corpo, roupas ou cenário
- não remover elementos importantes
- entregar resultado premium, limpo e comercial
`;

    const result = await client.images.edit({
      model: "gpt-image-1",
      image,
      prompt,
      size: "auto",
      quality: "high",
      output_format: "png",
    });

    const b64 = result?.data?.[0]?.b64_json;

    if (!b64) {
      return NextResponse.json(
        { error: "A IA não retornou imagem editada." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${b64}`,
    });
  } catch (error) {
    console.error("Erro ao processar imagem com IA:", error);

    return NextResponse.json(
      {
        error: "Falha ao processar imagem com IA.",
        details: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}