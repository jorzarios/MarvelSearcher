var $ = window.jQuery;
var Marvel = window.MarvelApi;

var key = 'ts=1&apikey=0754bc33ed6edd49e0b3baefb0517836&hash=ee21c0f42dde0d0f62015e1649018022';
var api = new MarvelApi(key);

api.findSeries('avengers').then(serie => {
  let serieImage = `url(${serie.thumbnail.path}.${serie.thumbnail.extension})`;
  $('.Layout').css('background-image', serieImage);
  var characters = serie.characters.items;
  var promises = [];
  for (let character of characters) {
    var promise = api.getResourceURI(character.resourceURI);
    promises.push(promise);
  }
  return Promise.all(promises);
}).then(ch => {
  return ch.filter(char => {
    return !!char.thumbnail;
  });
}).then(characters => {
  characters = shuffle(characters);
  for (var i = 0; i < 5; i++) {
    let character = characters[i];
    drawCharacter(character);
  }
}).catch(err => {
  console.log(err);
});

$('.CharacterForm').on('submit', function (ev) {
  ev.preventDefault();
  var name = $(this).find('.CharacterForm-name').val();
  api.searchCharacter(name).then(function (char) {
    drawCharacter(char);
  }).catch(function (r) {
    if (r === 'no se encontro el personaje') {
      $('.CharacterMessage').text(r);
    }
  });
});

function renderCharacter(character) {
  let attackPoints = Math.ceil(Math.random() * 500) + 500;
  //genera un numero de 500 al 1000
  return `<div class="Card ">
    <div class="Card-container">
      <h2 class="Card-name">${character.name}</h2><img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="" class="Card-image">
      <div class="Card-description">${character.description}</div>
      <div class="Card-attack" data-attack="${attackPoints}">${attackPoints} puntos de ataque</div>
    </div>
    <div class="Card-backface"> </div>
  </div>`;
}
function shuffle(arr) {
  for (var i = 0; i < arr.length; i++) {
    let tmp = arr[i];
    let index = Math.floor(Math.random() * arr.length - 1);
    arr[i] = arr[index];
    arr[index] = tmp;
  }
  return arr;
}
function drawCharacter(character) {
  let template = renderCharacter(character);
  let $card = $(template);
  $card.on('click', function (event) {
    let $this = $(this);
    let attack = $this.find('.Card-attack');
    console.log(attack.data('attack'));
  });
  $('.Battle-player').append($card);
}