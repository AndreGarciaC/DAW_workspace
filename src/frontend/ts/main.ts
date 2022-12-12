/**
 * main.ts Designated main file for the DAW (Web Applications Design) course final project.
 *
 * Description. Main typescript file.
 *
 * @link   https://github.com/AndreGarciaC/DAW_workspace/blob/master/src/frontend/ts/main.ts
 * @file   This file defines the Main class where html components and their events are being handled.
 * @author Matías Ramos, Andrea García.
 * @since  2022.10.17
 */
declare const M;

class Main implements EventListenerObject, HandleResponse {
  private framework: Framework = new Framework();
  private personas: Array<Persona> = new Array();

  /**
   * Constructor que agrega objeto de clase persona al arreglo personas.
   * @param per objeto de clase persona.
   */
  constructor(per: Persona) {
    this.personas.push(per);
    console.log(this);
  }

  /**
   * Método para la obtención del arreglo de personas.
   * @returns arreglo de personas.
   */
  public get_person() {
    return this.personas;
  }

  /**
   * Método que ejecuta un request xmlhttp para obtener todos los elementos de la tabla Devices en la dB.
   */
  ask_server_for_device() 
  {
    this.framework.ejecutarRequest(
      "GET",
      "http://localhost:8000/devices",
      this
    );
  }

  /**
   * Método que ejecuta un request xmlhttp para cambiar el estado de un elemento de la tabla Devices en la dB.
   * @param dvc_id id del dispositivo a modificar.
   * @param dvc_stt nuevo valor que adquirira el estado del dispositivo.
   */
  ask_server_change_stt_device(dvc_id: number, dvc_stt: number) {
    let json = {
      id: dvc_id,
      state: dvc_stt,
    };
    this.framework.ejecutarRequest(
      "PUT",
      "http://localhost:8000/Devices",
      this,
      json
    );
  }

  /**
   * Método que ejecuta un request xmlhttp para agregar un elemento a la tabla Devices en la dB.
   * @param dvc_id id del dispositivo por agregar.
   * @param dvc_name nombre del dispositivo por agregar.
   * @param dvc_stt estado del dispositivo por agregar.
   * @param dvc_descp descripción del dispositivo por agregar.
   * @param dvc_type tipo del dispositivo por agregar.
   */
  ask_server_add_device(
    dvc_id: number,
    dvc_name: string,
    dvc_stt: number,
    dvc_descp: string,
    dvc_type: number
  ) {
    if ( 
      dvc_id == null ||
      dvc_name == "" ||
      dvc_stt == null ||
      dvc_descp == "" ||
      dvc_type == null
    ) {
      alert("No es posible agregar dispositivo. Existen campos vacíos.");
    } else {
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

  /**
   * Método que ejecuta un request xmlhttp para eliminar un elemento de la tabla Devices en la dB.
   * @param dvc_id id del dispositivo por eliminar.
   */
  ask_server_delete_device(dvc_id: number) {
    let json = { id: dvc_id };
    this.framework.ejecutarRequest(
      "DELETE",
      "http://localhost:8000/Devices",
      this,
      json
    );
  }

  /**
   * Método que crea una grilla con todos los elementos presentes en la tabla Devices de la dB. Los dispone en un collection-avatar en donde invluye logo, nombre, descripción, estado y botón de eliminar.
   * @param dvcs_list Array con dispositivos retornados por el servidor.
   */
  load_devices_grid(dvcs_list: Array<Device>) {
    console.log("llegó info del servidor", dvcs_list);
    let dvcs_grid = document.getElementById("cajaDisp");
    let grilla: string = "<ul class='collection'>";
    for (let disp of dvcs_list) {
      grilla += ` <li class="collection-item avatar">`;
      //logo avatar según el tipo de dispositivo
      if (disp.type == 0) {
        grilla += `<img src="static/images/lightbulb.png" alt="" class="circle"> `;
      }
      if (disp.type == 1) {
        grilla += `<img src="static/images/window.png" alt="" class="circle"> `;
      }
      if (disp.type == 2) {
        grilla += `<img src="static/images/audio.png" alt="" class="circle"> `;
      }
      if (disp.type == 3) {
        grilla += `<img src="static/images/lock.png" alt="" class="circle"> `;
      }
      if (disp.type == 4) {
        grilla += `<img src="static/images/chimney.png" alt="" class="circle"> `;
      }

      //Visualización de estado a través de switch en el caso de que el dispositivo no sea tipo audio.
      if (disp.type != 2) {
        grilla += ` <span class="title negrita">${disp.name}</span>
            <p>${disp.description}
            </p>
            <a href="#!" class="secondary-content col s5">
              <div class="switch">
                  <label>
                    Off`;
        if (disp.state != 0) {
          grilla += `<input id="cb_${disp.id}" miAtt="mi dato 1" type="checkbox" checked>`;
        } else {
          grilla += `<input id="cb_${disp.id}" miAtt="mi dato 2" type="checkbox">`;
        }
        grilla += `<span class="lever"></span>On</label>
                  </div>
                  </a>`;
      }

       //Visualización de estado a través de range-field en el caso de que el dispositivo sea tipo audio.
      if (disp.type == 2) {
        grilla += ` <span class="title negrita">${disp.name}</span>
            <p>${disp.description}</p>
            <a href="#!" class="secondary-content col s5">
              <div>
                 <form action="#">
                 <p class="range-field">
                 <input class="dvc_range" type="range" id="rg_${disp.id}" min="0" max="100" step="10"/>
                 </p>
                 </form>`;
      }

      //Botón para eliminar elemento
      grilla += `<a id="dvc_${disp.id}_del_btn" class="waves-effect waves-circle waves-light btn-floating secondary-content">del</a>
          </li>`;
    }
    grilla += "</ul>";

    dvcs_grid.innerHTML = grilla;

    //Cambio de estado por click en switch
    for (let disp of dvcs_list) {
      let cb = document.getElementById("cb_" + disp.id);
      cb.addEventListener("click", this);

      let del_btn = document.getElementById("dvc_" + disp.id + "_del_btn");
      del_btn.addEventListener("click", this);
    }

    this.framework.ocultarCargando();
  }

  /**
   * Método de rutina callbacks para eventos asíncronos.
   * @param object Evento generado por componente html.
   */
  handleEvent(object: Event): void {
    let tipoEvento: string = object.type;

    let objEvento: HTMLElement;
    objEvento = <HTMLElement>object.target;

    if (objEvento.id == "usr_msg") 
    {
      console.log(objEvento.id, objEvento.textContent);
      alert(
        "Hola. Gestiona tu casa inteligente controlando todos tus dispositivos"
      );
    } 
    else if (objEvento.id == "btnDevices") //Evento click en botón que muestra el loader y muestra los dispositivos.
    {
      this.framework.mostrarCargando();
      this.ask_server_for_device();
      var btn = document.getElementById("btnDevices");
      btn.setAttribute("disabled", "");
      var btn = document.getElementById("btn_add");
      btn.removeAttribute("disabled");
    } 

    else if (objEvento.id.endsWith("_del_btn")) //Evento click en botón que elimina dispositivo.
    {
      let idDisp = objEvento.id.substring(4, 5);
      console.log("Eliminar " + idDisp);
      this.ask_server_delete_device(parseInt(idDisp));
      this.ask_server_for_device();
    } 

    else if (objEvento.id.startsWith("cb_")) //Evento click en switch que cambia estado de dispositivo
    {
      let idDisp = objEvento.id.substring(3);
      console.log("Modificar " + idDisp);
      let val: number = 0;
      if ((<HTMLInputElement>objEvento).checked) {
        val = 1;
      }
      alert(
        "Se modificó el estado del dispositivo " +
          idDisp +
          " -" +
          (<HTMLInputElement>objEvento).checked
      );
      this.ask_server_change_stt_device(parseInt(idDisp), val);
      this.ask_server_for_device();
    } 
    else if (objEvento.id == "btn_add") //Evento click en botón que agrega dispositivo.
    {
      var modal_device = document.getElementById("modal_device");
      var instance = M.Modal.getInstance(modal_device);
      instance.open();
      instance.options.onCloseEnd = () => {
        console.log("saved");
        let dvc = add_device();
        console.log("device" + dvc);
        this.ask_server_add_device(
          dvc.id,
          dvc.name,
          dvc.state,
          dvc.description,
          dvc.type
        );
        this.framework.mostrarCargando();
        this.ask_server_for_device();
      };
      document.getElementById("modal_dvc_btn").onclick = function () {
        instance.close();
      };
    } 
    else if (objEvento.className == ".dvc_range") //Evento click en range que detecta modificación.
    {
      console.log("Range modificado");
    } 
    else
    {
      objEvento = <HTMLElement>objEvento.parentElement;
    }
  }
}

/**
* Método de detección de eventos asíncronos.
*/
window.addEventListener("load", () => {

  //Inicialización de instancias materialize.
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

  var elemsT = document.querySelectorAll(".tooltipped");
  var instances = M.Tooltip.init(elemsT, "");

  M.updateTextFields();

  //Arranque de bienvenida y definición de eventos.
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
  const rg_change = document.querySelector(".dvc_range");
  rg_change.addEventListener("change", main);
});

function mostrar(main: Main) {
  let personas = main.get_person();
  let datosPersonas = "";
  for (let i in personas) {
    datosPersonas = datosPersonas + personas[i].toString();
  }
}

/**
 * Función que lanza el modal de bienvenida al usuario y todos sus componentes.
 */
function user_welcoming() {
  var modal_welcome = document.getElementById("modalWelcome");
  var instance = M.Modal.getInstance(modal_welcome);
  instance.open();
  document.getElementById("modal_btn").onclick = function () {
    let usr_name = add_user();
    if (usr_name == "") {
      alert("Usuario sin registrar");
    }
    close_user_welcoming();
  };
}

/**
 * Función de cierre de modal de bienvenida al usuario.
 */
function close_user_welcoming() {
  var modal_welcome = document.getElementById("modalWelcome");
  var instance = M.Modal.getInstance(modal_welcome);
  instance.close();
}

/**
 * Función agregar usuario.
 * @returns el nombre del usuario que ha lanzado la página.
 */
function add_user(): String {
  let new_name = <HTMLInputElement>document.getElementById("usr_name");
  let new_age = <HTMLInputElement>document.getElementById("usr_age");
  let new_per = new Persona(new_name.value);
  new_per.edad = Number(new_age.value);
  document.getElementById("usr_msg").innerHTML = "Hola " + new_name.value;
  return new_name.value;
}

/**
 * Función para agregar dispositivo.
 * @returns objeto clase Device con todos los elementos que la componen.
 */
function add_device(): Device {
  let new_id = <HTMLInputElement>document.getElementById("dvc_id");
  let new_name = <HTMLInputElement>document.getElementById("dvc_name");
  let new_descp = <HTMLInputElement>document.getElementById("dvc_descp");
  let new_type = <HTMLInputElement>document.getElementById("dvc_type");
  let new_dvc = new Device();
  new_dvc.id = parseInt(new_id.value);
  new_dvc.name = new_name.value;
  new_dvc.state = 0;
  new_dvc.description = new_descp.value;
  new_dvc.type = parseInt(new_type.value);
  return new_dvc;
}
