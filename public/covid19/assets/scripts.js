var myChart;
const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      //  mode: 'no-cors',
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });
    const { token } = await response.json();
    localStorage.setItem("jwt-token", token);
    return token;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

$("#login").click(async () => {
  const { value: formValues } = await Swal.fire({
    title: "Login",
    html: '<input id="swal-input1" class="swal2-input" placeholder="Username">' 
    + '<input id="swal-input2" class="swal2-input" placeholder="Password" type="password">',
    focusConfirm: false,
    preConfirm: () => {
      return [document.getElementById("swal-input1").value, document.getElementById("swal-input2").value];
    },
  });
 

  console.log(formValues);
  const jwt = await login(formValues[0], formValues[1]);

  if (jwt != null && jwt != "" && Object(jwt)) {
    Swal.fire("Login Success!", "", "success");
    $("#login").hide();
    $("#logout").show();
    $("#situacionChile").show();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error in login!",
    });
  }
});

const getData = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/total", {
      method: "GET",
      headers: {
        //  Authorization: `Bearer ${jwt}`
      },
    });
    const { data } = await response.json();
    return data;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

const getDataRecovered = async (jwt) => {
  try {
    const response = await fetch("http://localhost:3000/api/recovered", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const { data } = await response.json();

    return data;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};
const getModal = async (jwt, country) => {
  try {
    const response = await fetch(`http://localhost:3000/api/countries/${country}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const { data } = await response.json();

    return data;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

$("#cantConf").change(function (e) {
  localStorage.setItem("cantConf", e.target.value);
  init();
});

const filter = (data, filter = 100000) => {
  const dataFilter = data.filter((df) => {
    if (df.confirmed > filter) {
      return df;
    }
  });
  return dataFilter;
};

const graph = (data, cant) => {
  const columns = new Array();
  const dataNumber = new Array();
  const dataNumberDea = new Array();
  const dataNumberAct = new Array();
  data.sort(function (a, b) {
    if (a.confirmed < b.confirmed) {
      return 1;
    }
    if (a.confirmed > b.confirmed) {
      return -1;
    }
    return 0;
  });
  data.forEach((d) => {
    columns.push(d.location);
    dataNumber.push(d.confirmed);
    dataNumberDea.push(d.deaths);
  });

  const columnsName = [];
  const dataNumberRecovered = [];
  const dataNumberActive = [];
  const dataNumberDeaths = [];
  for (let i = 0; i < cant; i++) {
    columnsName.push(columns[i]);
    dataNumberRecovered.push(dataNumber[i]);
    dataNumberActive.push(dataNumberDea[i]);
    dataNumberDeaths.push(dataNumberDeaths[i]);
    $(`#n-${i + 1}`).append(`<p>${columns[i]}</p>`);
  }

  if (myChart) {
    myChart.destroy();
  }
  Chart.defaults.color = "#ffffff";
  var ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: columnsName,
      datasets: [
        {
          label: "# Recovered",
          data: dataNumberRecovered,
          backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 159, 64, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
        {
          label: "# Active",
          data: dataNumberActive,
          backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

$(".filterCant").click((e) => {
  localStorage.setItem("cant", +e.target.innerText);
  init(+e.target.innerText);
});

const createTable = (data) => {
  const table = document.getElementById("table");
  var HTML = "";
  data.forEach((resp) => {
    HTML += `<tr>
        <th scope="row">${resp.location}</th>
        <td>${resp.confirmed}</td>
        <td>${resp.deaths}</td>
        <td><button class="btn btn-primary button-large" data-toggle="modal" onclick="graphCountry('${resp.location}')" data-target="#exampleModal">${resp.location}</button></td>
        </tr>
      `;
  });
  table.innerHTML = HTML;
};

const init = async (jwt) => {
  if(jwt != null && jwt != "" && jwt != undefined){

    $("#situacionChile").show();
  }else{
    
    $("#situacionChile").hide();
  }

  cant = localStorage.getItem("cant");
  cantConf = localStorage.getItem("cantConf");
  if (cant == undefined) {
    cant = 10;
  }
  if (cantConf == undefined) {
    cantConf = 100000;
  }
  $(".loading-1").hide();
  
  const data = await getData();
  const filterData = filter(data, cantConf);
  if (Object(filterData) != undefined) {
    graph(filterData, cant);
    createTable(filterData);
  }
  $(".loading").hide();
  $(".loading-1").show();
  Chart.defaults.color = "#ffffff";
};

const graphCountry = async (name) => {
  $("canvas#myChartCountry").remove();
  $("div.myChartCountry").append('<canvas id="myChartCountry" class="animate__animated animate__fadeIn" height="150"></canvas>');
  const jwt = localStorage.getItem("jwt-token");
  const data = await getModal(jwt, name);
  if (data.deaths == undefined) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No existen datos!",
    });
    $("#exampleModal").modal("hide");
  } else {
    const columnsName = [];
    const dataNumber = [];

    for (d in data) {
      if (d != "location" || d != "recovered" || d != "active") {
        columnsName.push(d);
      }
    }
    dataNumber.push(data.confirmed);
    dataNumber.push(data.deaths);

    var ctx = document.getElementById("myChartCountry").getContext("2d");

    var myChartCountry = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["location", "confirmed"],
        datasets: [
          {
            label: name,
            data: dataNumber,
            backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],

            hoverOffset: 4,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
};

$("#logout").click(() => {
  const jwt = localStorage.getItem("jwt-token");
  if (!(jwt === null || jwt === undefined || jwt === "")) {
    Swal.fire({
      title: "¿Desea cerrar sesión?",
      showDenyButton: true,
      confirmButtonText: `Cerrar sesión`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Logout Success!", "", "success");
        localStorage.clear();
        console.log(localStorage.getItem("jwt-token"));
        $(".login").show();
        $(".logout").hide();
        $("#situacionChile").hide();
        // window.location.replace('http://localhost:3000/covid19/login.html');
      }
    });
  } else {
    //window.location.replace('http://localhost:3000/covid19/login.html');
  }
});

$("#situacionChile").click(() => {
  const jwt = localStorage.getItem("jwt-token");
  if (jwt === null || jwt === undefined || jwt === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Inicie sesión por favor",
    });
  } else {
    $(".login").hide();
    $(".logout").show();
    window.location.replace("http://localhost:3000/covid19/SituacionChile.html");
    return jwt;
  }
});

const sesion = () => {
  const jwt = localStorage.getItem("jwt-token");
  if (jwt === null || jwt === undefined || jwt === "") {
    //  window.location.replace('http://localhost:3000/covid19/login.html');
    $(".login").show();
    $(".logout").hide();
    $(".situacionChile").hide();
  } else {
    $(".login").hide();
    $(".logout").show();
    return jwt;
  }
};

$(init(sesion()));
