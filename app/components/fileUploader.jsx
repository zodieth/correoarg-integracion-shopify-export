"use client";
import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import products from "../json/products.json";

const FileUploader = () => {
  const [fileData, setFileData] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Leer el archivo CSV
    const parsedData = await readCSV(file);

    // Procesar datos, cambiar el formato, etc.
    const formattedData = processData(parsedData);

    // Generar el archivo XLSX
    generateXLSX(formattedData);
  };

  const readCSV = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
        });
        resolve(parsedData.data);
      };
      reader.readAsText(file);
    });
  };

  const cleanPhoneNumber = async (phoneNumber) => {
    const cleanedInitialChars = await phoneNumber.replace(/['\s]/g, "");
    const cleanedPrefix = await cleanedInitialChars.replace(/^(\+54|54)?/, "");
    let cleanedNumber = await cleanedPrefix
      .replace(/\s/g, "")
      .replace(/-/g, "");

    while (cleanedNumber.toString().length > 10) {
      // Convertimos el número a cadena para manipularlo como texto
      let numStr = cleanedNumber.toString();

      // Eliminamos el primer dígito
      cleanedNumber = parseInt(numStr.slice(1));
    }

    if (!isNaN(cleanedNumber)) {
      cleanedNumber = parseInt(cleanedNumber);
    }

    return cleanedNumber;
  };

  const cleanPostalCode = async (postalCode) => {
    // Eliminar letras y comillas simples del código postal
    let cleanedPostalCode = await postalCode.replace(/[a-zA-Z'']/g, "");

    if (!isNaN(cleanedPostalCode)) {
      cleanedPostalCode = parseInt(cleanedPostalCode);
    }

    return cleanedPostalCode;
  };

  const cleanedId = (id) => {
    const split = id.split("");
    split.shift();
    const textoSinHashtag = split.join("");

    return textoSinHashtag;
  };

  const removeAccentsAndSpecialChars = (str) => {
    return str
      .normalize("NFD") // Normalizar para separar caracteres diacríticos
      .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos
      .replace(/[áäâ]/gi, "a") // Reemplazar letras con acentos
      .replace(/[éëê]/gi, "e") // Reemplazar letras con acentos
      .replace(/[íïî]/gi, "i") // Reemplazar letras con acentos
      .replace(/[óöô]/gi, "o") // Reemplazar letras con acentos
      .replace(/[úüû]/gi, "u") // Reemplazar letras con acentos
      .replace(/ñ/gi, "n") // Reemplazar ñ por n
      .replace(/ü/gi, "u"); // Reemplazar ü por u
  };

  const weightHeight = async (item) => {
    for (let i = 0; i < products.products.length; i++) {
      if (item["Lineitem name"] === products.products[i].name) {
        return {
          peso: products.products[i].peso * item["Lineitem quantity"],
          largo: products.products[i].largo * item["Lineitem quantity"],
          ancho: products.products[i].ancho,
          alto: products.products[i].alto,
          valor: products.products[i].valor,
        };
      }
    }
    return;
  };

  const processData = async (data) => {
    const newData = await Promise.all(
      data.map(async (item) => {
        const cleanedPhoneNumber = await cleanPhoneNumber(
          item["Shipping Phone"]
        );
        const cleanedCodpostal = await cleanPostalCode(item["Shipping Zip"]);
        const shippingCity = removeAccentsAndSpecialChars(
          item["Shipping City"]
        );
        const shippingAddress = await removeAccentsAndSpecialChars(
          item["Shipping Address1"]
        );

        const shippingAddress2 = await removeAccentsAndSpecialChars(
          item["Shipping Address2"]
        );
        const shippingName = await removeAccentsAndSpecialChars(
          item["Shipping Name"]
        );

        const id = await cleanedId(item["Name"]);

        const match = shippingAddress.match(/^(.*?)(\d+)$/);

        let street = shippingAddress;
        let height = "";

        if (match) {
          street = match[1].trim();
          height = match[2].trim();
          if (!isNaN(height)) {
            height = parseInt(height);
          }
        } else {
        }

        const pesaje = await weightHeight(item);

        return {
          external_id: id,
          origin_id: 5120,
          destinatario: shippingName,
          telefono: cleanedPhoneNumber,
          email: item["Email"],
          calle: street,
          altura: height,
          observaciones: shippingAddress2,
          ciudad: shippingCity,
          provincia: item["Shipping Province"],
          cp: cleanedCodpostal,
          gramos: pesaje?.peso ? pesaje?.peso : "",
          largo: pesaje?.largo ? pesaje?.largo : "",
          alto: pesaje?.alto ? pesaje?.alto : "",
          ancho: pesaje?.ancho ? pesaje?.ancho : "",
          valor_contenido: pesaje?.valor ? pesaje?.valor : "",
          despacho: "pickup",
        };
      })
    );

    function formatearNumeros(datos) {
      return datos.map((item) => {
        if (item["peso(obligatorio en KG)"]) {
          item["peso(obligatorio en KG)"] = Number(
            item["peso(obligatorio en KG)"]
          ).toFixed(1); // Asegurar dos decimales
        }
        return item;
      });
    }

    const newDataFormateada = formatearNumeros(newData);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(newDataFormateada);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nueva Hoja");
    XLSX.writeFile(workbook, "cargamasiva_correoargentino.xlsx");

    return workbook;
  };

  const generateXLSX = (data) => {
    if (!Array.isArray(data)) {
      data = [data];
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  };

  return (
    <div className="mx-10 md:mx-2 flex items-center justify-center h-screen">
      <div className="max-w-2xl mx-auto">
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          htmlFor="file_input"
        >
          Subir archivo{" "}
        </label>
        <input
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
        />

        <p className="mt-5">
          Hermanito no te confundas porque este sistemilla está actualizado para
          la integración de correo argentino y el mapeo de celdas con shopify,
          arrastrá el shopify exports y disfrutá,{" "}
          <a className="text-blue-600 hover:underline" href="#" target="_blank">
            Mateo
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
