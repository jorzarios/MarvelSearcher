var $ = window.jQuery;

class MarvelApi {
  constructor (key){
    this.key = key;
    this.baseUrl = 'https://gateway.marvel.com/v1/public/'
  }

  findSeries (title) {
    let url = `${this.baseUrl}series?title=${title}&${this.key}`

    if(localStorage[url]){
      let datos = JSON.parse(localStorage[url]);
      console.log('hola desde cache');
      return Promise.resolve(datos);
    } else {
      return Promise.resolve($.get(url))
      .then((res) => {
        let datos = res.data.results[0]
        datos = JSON.stringify(datos)
        console.log(datos);
        localStorage[url]=datos
        return Promise.resolve(datos)
      })
    }
  }
  getResourceURI(req){
    let url = `${req}?${this.key}`
    if(localStorage[url]){
      let datos = JSON.parse(localStorage[url]);
      console.log('hola desde cache');
      return Promise.resolve(datos);
    }
      return Promise.resolve($.get(url))
      .then((res) => {
        let datos = res.data.results[0];
        datos = JSON.stringify(datos)
        localStorage[url] = datos
        return Promise.resolve(datos);
    })
  }

  searchCharacter(name) {
    let url = `${this.baseUrl}characters?name=${name}&${this.key}`
    return new Promise(function (done) {
      $.get(url).done(function (data) {
        done(data)
      })
    })
    .then(function (res) {
      if(!res.data.total){ 
        return Promise.reject('no se encontro el personaje')
      }
      return res.data.results[0]
    })
  }

}

window.MarvelApi = MarvelApi
