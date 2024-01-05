import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/utils/dbConnect";

import axios from "axios";
export async function GET() {
  dbConnect();
  return NextResponse.json({ msg: "asda" });
}

export async function POST(req, res) {
  const { name, alto, ancho, largo, peso, valor } = await req.json();

  console.log(name, alto, ancho, largo, peso, valor);

  return NextResponse.json("aaa");

  // await axios.post({});
}
