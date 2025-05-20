
import Image from "next/image";
export default function Header() {

    return (
      < >
      <div className=" cosaGrande bg-[#e41b23]">
        <Image
          src="/images/foto.jpg"
          alt="foto1"
          width={75}
          height={50}
        /> 
        <div className="ml-315 flex">
        <Image
          src="/images/logoSalesianosZaragoza.jpeg"
          alt="foto"
          width={140}
          height={50}
        /> 
        </div>
      </div>
      </> 
    );
  }
