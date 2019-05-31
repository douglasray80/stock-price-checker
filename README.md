## **FreeCodeCamp**- Information Security and Quality Assurance

Project Stock Price Checker

1. SET NODE_ENV to `test` without quotes and set DB to your mongo connection string
2. Complete the project in `routes/api.js` or by creating a handler/controller
3. You will add any security features to `server.js`
4. You will create all of the functional tests in `tests/2_functional-tests.js`

## User Stories

<li>Set the content security policies to only allow loading of scripts and css from your server.</li>
<li>I can <b>GET</b> <code>/api/stock-prices</code> with form data containing a Nasdaq <i>stock</i> ticker and recieve back an object <i>stockData</i>.</li>
<li>In <i>stockData</i>, I can see the <i>stock</i>(string, the ticker), <i>price</i>(decimal in string format), and <i>likes</i>(int).</li>
<li>I can also pass along field <i>like</i> as <b>true</b>(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.</li>
<li>If I pass along 2 stocks, the return object will be an array with both stock's info but instead of <i>likes</i>, it will display <i>rel_likes</i>(the difference between the likes on both) on both.</li>
<li>A good way to receive current price is the following external API(replacing 'GOOG' with your stock): <code>https://api.iextrading.com/1.0/stock/GOOG/price</code></li>
<li>All 5 functional tests are complete and passing.</li>

### Example usage:

<code>/api/stock-prices?stock=goog</code><br>
<code>/api/stock-prices?stock=goog&amp;like=true</code><br>
<code>/api/stock-prices?stock=goog&amp;stock=msft</code><br>
<code>/api/stock-prices?stock=goog&amp;stock=msft&amp;like=true</code><br>

### Example return:

<code>{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}</code><br>
<code>{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}</code>
