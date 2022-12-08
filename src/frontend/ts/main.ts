declare const M;

class Main implements EventListenerObject, HandleResponse {

  private framework: Framework = new Framework();
  private personas: Array<Persona> = new Array();
  constructor(per: Persona) {
    this.personas.push(per);
    console.log(this);
  }
  public getPersona() {
    return this.personas;
  }

  public add_user() {
    let new_name = <HTMLInputElement>document.getElementById("usr_name");
    let new_age = <HTMLInputElement>document.getElementById("usr_age");
    let new_per = new Persona(new_name.value);
    new_per.edad = Number(new_age.value);
    this.personas.push(new_per);
  }

  cosultarDispositivoAlServidor() {
    this.framework.ejecutarRequest(
      "GET",
      "http://localhost:8000/devices",
      this
    );
  }

  cambiarEstadoDispositivoAlServidor() {
    let json = { id: 1, state: 0 };
    this.framework.ejecutarRequest(
      "POST",
      "http://localhost:8000/deviceChange",
      this,
      json
    );
  }
  cargarGrilla(listaDisp: Array<Device>) {
    console.log("llego info del servidor", listaDisp);
    let cajaDips = document.getElementById("cajaDisp");
    let grilla: string = "<ul class='collection'>";
    for (let disp of listaDisp) {
      grilla += ` <li class="collection-item avatar">`;

      if (disp.type == 1) {
        grilla += `<img src="static/images/lightbulb.png" alt="" class="circle"> `;
      } else {
        grilla += `<img src="static/images/window.png" alt="" class="circle"> `;
      }

      grilla += ` <span class="title negrita">${disp.name}</span>
            <p>${disp.description}
            </p>
            <a href="#!" class="secondary-content">
              <div class="switch">
                  <label>
                    Off`;
      if (disp.state) {
        grilla += `<input id="cb_${disp.id}" miAtt="mi dato 1" type="checkbox" checked>`;
      } else {
        grilla += `<input id="cb_${disp.id}" miAtt="mi dato 2" type="checkbox">`;
      }

      grilla += `<span class="lever"></span>
                    On
                  </label>
                </div>
          </a>
          </li>`;
    }
    grilla += "</ul>";

    cajaDips.innerHTML = grilla;

    for (let disp of listaDisp) {
      let cb = document.getElementById("cb_" + disp.id);
      cb.addEventListener("click", this);
    }

    this.framework.ocultarCargando();
  }

  handleEvent(object: Event): void {
    let tipoEvento: string = object.type;

    let objEvento: HTMLElement;
    objEvento = <HTMLElement>object.target;

    if (objEvento.id == "btnOtro") {
      console.log(objEvento.id, objEvento.textContent);
      let iNombre = <HTMLInputElement>document.getElementById("iNombre");
      objEvento.textContent = iNombre.value;
      alert("hola " + this.personas[0].getNombre() + " estoy en el main");
    } else if (objEvento.id == "btnDevices") {
      this.framework.mostrarCargando();
      this.cosultarDispositivoAlServidor();
    } else if (objEvento.id.startsWith("cb_")) {
      let idDisp = objEvento.id.substring(3);

      alert(
        "Se cambio el estado del dispositivo " +
          idDisp +
          " -" +
          (<HTMLInputElement>objEvento).checked
      );
    } else if (objEvento.id == "modal_btn") {
      this.add_user();
      var modal_welcome = document.getElementById("modalWelcome");
      var instance = M.Modal.getInstance(modal_welcome);
      instance.close();
    }else {
      objEvento = <HTMLElement>objEvento.parentElement;

      if (objEvento.id == "btnAdd") {
        M.toast({ html: "Se agrego", classes: "rounded" });
        let elementoTxtNombre = <HTMLInputElement>(
          document.getElementById("txtNombre")
        );

        console.log(elementoTxtNombre.value);
        let elementoSelectColor = <HTMLSelectElement>(
          document.getElementById("selectColores")
        );
        var instance = M.FormSelect.getInstance(elementoSelectColor);
        console.log(instance.getSelectedValues());
      }
    }
  }
}

window.addEventListener("load", () => {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, "");

  var elemB = document.querySelectorAll(".fixed-action-btn");
  var instances = M.FloatingActionButton.init(elemB, "");

  var elemC = document.querySelectorAll('.carousel');
  var instances = M.Carousel.init(elemC, {
    duration:500,
    numVisible:3
  });

  var elemsM = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elemsM, "");

  M.updateTextFields();

  let user: Usuario = new Usuario("Juan", "jperez", "jperez@gmail.com");
  let per1 = new Persona("Matias");
  per1.edad = 12;
  let main: Main = new Main(per1);
  main.add_user();
  mostrar(main);
  user_welcoming(main);
  main.handleEvent;

  let btnM = document.getElementById("modal_btn");
  btnM.addEventListener("click", main);
  let btn = document.getElementById("btnDevices");
  btn.addEventListener("click", main);
  let btn2 = document.getElementById("btnOtro");
  btn2.addEventListener("click", main);
  let btnAdd = document.getElementById("btnAdd");
  btnAdd.addEventListener("click", main);
});

function mostrar(main: Main) {
  let personas = main.getPersona();
  let datosPersonas = "";
  for (let i in personas) {
    datosPersonas = datosPersonas + personas[i].toString();
  }
}

function user_welcoming(main: Main) {
  console.log("Bienvenido");
  var modal_welcome = document.getElementById("modalWelcome");
  var instance = M.Modal.getInstance(modal_welcome);
  instance.open();
}
