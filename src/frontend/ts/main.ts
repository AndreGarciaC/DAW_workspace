declare const M;

class Main implements EventListenerObject, HandleResponse {
  private framework: Framework = new Framework();
  private personas: Array<Persona> = new Array();

  constructor(per: Persona) {
    this.personas.push(per);
    console.log(this);
  }

  public get_person() {
    return this.personas;
  }

  ask_server_for_device() {
    this.framework.ejecutarRequest(
      "GET",
      "http://localhost:8000/devices",
      this
    );
  }

  ask_server_change_stt_device() {
    let json = { id: 1, state: 0 };
    this.framework.ejecutarRequest(
      "POST",
      "http://localhost:8000/deviceChange",
      this,
      json
    );
  }

  ask_server_add_device(
    dvc_id: number,
    dvc_name: string,
    dvc_stt: boolean,
    dvc_descp: string,
    dvc_type: number
  ) {
    if (dvc_id == null || dvc_name == "" || dvc_stt == null || dvc_descp == "" || dvc_type== null){
      alert("No es posible agregar dispositivo. Existen campos vacíos.");
    }
    else{
      let json = {
        id: dvc_id,
        name: dvc_name,
        state: dvc_stt,
        description: dvc_descp,
        type: dvc_type,
      };
      this.framework.ejecutarRequest(
        "POST",
        "http://localhost:8000/Devices",
        this,
        json
      );
    }
  }

  ask_server_delete_device() {
    let json = { id: 1, state: 0 };
    this.framework.ejecutarRequest(
      "DELETE",
      "http://localhost:8000/deviceDel",
      this,
      json
    );
  }

  load_devices_grid(dvcs_list: Array<Device>) {
    console.log("llego info del servidor", dvcs_list);
    let dvcs_grid = document.getElementById("cajaDisp");
    let grilla: string = "<ul class='collection'>";
    for (let disp of dvcs_list) {
      grilla += ` <li class="collection-item avatar">`;

      if (disp.type == 0) {
        grilla += `<img src="static/images/lightbulb.png" alt="" class="circle"> `;
      }  if (disp.type == 1) {
        grilla += `<img src="static/images/window.png" alt="" class="circle"> `;
      } if (disp.type == 2) {
        grilla += `<img src="static/images/audio.png" alt="" class="circle"> `;
      } if (disp.type == 3) {
        grilla += `<img src="static/images/lightbulb.png" alt="" class="circle"> `;
      } if (disp.type == 4) {
        grilla += `<img src="static/images/window.png" alt="" class="circle"> `;
      }

      grilla += ` <span class="title negrita">${disp.name}</span>
            <p>${disp.description}
            </p>
            <a href="#!" class="secondary-content col s3">
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
          <a id="dvc_del_btn" href="#!" class="secondary-content" btn-flat btn tooltipped data-position="bottom" data-tooltip="Eliminar dispositivo"><i class="material-icons">highlight_off</i></a>
          </li>`;
    }
    grilla += "</ul>";

    dvcs_grid.innerHTML = grilla;

    for (let disp of dvcs_list) {
      let cb = document.getElementById("cb_" + disp.id);
      cb.addEventListener("click", this);
    }
    this.framework.ocultarCargando();
  }

  handleEvent(object: Event): void {
    let tipoEvento: string = object.type;

    let objEvento: HTMLElement;
    objEvento = <HTMLElement>object.target;

    if (objEvento.id == "usr_msg") {
      console.log(objEvento.id, objEvento.textContent);
      alert(
        "Hola. Gestiona tu casa inteligente controlando todos tus dispositivos"
      );
    } else if (objEvento.id == "btnDevices") {
      this.framework.mostrarCargando();
      this.ask_server_for_device();
      var btn = document.getElementById("btnDevices");
      btn.setAttribute("disabled", "");
      var btn = document.getElementById("btn_add");
      btn.removeAttribute("disabled");
    } else if (objEvento.id.startsWith("cb_")) {
      let idDisp = objEvento.id.substring(3);

      alert(
        "Se cambio el estado del dispositivo " +
          idDisp +
          " -" +
          (<HTMLInputElement>objEvento).checked
      );
    } else if (objEvento.id == "btn_add") {
      var modal_device = document.getElementById("modal_device");
      var instance = M.Modal.getInstance(modal_device);
      instance.open();
      instance.options.onCloseEnd = () => {
        console.log("saved");
        let dvc = add_device();
        console.log("device"+dvc);
        this.ask_server_add_device(dvc.id,dvc.name,dvc.state,dvc.description,dvc.type);
        this.framework.mostrarCargando();
        this.ask_server_for_device();
      }
      document.getElementById("modal_dvc_btn").onclick = function () {
        instance.close();
      };
    } else if (objEvento.id == "dvc_del_btn") {
      console.log("clicked");
    } else {
      objEvento = <HTMLElement>objEvento.parentElement;
    }
  }
}

window.addEventListener("load", () => {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, "");

  var elemB = document.querySelectorAll(".fixed-action-btn");
  var instances = M.FloatingActionButton.init(elemB, "");

  var elemC = document.querySelectorAll(".carousel");
  var instances = M.Carousel.init(elemC, {
    duration: 500,
    numVisible: 3,
  });

  var elemsM = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elemsM, "");

  var elemsT = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elemsT, "");

  M.updateTextFields();

  user_welcoming();
  let person = new Persona(document.getElementById("usr_msg").textContent);
  let main: Main = new Main(person);
  mostrar(main);
  main.handleEvent;

  let btnM = document.getElementById("modal_btn");
  btnM.addEventListener("click", main);
  let btn = document.getElementById("btnDevices");
  btn.addEventListener("click", main);
  let btn_usr = document.getElementById("usr_msg");
  btn_usr.addEventListener("click", main);
  let btn_add = document.getElementById("btn_add");
  btn_add.addEventListener("click", main);
  let btnM_dvc = document.getElementById("modal_dvc_btn");
  btnM_dvc.addEventListener("click", main);
  let btn_del_dvc = document.getElementById("dvc_del_btn");
  btn_del_dvc.addEventListener("click",main);
});

function mostrar(main: Main) {
  let personas = main.get_person();
  let datosPersonas = "";
  for (let i in personas) {
    datosPersonas = datosPersonas + personas[i].toString();
  }
}

function user_welcoming() {
  var modal_welcome = document.getElementById("modalWelcome");
  var instance = M.Modal.getInstance(modal_welcome);
  instance.open();
  document.getElementById("modal_btn").onclick = function () {
    add_user();
    close_user_welcoming();
  };
}

function close_user_welcoming() {
  var modal_welcome = document.getElementById("modalWelcome");
  var instance = M.Modal.getInstance(modal_welcome);
  instance.close();
}

function add_user() {
  let new_name = <HTMLInputElement>document.getElementById("usr_name");
  let new_age = <HTMLInputElement>document.getElementById("usr_age");
  let new_per = new Persona(new_name.value);
  new_per.edad = Number(new_age.value);
  document.getElementById("usr_msg").innerHTML = "Hola " + new_name.value;
}

function add_device(): Device {
    let new_id = <HTMLInputElement>document.getElementById("dvc_id");
    let new_name = <HTMLInputElement>document.getElementById("dvc_name");
    let new_descp = <HTMLInputElement>document.getElementById("dvc_descp");
    let new_type = <HTMLInputElement>document.getElementById("dvc_type");
    let new_dvc = new Device();
    new_dvc.id = parseInt(new_id.value);
    new_dvc.name = new_name.value;
    new_dvc.state = false;
    new_dvc.description = new_descp.value;
    new_dvc.type = parseInt(new_type.value);
    return new_dvc
  }
