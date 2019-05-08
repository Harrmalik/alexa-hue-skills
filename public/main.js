const getGroups = async url => {
  try {
    const response = await fetch(url);
    const groups = await response.json();

    let groupRows = ''

    console.log(groups);
    for (var i = 1; i < Object.keys(groups).length + 2; i++) {
        if (groups[i]) {
            groupRows += `
                <tr>
                  <th scope="row">${i}</th>
                  <td>${groups[i].name}</td>
                  <td>${groups[i].state.any_on}</td>
                  <td>${groups[i].lights}</td>
                </tr>
            `
        }
    }

    $('#groups').append(`
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>

          ${groupRows}
          </tbody>
        </table>
    `)
  } catch (error) {
    console.log(error);
  }
};

const getSensors = async url => {
  try {
    const response = await fetch(url);
    const sensors = await response.json();

    let sensorRows = ''

    console.log(sensors);
    for (var i = 1; i < Object.keys(sensors).length + 2; i++) {
        if (sensors[i]) {
            sensorRows += `
                <tr>
                  <th scope="row">${i}</th>
                  <td>${sensors[i].name}</td>
                  <td>${sensors[i].state.presence}</td>
                  <td>${sensors[i].lights}</td>
                </tr>
            `
        }
    }

    $('#sensors').append(`
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>

          ${sensorRows}
          </tbody>
        </table>
    `)
  } catch (error) {
    console.log(error);
  }
};
