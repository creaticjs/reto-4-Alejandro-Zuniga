const filtrarId = ({id}, idFiltro) => id !== idFiltro;
const encontrarId = ({id}, idBuscar) => id === idBuscar;
var app = new Vue({
    el: "#tvMaze",
    data: {
        baseUrl: 'http://api.tvmaze.com/',
        showBusqueda: '',
        shows: [],
        estadosApp: {
            mirarTodos: false,
            mirarUno: false,
            mirarInicio: false,
            mirarFavoritos: false
        },
        noExiste: 'No se encontró información',
        show: {},
        favoritos: [],
        showsIniciales: []
    },
    methods: {
        buscarShow: function (event) {
            event.preventDefault();
            this.consultaAPI();
        },
        consultaAPI: function () {
            fetch(this.baseUrl + 'search/shows?q=' + this.showBusqueda).then(
                response => {
                    return response.json();
                }
            ).then(data => {
                this.esconder();
                this.estadosApp.mirarTodos = true;
                this.shows = this.filtrarInformacion(data);
            });
        },
        filtrarInformacion: function (data) {
            return data.map(informacion => informacion.show);
        },
        esconder: function () {
            this.estadosApp.mirarTodos = false;
            this.estadosApp.mirarUno = false;
            this.estadosApp.mirarInicio = false;
            this.estadosApp.mirarFavoritos = false;
        },
        verMas: function (show) {
            this.esconder();
            this.show = show;
            this.estadosApp.mirarUno = true;
        },
        mostrarLista: function () {
            this.esconder();
            if (this.shows.length > 0) this.estadosApp.mirarTodos = true;
            else this.estadosApp.mirarInicio = true;
        },
        sumarFavorito: function (show) {
            var encontrar = this.favoritos.filter(p=>encontrarId(p,show.id));
            if (encontrar.length === 0) this.favoritos.push(show);
            else alert('El show se encuentra registrado en favoritos!');
        },
        verFavoritos: function () {
            this.esconder();
            this.estadosApp.mirarFavoritos = true;
        },
        verInicio: function () {
            this.esconder();
            this.estadosApp.mirarTodos = true;
        },
        eliminarFavorito: function (id) {
            this.favoritos = this.favoritos.filter(p=>filtrarId(p, id));
            if (this.favoritos.length === 0) {
                this.mostrarLista();
            }
        },
        consultarShowsPorPage: function (page) {
            return fetch(this.baseUrl + 'shows?page=' + page).then(
                response => {
                    return response.json();
                }
            ).then(data => {
                return data;
            }).catch(error => console.error(error));
        },
        consultarShowsIniciales: async function () {
            this.esconder();
            this.showsIniciales = await this.consultarShowsPorPage(1);
            this.estadosApp.mirarInicio = true;
            Array.prototype.push.apply(this.showsIniciales, await await this.consultarShowsPorPage(2));
        },
        verShowsIniciales: function () {
            this.esconder();
            this.estadosApp.mirarInicio = true;
        },
        prueba: function(){
            var a = new Promise (function(resolve, reject){
                if(apiResultado === 2){
                    reject("No funciono por tal cosa");
                }else if(apiResultado === 1){
                    reject("No funciono por otra vaina");
                }else{
                    resolve("funciono")
                }
            });
            a.then(p=>{
                p = procesoX();            
            }).catch(error=>alert(error));
        }
    }, beforeMount() {
        this.consultarShowsIniciales();
    }, filters: {
        separarPorComa: function (data) {
            return (data.length > 0) ? data.join(', ') : 'No se encontraron resultados';
        }
    }
});