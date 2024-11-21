import ApiSankhya, { consultaPendencias } from './ApiSankhya.mjs';



async function consultarPendencias(codparctransp) {
    let response = await ApiSankhya.consultaPendencias(codparctransp);
    return response;
}







