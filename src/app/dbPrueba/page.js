import { getData } from '../server/select'; 

export default async function DbPrueba() {
  const data = await getData();
  return <>
  <div>
    <h1>DbPrueba</h1>
    <pre>{JSON.stringify(data, null, 5)}</pre>
  </div>
  </>;
}

