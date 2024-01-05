import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";

import axios from "axios";
export async function GET() {
  dbConnect();
  return NextResponse.json({ msg: "asda" });
}

export async function POST(req, res) {
  const { name, alto, ancho, largo, peso, valor } = req.body;

  await axios.post({});
}
