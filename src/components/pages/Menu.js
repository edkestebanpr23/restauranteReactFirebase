import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from "../../firebase/index";
import PLatillo from "../UI/Platillo";

const Menu = () => {
    const [platillos, setPlatillos] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    // Consultar la BD al cargar
    useEffect(() => {
        const obtenerPlatillos = () => {
            /**
             * El .get() trae los resultados pero no cumple la función de estar actualizando en tiempo real
             * 
             * const resultado = await firebase.db.collection('productos').get();
             * 
             * El resultado entonces se enviará a la función ingresada en el onSnapshot()
             */

            firebase.db.collection('productos').onSnapshot(handleSnapshot);
        };
        obtenerPlatillos();
    }, []);

    // Snapshot nos permite utilizar la base de datos en tiempo real de firestore, recibe las actualizaciones
    const handleSnapshot = (snapshot) => {
        const platillos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });

        setPlatillos(platillos);
    };

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Menú</h1>
            <Link to="/nuevo-platillo"
                className="bg-blue-800 hover:bg-blue-700 inline-block mb-5 p-2 text-white uppercase font-bold rounded-lg"
            >
                Agregrar Plato
            </Link>

            {platillos.map(platillo => (
                <PLatillo
                    key={platillo.id}
                    platillo={platillo}
                />
            ))}
        </>
    );
}

export default Menu;