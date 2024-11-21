
const username = 'daniele.vilaca@granvitapet.com.br';
const password = '#SankhyaEAD2020';
const token = '959f43cb-b839-426a-ba83-d7773542f91d';
const appkey = '4abc1dc9-e87d-486e-b2d6-3a03491480dc';

 async function gerarTokem () {
   
    const url = "https://api.sankhya.com.br/login";

    const headers = {
        'Content-Type': 'application/json',
        'token':  token,
        'appkey': appkey,
        'username': username,
        'password': password
    };

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: headers
        });

        const responseBody = await response.text();

        const result = JSON.parse(responseBody);

        if (result.bearerToken) {
            return result.bearerToken; 
        } else {
            throw new Error("Bearer token não encontrado na resposta da API");
        }

        
    } catch (error) {
        console.error("Erro na requisição de login:", error.message);
    }
    
      
}
  

 async function consultaPendencias(codparctransp) {


    let tokemApi = await gerarTokem();

    let body = {
        "serviceName": "CRUDServiceProvider.loadRecords",
        "requestBody": {
            "dataSet": {
                "rootEntity": "AD_OCOTRANS",
                "includePresentationFields": "S",
                "offsetPage": " ",
                "criteria": {
                    "expression": {
                        "$": "(this.CODPARCTRANSP ="+codparctransp+")"  
                    }
                },
                "entity": {
                    "fieldset": {
                        "list" : "NUMNOTA,CODPARC"
                    }
                    }
        }
      }
    };

    const url = "https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.loadRecords&outputType=json&token=" +token+"&Appkey"+appkey;
    
      
    const headers = {
        'Authorization': `Bearer ${tokemApi}`, 
        'Content-Type': 'application/json',
        'appkey': appkey,
     };
      
    
    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body), 
        });

        const dados = await response.json();
        const entidades = dados.responseBody?.entities?.entity;

            if (entidades && Array.isArray(entidades)) {

                    const resultado = entidades.map((entity) => ({
                        NUMNOTA: entity.f0?.$ || null, 
                        CODPARC: entity.f1?.$ || null, 
                    }));
                   const arrayNumeros = resultado.map((item) => [item.NUMNOTA, item.CODPARC]);
                   return arrayNumeros;
            } else {
            return [];
            }

    } catch (error) {
        console.error('Erro na requisição:', error);
    }


}

