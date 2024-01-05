"use client";
import { useState } from "react";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    alto: 0,
    ancho: 0,
    largo: 0,
    peso: 0,
    valor: 0,
  });

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" ? value : parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Aquí puedes manejar la lógica después de enviar los datos
        console.log("Producto enviado con éxito");
      } else {
        console.error("Error al enviar el producto");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label className="block mb-1">Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-md px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Alto:</label>
        <input
          type="number"
          name="alto"
          value={formData.alto}
          onChange={handleChange}
          className="w-full border rounded-md px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Ancho:</label>
        <input
          type="number"
          name="ancho"
          value={formData.ancho}
          onChange={handleChange}
          className="w-full border rounded-md px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Largo:</label>
        <input
          type="number"
          name="largo"
          value={formData.largo}
          onChange={handleChange}
          className="w-full border rounded-md px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Peso:</label>
        <input
          type="number"
          name="peso"
          value={formData.peso}
          onChange={handleChange}
          className="w-full border rounded-md px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Valor:</label>
        <input
          type="number"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          className="w-full border rounded-md px-2 py-1"
        />
      </div>
      <div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Crear
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
