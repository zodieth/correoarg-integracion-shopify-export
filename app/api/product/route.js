import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import fs from "fs";
import products from "../../json/products.json";

import axios from "axios";
export async function GET() {
  dbConnect();
  return NextResponse.json({ msg: "asda" });
}

export async function POST(req, res) {
  const { name, alto, ancho, largo, peso, valor } = await req.json();

  const path = process.cwd() + "/app/json/products.json";
  // console.log(name, alto, ancho, largo, peso, valor);
  // const filePath = path.join(__dirname, "..", "..", "json", "products.json");

  // Leer el archivo JSON existente
  // const existingData = fs.readFileSync(products, "utf-8");

  // console.log(products);
  // const parsedData = JSON.parse(products.products);
  const parsedData = products.products;
  // Crear el nuevo producto
  const newProduct = {
    name,
    alto,
    ancho,
    largo,
    peso,
    valor,
  };

  // Agregar el nuevo producto a la matriz de productos existentes
  parsedData.push(newProduct);

  // Escribir los datos actualizados de vuelta al archivo JSON
  fs.writeFileSync(
    // __dirname,
    // process.cwd(),
    path,
    // "../../json/products.json",
    JSON.stringify(parsedData, null, 2)
  );

  return NextResponse.json({ message: "Producto agregado exitosamente" });
}

// console.log(name, alto, ancho, largo, peso, valor);

// return NextResponse.json("aaa");

// await axios.post({});
