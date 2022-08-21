import axios from 'axios';
require("dotenv").config();
export default class ImagenesService {

    getImagenesFromUser(lazyParams, buscador ,username, tipoDeModelo){
        
        return axios.get('/images/'+username, {
            params:{
                pagina: lazyParams.pagina,
                ordenar: lazyParams.sort,
                buscador: buscador,
                tipoDeModelo : tipoDeModelo
            }
        })
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    removeImg(id){
        return axios.delete(`/images/${id}`)
        .catch((e)=>{
            console.log('error' + e);
        });
    }

    getImagen(id) {
		return axios.get(`/images/${id}`)
        .then((response) => response.data)
        .catch((e)=>{
            console.log('error' + e);
        });
    }



}