"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ForecastPage() {
  const [prediction, setPrediction] = useState<number | null>(null);

  const formik = useFormik({
    initialValues: {
      store: "",
      item: "",
      date: "",
    },
    validationSchema: Yup.object({
      store: Yup.number().required("Required"),
      item: Yup.number().required("Required"),
      date: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:5000/predict-demand", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        setPrediction(data.predicted_demand);
      } catch (error) {
        console.error("Prediction error:", error);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Demand Forecasting
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Store ID</label>
            <input
              type="number"
              name="store"
              value={formik.values.store}
              onChange={formik.handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {formik.touched.store && formik.errors.store && (
              <div className="text-sm text-red-600">{formik.errors.store}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Item ID</label>
            <input
              type="number"
              name="item"
              value={formik.values.item}
              onChange={formik.handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {formik.touched.item && formik.errors.item && (
              <div className="text-sm text-red-600">{formik.errors.item}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {formik.touched.date && formik.errors.date && (
              <div className="text-sm text-red-600">{formik.errors.date}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
          >
            Predict Demand
          </button>
        </form>

        {prediction !== null && (
          <div className="mt-6 text-center text-lg text-green-700">
            Predicted Demand: <span className="font-bold">{prediction}</span>
          </div>
        )}
      </div>
    </div>
  );
}
