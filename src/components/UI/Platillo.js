import React, { useContext, useRef } from 'react';
import { FirebaseContext } from "../../firebase";

const Platillo = ({ platillo }) => {

    // Existencia ref para acceder al valor del select directamente
    const existenciaRef = useRef(platillo.existencia);

    // Context de Firebase para cambios en la BD
    const { firebase } = useContext(FirebaseContext);

    const actualizarDisponibilidad = () => {
        // console.log(existenciaRef.current.value);
        const existencia = (existenciaRef.current.value === 'true'); // Retorna true o false

        try {
            firebase.db.collection('productos').doc(platillo.id).update({
                existencia
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-md bg-white">
                <div className="lg:flex">

                    <div className="lg:w-5/12 xl:w-3/12">
                        <img src={platillo.imagen} alt="Imagen Platillo" />

                        <div className="sm:flex sm:-mx-2 pl-2">
                            <label className="block mt-5 sm:w-2/4">
                                <span className="block text-gray-800 mb-2">Existencia</span>
                                <select
                                    value={platillo.existencia}
                                    className="bg-white shadow appearance-none border rounded w-full py-2 leading-tight focus:outline-none focus:shadow-outline"
                                    ref={existenciaRef}
                                    onChange={actualizarDisponibilidad}
                                >
                                    <option value="true">Disponible</option>
                                    <option value="false">No Disponible</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="lg:w-7/12 delay-200xl:w-9/12 pl-5">
                        <p className="font-bold text-2xl text-yellow-600 mb-4">{platillo.nombre}</p>
                        <p className="text-gray-600 mb-4">Categoría: {' '}
                            <span className="text-gray-700 font-bold">{platillo.categoria}</span>
                        </p>
                        <p className="text-gray-600 mb-4">{platillo.descripcion}</p>
                        <p className="text-gray-600 mb-4">Precio: {' '}
                            <span className="text-gray-700 font-bold">$ {platillo.precio}</span>
                        </p>
                    </div>

                </div>
            </div>

            {/* <h1>{platillo.nombre}</h1> */}
        </div>
    )
};

export default Platillo;