import React, { useEffect, useState, useContext } from 'react';
import { FirebaseContext } from "../../firebase";
import Orden from "../UI/Orden";

const Ordenes = () => {

    // Context de las operaciones de Firebase
    const { firebase } = useContext(FirebaseContext);

    // State de las Órdenes
    const [ordenes, setOrdenes] = useState([]);

    useEffect(() => {
        const obtenerOrdenes = () => {
            firebase.db.collection('ordenes').where('completado', '==', false).onSnapshot(manejarSnapshot);
        }

        obtenerOrdenes();
    }, []);

    function manejarSnapshot(snapshot) {
        const ordenes = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data() // Como se accede a la información
            }
        });
        setOrdenes(ordenes);
    }

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Órdenes</h1>

            <div className="sm:flex sm:flex-wrap -mx-3">
                {
                    ordenes.map(orden => (
                        <Orden key={orden.id} orden={orden} />
                    ))
                }
            </div>

        </>
    );
}

export default Ordenes;