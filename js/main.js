"use strict";
let baseURL = 'https://web-unicen.herokuapp.com/api/groups/';
let grupo = "LeandroHeroel";
let coleccion = "banda";
//window.onload = cargarHome;
document.addEventListener('DOMContentLoaded', cargarHome);
let container = document.querySelector("#js-inserta-html");

setInterval(cargarTabla, 5000);

function cargarHome(){
  fetch("home.html").then( function(response){
    if (response.ok) {
      response.text().then(t=> {
        container.innerHTML = t;
        console.log(response);
      });
    }else{
      container.innerHTML = "<h1>Error - Failed URL!</h1>";
    }
  })
}

function procesarHtml(t) {
  //agrego al DOM
  container.innerHTML = t;
  //busco sobre lo que agregué y agrego evento
  container.querySelectorAll(".js-comportamiento")
  .forEach(b=> b.addEventListener("click", partialRender));
  //esto es para tour pero se hace en todos
  document.querySelector("#btn-post").addEventListener('click', guardarTabla);
  document.querySelector("#btn-postx3").addEventListener('click', cargarTabla_defecto);
  document.querySelector("#btn-filtrar").addEventListener('click', cargarTabla);
  cargarTabla();
  // setInterval(cargarTabla, 5000);
}

function partialRender(event){
  event.preventDefault();
  let url = this.getAttribute('href');
  fetch(url).then( function(response){
      if (response.ok) {
        console.log("ok");
        console.log(response);
        response.text().then(procesarHtml);
      }else{
        container.innerHTML = "<h1>Error - Failed URL!</h1>";
      }
    })
    .catch(function(response){
      console.log(response);
      container.innerHTML = "<h1>Error - Conection Failed!</h1>";
    });
}

let jsloads = document.querySelectorAll(".nav-link");
jsloads.forEach(e=> e.addEventListener("click", partialRender));

function guardarTabla() {
  let city = document.querySelector("#inputCity").value;
  let stadium = document.querySelector("#inputStadium").value;
  let price = document.querySelector("#inputPrice").value;
  let objeto = {
    "thing": {
      "city": city,
      "stadium": stadium,
      "price": price
    }
  }
  fetch(baseURL+grupo+"/"+coleccion, {
    'method': 'POST',
    'headers': {
      'Content-type': 'application/json'
    },
    'body': JSON.stringify(objeto)
  }).then(response => {
    if (response.ok) {
      response.json().then(t=> {
        console.log("Se guardo");
        cargarTabla();
      })
    }else{
      console.log("No se guardo");
    }
  })
  .catch(
    function(response){
      console.log("Problema de conexion");
    }
  )
}

function cargarTabla(){
  let tabla = document.querySelector("#tablaTour");
  let tablaEdit = "";
  let filtro = document.querySelector('#selectFiltro').value;
  fetch(baseURL+grupo+"/"+coleccion).then(response=> {
    if (response.ok) {
      response.json().then(t=> {
        for (let info of t.banda) {
          if (filtro == 2) {
            if (info.thing.price <= "500") {
              tablaEdit += '<tr><td>'+ info.thing.city + '</td><td>'+ info.thing.stadium +'</td><td>'+ "$" +info.thing.price +
              '</td><td><button type="button" class="btn-borrar btn btn-warning" name="'+info._id+'">Delete</button>  <button type="button" class="btn-editar btn btn-light" name="'+info._id+'">Edit</button></td></tr>';
            }
          }else if (filtro == 3) {
            if (info.thing.price > "500") {
              tablaEdit += '<tr><td>'+ info.thing.city + '</td><td>'+ info.thing.stadium +'</td><td>'+ "$" +info.thing.price +
              '</td><td><button type="button" class="btn-borrar btn btn-warning" name="'+info._id+'">Delete</button>  <button type="button" class="btn-editar btn btn-light" name="'+info._id+'">Edit</button></td></tr>';
            }
          }else{
              tablaEdit += '<tr><td>'+ info.thing.city + '</td><td>'+ info.thing.stadium +'</td><td>'+ "$" +info.thing.price +
              '</td><td><button type="button" class="btn-borrar btn btn-warning" name="'+info._id+'">Delete</button>  <button type="button" class="btn-editar btn btn-light" name="'+info._id+'">Edit</button></td></tr>';
          }
        }

        tabla.innerHTML = tablaEdit;

        document.querySelectorAll('.btn-borrar').forEach(b=> {
          b.addEventListener('click', br=> {
            borrarTabla(b.getAttribute('name'));
          });
        });
        document.querySelectorAll('.btn-editar').forEach(e=> {
          e.addEventListener('click', ed=> {
            editarTabla(e.getAttribute('name'));
          });
        });
      })
    }else {
      console.log("No se encontro el archivo");
    }
  })
  .catch(
    function(response){
      console.log("Problema de conexion");
    }
  )
}

function borrarTabla(id){
  fetch(baseURL+grupo+'/'+coleccion+'/'+id, {
    'method': 'DELETE',
    'headers': {
        'Content-type': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      response.json().then(t=> {
        cargarTabla();
        console.log("Se ha eliminado");
      })
    }else {
      console.log("No se encontro el archivo");
    }
  })
  .catch(
    function(response){
      console.log("Problema de conexion");
    }
  )
}

function editarTabla(id){
  let city = document.querySelector("#inputCity").value;
  let stadium = document.querySelector("#inputStadium").value;
  let price = document.querySelector("#inputPrice").value;
  let objeto = {
    "thing": {
      "city": city,
      "stadium": stadium,
      "price": price
    }
  }
  fetch(baseURL+grupo+'/'+coleccion+'/'+id, {
    'method': 'PUT',
    'headers': {
      'Content-type': 'application/json'
    },
    'body': JSON.stringify(objeto)
  }).then(response=> {
    if (response.ok) {
      response.json().then(t=> {
        cargarTabla();
        console.log("Se ha editado exitosamente");
      })
    }else {
      console.log("No se encontro el archivo");
    }
  })
  .catch(
    function(response){
      console.log("Problema de conexion");
    }
  )
}

function cargarTabla_defecto(){
  let objeto = {
    "thing": {
      "city": "Barcelona",
      "stadium": "Camp nou",
      "price": "500"
    }
  }
  for (let i = 0; i < 3; i++) {
    fetch(baseURL+grupo+'/'+coleccion, {
      'method': 'POST',
      'headers': {
        'Content-type': 'application/json'
      },
      'body': JSON.stringify(objeto)
    }).then(response => {
      if (response.ok) {
        response.json().then(t=> {
          console.log("Se guardo");
          cargarTabla();
        })
      }else{
        console.log("No se guardo");
      }
    })
    .catch(
      function(response){
        console.log("Problema de conexion");
      }
    )
  }
}
