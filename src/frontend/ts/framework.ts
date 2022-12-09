/**
 *
 */
class Framework {
  public ejecutarRequest(
    metodo: string,
    url: string,
    responseHandler: HandleResponse,
    data?: any
  ) {
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          let dvcs_list: Array<Device> = JSON.parse(xmlHttp.responseText);//Transforma de string a JSON
          responseHandler.load_devices_grid(dvcs_list);
        } else {
          alert("ERROR en la consulta");
        }
      }
    };
    xmlHttp.open(metodo, url, true);
    if (data != undefined) {
      xmlHttp.setRequestHeader("Content-Type", "application/json");
      xmlHttp.send(JSON.stringify(data));
    } else {
      xmlHttp.send();
    }
  }

  public mostrarCargando() {
    let imgLoading = document.getElementById("loading");
    imgLoading.style.visibility = "visible";
  }
  public ocultarCargando() {
    let imgLoading = document.getElementById("loading");
    imgLoading.style.visibility = "hidden";
  }
}
