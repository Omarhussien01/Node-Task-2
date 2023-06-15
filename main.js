//getting the rate to change price
const getCurrency = async () => {
    let response = await fetch("https://openexchangerates.org/api/latest.json?app_id=5aa51839755f4fe5b359401788242dd2");
    let currency =await response.json();
    console.log(currency.rates.EGP)
    return currency.rates.EGP;
}
//getCurrency();
//fetching all prodcust 

async function getProducts() {
  return fetch("https://api.escuelajs.co/api/v1/products").then((response) => response.json());
}



async function getData(){
    console.log( await getProducts());
}
//getData();
// Maaping the original response to get the transormed api structure
function categorize(products) {
    return Object.values(
      products.reduce((categories, product) => {
        if (!categories[product.category.id]) {
          categories[product.category.id] = {
            category: { id: product.category.id, name: product.category.name },
            products: [],
          };
        }
        categories[product.category.id].products.push(product);
        return categories;
      }, {})
    );
  }

  //Mapping on all data to change the price
  async function transformProductsPrice(categories) {
    const egpRate = await getCurrency();
    return categories.map((category) => ({
      ...category,
      products: category.products.map((product) => ({
        ...product,
        price: (product.price * egpRate).toFixed(1),
      })),
    }));
  }

  getProducts()
  .then(categorize)
  .then(transformProductsPrice)
  .then((data) => console.log(JSON.stringify(data,null,3)));
