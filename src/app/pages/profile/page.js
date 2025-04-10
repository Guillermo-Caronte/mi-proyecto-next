"use client"
import MainButton from "@/app/components/buttons/mainButton"

export default function Perfil() {
    let edad = 20

    const sumarEdad = () => {
        const nuevaEdad = edad + 1
        setEdad(nuevaEdad)
        alert(`La edad es: ${nuevaEdad}`)
    }

    return (
        <>
            <div>Nombre: {nombre}</div>
            <div>Edad: {edad}</div>
            <MainButton onClick={sumarEdad}>Sumar edad</MainButton>
        </>
    )
}
