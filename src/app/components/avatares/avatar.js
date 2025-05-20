import Image from "next/image";
export default function Avatar({ src, alt }) {
    return (
        <>
            <Image
                className=" w-8 h-8 rounded-full object-cover cursor-pointer"
                src="/images/profile1.png" 
                alt="Foto de perfil"
                width={10}
                height={10}
            />
        </>
    );
  }