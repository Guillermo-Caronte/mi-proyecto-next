import MainButton from "@/app/components/buttons/mainButton";

export default function Perfil() {

    let nombre = "Juan";
    let edad = 25;
    edad += 50;

    return (
        <>
            <div>Nombre: {nombre}</div>
            <div>Edad: {edad}</div>
            <MainButton>Hola</MainButton>
            <MainButton>Adios</MainButton>
        </>
    );
}