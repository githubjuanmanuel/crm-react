import { obtenerCliente, actualizarClientes } from "../data/clientes";
import Formulario from "../Components/Formulario";
import { Form, useNavigate, useLoaderData, useActionData, redirect } from "react-router-dom";
import Error from "../Components/Error";


export async function loader({ params }) {
  const cliente = await obtenerCliente(params.clienteId);
  if (Object.values(cliente).length === 0) {
    throw new Response("", {
      status: 404,
      statusText: "El cliente no fuen encontrado",
    });
  }

  return cliente;
}

export async function action({request, params}) {
  const formData = await request.formData();

  const datos = Object.fromEntries(formData);

  const errores = [];

  const email = formData.get("email");

  if (Object.values(datos).includes("")) {
    errores.push("Todos los campos son obligatorios");
  }

  let regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );

  if (!regex.test(email)) {
    errores.push('El email no es valido')  
  }

  if (Object.keys(errores).length) {
    return errores;
  }

  //Actualizar cliente
  await actualizarClientes(params.clienteId,datos);

  return redirect('/')
  
}

const EditarCliente = () => {

  const navigate = useNavigate()

  const cliente = useLoaderData()
  const errores = useActionData()

  return (
    <>
      <h1 className="font-black text-4xl text-blue-900">Editar Clientes</h1>
      <p className="mt-3">
        A continuación podrás modificar los datos de un cliente
      </p>

      <div className="flex justify-end">
        <button
          className="bg-blue-800 text-white px-3 py-1 font-bold uppercase hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Volver
        </button>
      </div>
      <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-20">
        {errores?.length &&
          errores.map((error, i) => <Error key={i}>{error}</Error>)}
        <Form method="post">
          <Formulario cliente={cliente}/>
          <input
            type="submit"
            className="mt-5 w-full bg-blue-800 uppercase font-bold text-white text-lg hover:bg-blue-600 cursor-pointer"
            value="Guardar Cambios"
          />
        </Form>
      </div>
    </>
  );
};

export default EditarCliente;
