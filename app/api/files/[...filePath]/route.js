import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";

  return "application/octet-stream";
}

export async function GET(_, context) {
  try {
    const { filePath } = await context.params;
    const relativePath = Array.isArray(filePath) ? filePath.join("/") : filePath;

    const fullPath = path.join(process.cwd(), relativePath);
    const fileBuffer = await fs.readFile(fullPath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": getContentType(fullPath),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Arquivo não encontrado.",
        details: error?.message || "Erro desconhecido",
      },
      { status: 404 }
    );
  }
}