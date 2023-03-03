import depa from "../../Data/Departamentos.json";
import prov from "../../Data/Provincias.json";
import dist from "../../Data/Distritos.json";

export async function getDepartamentos() {
  return await depa;
}

export async function getProvincias(id_ubigeo) {
  return await prov[id_ubigeo];
}
export async function getDistritos(id_ubigeo) {
  return await dist[id_ubigeo];
}
