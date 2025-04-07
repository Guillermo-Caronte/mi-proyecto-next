import LoginButton from "../components/buttons/loginButton";
import BlueText from "../components/titles/blueText";

export default function Page() {
  return (
    <div>
      <BlueText>Texto azul</BlueText>
      <p>Esto NO es un texto azul pero lo de arriba si</p>
      <LoginButton />
    </div>
  );
}