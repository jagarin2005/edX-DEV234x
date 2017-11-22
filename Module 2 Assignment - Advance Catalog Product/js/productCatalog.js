var eventId = [
  {
    id: 'searchBtn',
    resultId: 'searchBox',
    event: 'click',
    searchType: 'id'
  },
  {
    id: 'searchTypeBtn',
    resultId: 'searchTypeBox',
    event: 'click',
    searchType: 'type'
  },
  {
    id: 'searchPriceBtn',
    resultId: 'searchPriceBox',
    event: 'click',
    searchType: 'price'
  },
  {
    id: 'searchForm',
    resultId: 'searchBox',
    event: 'submit',
    searchType: 'id'
  },
  {
    id: 'searchTypeForm',
    resultId: 'searchTypeBox',
    event: 'submit',
    searchType: 'type'
  },
  {
    id: 'searchPriceForm',
    resultId: 'searchPriceBox',
    event: 'submit',
    searchType: 'price'
  }
];

eventId.forEach( function(item) {
  document.getElementById(item.id).addEventListener(item.event, function(e) {
    e.preventDefault();
    switch (item.searchType) {
      case 'id':
        processSearch(document.getElementById(item.resultId).value);
        break;
    
      case 'type':
        processTypeSearch(document.getElementById(item.resultId).value);
        break;
        
      case 'price': 
        processPriceSearch(document.getElementById(item.resultId).value);
        break;

      default:
        alert("Error : Invalid type!");
        break;
    }

  });
});

function processSearch(searchId) {
  api.searchProductById(searchId).then((val) => {
    return Promise.all([api.searchProductByPrice(val.price, 50), api.searchProductByType(val.type), val]);
  })
  .then((val) => {
    var similarArray = getIntersection(val[0], val[1], val[2].id);
    updateExaminedText(val[2]);
    updateTable('similarTable', similarArray);
  })
  .catch((err) => {
    alert(err)
  });
}

function processTypeSearch(type) {
  api.searchProductByType(type)
    .then((val) => {
      let similarArray = val;
      updateTable('similarTable', similarArray);
    })
    .catch((err) => {
      alert(err);
    });
}

function processPriceSearch(price) {
  api.searchProductByPrice(price, 50)
    .then((val) => {
      let similarArray = val;
      updateTable('similarTable', similarArray);
    })
    .catch((err) => {
      alert(err);
    });
}

function getIntersection(arrA, arrB, searchedId) {
  var samePrice = arrA;
  var sameType = arrB;
  var similarArray = [];
  samePrice.forEach((obj1) => {
    sameType.forEach((obj2) => {
      if(obj1.id === obj2.id && obj1.id != searchedId) similarArray.push(obj1);
    });
  });

  return similarArray;
}

function updateExaminedText(product) {
  var outputString = "Product ID : " + product.id;
  outputString += "<br> Price : " + product.price;
  outputString += "<br> Typr : " + product.type;
  document.getElementById("productText").innerHTML = outputString;
}

function updateTable(tableId, productArray) {
  var countText = document.getElementById('count');
  var tableBody = document.getElementById(tableId);
  while (tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.firstChild);
  }
  // create table header
  createTableHeader(tableId);
  // populate table rows
  for (i = 0; i < productArray.length; i++) {
    var tr = document.createElement('TR');
    var td1 = document.createElement('TD');
    var td2 = document.createElement('TD');
    var td3 = document.createElement('TD');
    var td4 = document.createElement('button');

    td4.addEventListener('click', function(e) {
      e.preventDefault();
      processSearch(this.parentNode.firstChild.innerHTML);
    });

    td1.appendChild(document.createTextNode(productArray[i].id));
    td2.appendChild(document.createTextNode(productArray[i].type));
    td3.appendChild(document.createTextNode(productArray[i].price));
    td4.appendChild(document.createTextNode("Examine"));
    
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    tableBody.appendChild(tr);
  }

  (productArray.length !== api.catalog.length) 
    ? countText.innerHTML = "Search result : " + productArray.length 
    : countText.innerHTML = "";

}

function createTableHeader(tableId) {
  var tableHeaderRow = document.createElement('TR');
  var th1 = document.createElement('TH');
  var th2 = document.createElement('TH');
  var th3 = document.createElement('TH');
  var th4 = document.createElement('TH');
  th1.appendChild(document.createTextNode("Product ID"));
  th2.appendChild(document.createTextNode("Type"));
  th3.appendChild(document.createTextNode("Price"));
  th4.appendChild(document.createTextNode("Examine"));
  tableHeaderRow.appendChild(th1);
  tableHeaderRow.appendChild(th2);
  tableHeaderRow.appendChild(th3);
  tableHeaderRow.appendChild(th4);
  document.getElementById(tableId).appendChild(tableHeaderRow);
}

api.searchAllProducts().then((value) => {
  updateTable('allTable', value);
  document.getElementById('allCount').innerHTML = "All Products : " + value.length;
});


