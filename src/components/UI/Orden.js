import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from "../../firebase";

const Orden = ({ orden }) => {

    // Context Firebase
    const { firebase } = useContext(FirebaseContext);
    const [tiempoEntrega, setTiempoEntrega] = useState(0);

    // Definir tiempo de entrega real
    const definirTiempo = id => {
        try {
            firebase.db.collection('ordenes').doc(id).update({
                tiempoEntrega
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Completar el estado de una orden
    const completarOrden = id => {
        try {
            firebase.db.collection('ordenes').doc(id).update({
                completado: true
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="sm:w-1/2 lg:w1/3 px-2 mb-4">
            <div className="p-3 shadow-md bg-white">
                <h1 className="text-yellow-600 text-lg font-bold">{orden.id}</h1>
                {
                    orden.orden.map(platillo => (
                        <p key={platillo.nombre} className="text-gray-600">{platillo.cantidad} {platillo.nombre}</p>
                    ))
                }
                <p className="text-gray-700 font-bold">Total a pagar: ${orden.total}</p>

                {
                    orden.tiempoEntrega === 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tiempo de entrega</label>

                            <input type="number" min="1" max="20" placeholder="20"
                                value={tiempoEntrega} onChange={e => setTiempoEntrega(parseInt(e.target.value))}
                                className="shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />

                            <button
                                onClick={() => definirTiempo(orden.id)}
                                type="submit" className="bg-gray-800 hover:bg-gray-900 w-full text-white uppercase mt-5 p-2 font-bold">
                                Definir tiempo
                            </button>
                        </div>
                    )
                }

                {
                    orden.tiempoEntrega > 0 && (
                        <p className="text-gray-700 pt-5">Tiempo de entrega <span className="font-bold">{orden.tiempoEntrega} minutos</span> </p>
                    )
                }

                {
                    !orden.completado && orden.tiempoEntrega > 0 && (
                        <button
                            type="button"
                            className="bg-blue-800 hover:bg-blue-700 w-full mt-5 p-2 text-white uppercase font-bold"
                            onClick={() => completarOrden(orden.id)}
                        >
                            Marcar como lista
                        </button>
                    )
                }
            </div>
        </div>
    );
}

export default Orden;