
import MainButton from "@/app/components/buttons/mainButton"

export default function Perfil() {
    let edad = 20
    let nombre = "Juan"

    edad = edad+50

    return (
        <>
            <div>Nombre: {nombre}</div>
            <div>Edad: {edad}</div>
            {/* <MainButton onClick={() => alert("Hola")}>
                Click me
            </MainButton> */}
            <MainButton >No hago nada</MainButton>
        </>
    )
}
