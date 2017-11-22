(function(window) {

  function myLibrary() {
    // execute code here

    var catalog = createRandomCatalog(1000);

    return {
      catalog: catalog,
      searchProductById: searchProductById,
      searchProductByPrice: searchProductByPrice,
      searchProductByType: searchProductByType,
      searchAllProducts: searchAllProducts
    }

    function searchProductByPrice(price, difference) {
      var promise = new Promise((resolve, reject) => {
        let i = 0;
        let count = 0;
        let priceArray = [];
        if(!isFinite(price)) {
          reject("Invalid price : " + price);
        }else{
          setTimeout(() => {
            while (i < catalog.length) {
              if (Math.abs(catalog[i].price - price) < difference) {
                priceArray.push({ id: catalog[i].id, price: catalog[i].price, type: catalog[i].type });
              }
              i++;
            }
            resolve(priceArray);
          }, 0);
        }
      });

      return promise;
    }

    function searchProductByType(type) {
      var promise = new Promise((resolve, reject) => {
        let i = 0;
        let count = 0;
        let typeArray = [];
        let possibleTypes = ['Electronics', 'Book', 'Clothing', 'Food'];
        if(!possibleTypes.includes(type)) {
          reject("Invalid Type : " + type);
        }else{
          setTimeout(() => {
            while (i < catalog.length) {
              if(catalog[i].type === type) {
                typeArray.push({id:catalog[i].id, price: catalog[i].price, type: catalog[i].type });
              }
              i++;
            }
            resolve(typeArray);
          }, 100);
        }
      });
      
      return promise;
    }

    function searchProductById(id) {
      var promise = new Promise((resolve, reject) => {
        let i = 0;
        setTimeout(() => {
          while(i < catalog.length) {
            if(catalog[i].id == id) {
              resolve({ id: id, price: catalog[i].price, type: catalog[i].type });
            }
            i++;
          }
          reject("Invalid ID : " + id);
        }, 100);
      });

      return promise;
    }

    function searchAllProducts() {
      var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(catalog);
        }, 100);
      });

      return promise;
    }

    function createRandomProduct() {
      var typeArray = ['Electronics', 'Book', 'Clothing', 'Food'];
      var price = (Math.random()*500).toFixed(2);
      var type = typeArray[Math.floor(Math.random()*4)];

      return {price: price, type: type};
    }

    function createRandomCatalog(num) {
      var catalog = [];
      for (var i = 0; i < num; i++) {
        var obj = createRandomProduct();
        catalog.push({id: i,price: obj.price, type: obj.type});
      }
      return catalog;
    }

  }

  
  if(typeof(window.api) === 'undefined') {
    window.api = myLibrary();
  }

})(window);