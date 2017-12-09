function run(genFunc) {
  const genObj = genFunc()

  function iterate(iteration) {
    if (iteration.done) return Promise.resolve(iteration.value)
    return Promise.resolve(iteration.value)
      .then(x => iterate(genObj.next(x)))
      .catch(x => iterate(genObj.throw(x)))
  }

  try {
    return iterate(genObj.next())
  } catch (ex) {
    return Promise.reject(ex)
  }
}

function* gen() {
  let select1 = document.getElementById('starship1').value
  let select2 = document.getElementById('starship2').value

  let starship1 = yield fetch(`https://swapi.co/api/starships/${select1}/`)
  let starship2 = yield fetch(`https://swapi.co/api/starships/${select2}/`)

  let res1 = yield starship1.json()
  let res2 = yield starship2.json()

  let result1 = {
    name: res1.name,
    cost: res1.cost_in_credits,
    speed: res1.max_atmosphering_speed,
    cargo: res1.cargo_capacity,
    passenger: res1.passengers
  };
  let result2 = {
    name: res2.name,
    cost: res2.cost_in_credits,
    speed: res2.max_atmosphering_speed,
    cargo: res2.cargo_capacity,
    passenger: res2.passengers
  };
  let title = ['Name', 'Cost', 'Speed', 'Cargo Size', 'Passengers'];

  showResult(result1, result2, title)

}

function createTableHeader(tableId) {
  let tr = document.createElement('TR')
  let th1 = document.createElement('TH')
  let th2 = document.createElement('TH')
  let th3 = document.createElement('TH')

  th1.appendChild(document.createTextNode(' '))
  th2.appendChild(document.createTextNode('Starship 1'))
  th3.appendChild(document.createTextNode('Starship 2'))
  tr.appendChild(th1)
  tr.appendChild(th2)
  tr.appendChild(th3)

  document.getElementById(tableId).appendChild(tr)

}

function showResult(starship1, starship2, title) {

  let table = document.getElementById('compareTable');

  while (table.hasChildNodes()) {
    table.removeChild(table.firstChild)
  }

  createTableHeader('compareTable');

  for (let i = 0; i < title.length; i++) {

    let tr = document.createElement('TR')
    let td1 = document.createElement('TD')
    let td2 = document.createElement('TD')
    let td3 = document.createElement('TD')

    let data1 = (i!=0) ? parseInt(starship1[Object.keys(starship1)[i]]) : starship1[Object.keys(starship1)[i]]
    let data2 = (i!=0) ? parseInt(starship2[Object.keys(starship2)[i]]) : starship2[Object.keys(starship2)[i]]

    td1.appendChild(document.createTextNode(title[i]))
    td2.appendChild(document.createTextNode(data1))
    td3.appendChild(document.createTextNode(data2))

    if(i > 0) {
      if(data1 > data2) {
        td2.style = "background-color: red"
        td3.style = "background-color: white"
      }else if(data1 < data2) {
        td2.style = "background-color: white"
        td3.style = "background-color: red"
      }else{
        td2.style = "background-color: white"
        td3.style = "background-color: white"
      }
    }

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)

    table.appendChild(tr)

  }

}

document.getElementById('btn').addEventListener('click', function () {
  run(gen).catch(function (err) {
    alert(err.message)
  })
})