import React, { useContext, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { FirebaseContext } from "../../firebase";
import { useNavigate } from "react-router-dom";
import FileUploader from 'react-firebase-file-uploader';

const NuevoPlatillo = () => {

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [urlImage, setUrlImage] = useState('');

    // Context con las operaciones de Firebase
    /**
     * Este es la destructuración a el value que se le paso en el App.js en el <FirebaseContext.Provider>
     */
    const { firebase } = useContext(FirebaseContext);
    // console.log(firebase);

    // Hook para redireccionar
    const navigate = useNavigate();

    // Validación y leer los datos del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen: '',
            descripcion: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().min(3, 'Min 3 caracteres en nombre').required('El platillo es obligatorio'),
            precio: Yup.number().min(1, 'Debes agregar algún número').required('El precio es obligatorio'),
            categoria: Yup.string().required('La categoría es obligatoria'),
            descripcion: Yup.string().min(5, 'Descripción debe ser más larga').required('La descripción es obligatoria'),
        }),
        onSubmit: platillo => {
            try {
                platillo.existencia = true;
                platillo.imagen = urlImage;
                firebase.db.collection('productos').add(platillo);

                // En caso de que almacene todo bien! Entocnes redireccionar
                navigate('/menu');
            } catch (error) {
                console.log(error);
            }
        }
    });

    // Functions Images
    function handleUploadStart() {
        setProgress(0);
        setUploading(true);
    }

    // Si ocurre error esta función lo recibirá implícitamente
    function handleUploadError(error) {
        setUploading(false);
        console.log(error);
    }

    // Se ejecuta al terminar de subir la imágen, recibe el nombre de la imagen
    async function handleUploadSuccess(nameImage) {
        setProgress(100);
        setUploading(false);

        // Almacenar la URL donde se almacenó la imágen
        const url = await firebase.storage.ref('productos').child(nameImage).getDownloadURL();
        console.log(url);
        setUrlImage(url);
    }

    // Conforme vaya subiendo la imagen se va ejecutando, devuelve porcentage de subida
    function handleProgress(progress) {
        setProgress(progress);
    }

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Nuevo Platillo</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit} >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre" type="text" placeholder="Nombre del plato" value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="bg-red-100 border-l-4 border-red-500 p-4 border-r-4 text-red-700 mb-5" role='alert'>
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio" type="number" placeholder="$" min="0" value={formik.values.precio} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="bg-red-100 border-l-4 border-red-500 p-4 border-r-4 text-red-700 mb-5" role='alert'>
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">Categoría</label>
                            <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="categoria" name="categoria" value={formik.values.categoria} onChange={formik.handleChange} onBlur={formik.handleBlur} >
                                <option value="">-- Selecciona categoría --</option>
                                <option value="Desayuno">Desayuno</option>
                                <option value="Comida">Comida</option>
                                <option value="Cena">Cena</option>
                                <option value="Bebida">Bebida</option>
                                <option value="Postre">Postre</option>
                                <option value="Ensalada">Ensalada</option>
                            </select>
                        </div>
                        {formik.touched.categoria && formik.errors.categoria ? (
                            <div className="bg-red-100 border-l-4 border-red-500 p-4 border-r-4 text-red-700 mb-5" role='alert'>
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.categoria}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen">Imagen</label>
                            <FileUploader
                                accept="image/*"
                                id='imagen'
                                name='imagen'
                                randomizeFilename
                                storageRef={firebase.storage.ref('productos')} // Crea una carpeta y ahí almacena las fotos
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </div>
                        {uploading && (
                            <div className="h-12 relative w-full border">
                                <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                                    style={{ width: `${progress}%` }}
                                >
                                    {progress} %
                                </div>
                            </div>
                        )}

                        {urlImage && (
                            <p className="bg-green-500 text-white p-3 text-center my-5">
                                La imagen se subió correctamente
                            </p>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">Descripción</label>
                            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="descripcion" placeholder="Descripción del platillo" value={formik.values.descripcion} onChange={formik.handleChange} onBlur={formik.handleBlur}> </textarea>
                        </div>
                        {formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className="bg-red-100 border-l-4 border-red-500 p-4 border-r-4 text-red-700 mb-5" role='alert'>
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.descripcion}</p>
                            </div>
                        ) : null}

                        <input className="bg-gray-800 shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                            type="submit"
                            value="Agregar Platillo"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

export default NuevoPlatillo;