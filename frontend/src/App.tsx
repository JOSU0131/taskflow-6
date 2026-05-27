import { useEffect, useState } from 'react';

// 🔑 DEFINICIÓN DE INTERFACES (TypeScript estricto para cumplir la Fase 6)
interface Product {
  id: string;
  producto: string; // Mapeado desde el alias del backend
  precio: string | number;
  stock: number;
  categoria: string; // Mapeado desde el INNER JOIN del backend
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🌍 Ponemos la URL de tu API real desplegada en Vercel
  const API_URL = 'https://taskflow-6.vercel.app/api/products';

  useEffect(() => {
    async function fetchInventory() {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Error en el servidor: ${response.status}`);
        }
        
        const dataParsed: Product[] = await response.json();
        setProducts(dataParsed);
      } catch (err: any) {
        console.error("❌ Error al conectar con el Backend:", err.message);
        setError(err.message || 'Error desconocido al cargar el catálogo.');
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 antialiased">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado Estilo Forge */}
        <header className="mb-8 border-b border-slate-700 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-amber-500">
              🌌 HammerFlow Forge
            </h1>
            <p className="text-slate-400 mt-1">Control de Inventario Relacional Cloud (Fase 6)</p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20 animate-pulse">
            ● Base de Datos Conectada
          </span>
        </header>

        {/* Estado: Cargando */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <span className="ml-3 text-slate-400">Consultando Neon DB Serverless...</span>
          </div>
        )}

        {/* Estado: Error de Conexión */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            <h3 className="font-bold">⚠️ Error de Red / Persistencia</h3>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs text-slate-500 mt-2">Verifica que el Servidor en Vercel esté activo y los CORS habilitados.</p>
          </div>
        )}

        {/* Tabla de Datos Mapeados */}
        {!loading && !error && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-300 border-b border-slate-700 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4 text-right">Precio</th>
                  <th className="p-4 text-right">Stock</th>
                  <th className="p-4 text-center">Estado Logístico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No hay productos registrados en el inventario.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-medium text-amber-100">{item.producto}</td>
                      <td className="p-4">
                        <span className="bg-slate-900 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-400 font-semibold">
                        {typeof item.precio === 'number' ? item.precio.toFixed(2) : parseFloat(item.precio).toFixed(2)}€
                      </td>
                      <td className="p-4 text-right font-mono text-slate-300">{item.stock} u.</td>
                      <td className="p-4 text-center">
                        {item.stock > 10 ? (
                          <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">Óptimo</span>
                        ) : item.stock > 0 ? (
                          <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full font-medium">Stock Bajo</span>
                        ) : (
                          <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-medium">Agotado</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}