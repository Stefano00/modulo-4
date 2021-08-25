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

$("#home").click(() => {
  window.location.replace("http://localhost:3000/covid19/index.html");
});

const getDataConfirmed = async (jwt) => {
  console.log(jwt);
  try {
    const response = await fetch("http://localhost:3000/api/confirmed", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const { data } = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

const getDataDeaths = async (jwt) => {
  try {
    const response = await fetch("http://localhost:3000/api/deaths", {
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
    if (df.total > filter) {
      return df;
    }
  });
  return dataFilter;
};

const graph = (dataConfirmed, dataRecovered, dataDeaths, cant) => {
  const columnsName = [];
  const dataNumberConfirmed = [];
  const dataNumberRecovered = [];
  const dataNumberDeaths = [];
  for (let i = 0; i < dataConfirmed.length; i++) {
    columnsName.push(dataConfirmed[i].date);
    dataNumberConfirmed.push(dataConfirmed[i].total);
    dataNumberRecovered.push(dataRecovered[i].total);
    dataNumberDeaths.push(dataDeaths[i].total);
  }

  if (myChart) {
    myChart.destroy();
  }
  Chart.defaults.color = "#ffffff";
  var ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: columnsName,
      datasets: [
        {
          label: "# Confirmed",
          data: dataNumberConfirmed,
          backgroundColor: ["rgba(255, 159, 64, 0.2)"],
          borderColor: ["rgba(153, 102, 255, 1)"],
          borderWidth: 1,
        },
        {
          label: "# Recuperados",
          data: dataNumberRecovered,
          backgroundColor: ["rgba(75, 192, 192, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
        {
          label: "# Muertos",
          data: dataNumberDeaths,
          backgroundColor: ["rgba(255, 206, 86, 0.2)"],
          borderColor: ["rgba(54, 162, 235, 1)"],
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
        window.location.replace("http://localhost:3000/covid19/index.html");
      }
    });
  } else {
    window.location.replace("http://localhost:3000/covid19/index.html");
  }
});

$("#situacionChile").click(() => {
  window.location.replace("http://localhost:3000/covid19/index.html");
});

const sesion = () => {
  const jwt = localStorage.getItem("jwt-token");
  if (jwt === null || jwt === undefined || jwt === "") {
    window.location.replace("http://localhost:3000/covid19/login.html");
  } else {
    $(".login").hide();
    $(".logout").show();
    return jwt;
  }
};

const init = async (jwt) => {
  cant = localStorage.getItem("cant");
  cantConf = localStorage.getItem("cantConf");
  if (cant == undefined) {
    cant = 10;
  }
  if (cantConf == undefined) {
    cantConf = 100000;
  }
  $(".loading-1").hide();
  //   const jwt = localStorage.getItem('jwt-token');
  const dataConfirmed = await getDataConfirmed(jwt);
  const dataRecovered = await getDataRecovered(jwt);
  const dataDeaths = await getDataDeaths(jwt);
  //  const filterData = filter(data, cantConf);
  if (Object(dataConfirmed) != undefined || Object(dataRecovered) != undefined || Object(dataDeaths) != undefined) {
    //  graph(filterData, cant);
    console.log("dataConfirmed ", dataConfirmed);
    console.log("dataRecovered ", dataRecovered);
    console.log("dataDeaths ", dataDeaths);
    graph(dataConfirmed, dataRecovered, dataDeaths, cant);
    // createTable(dataConfirmed);
  }
  $(".loading").hide();
  $(".loading-1").show();
  Chart.defaults.color = "#ffffff";
};

$(init(sesion()));
