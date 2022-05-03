// JavaScript for IndexedDB
const myDBName = 'theDataBase';
var myDB; // myDB: IDBDatabase; initialized by initDB()
const serial = 2518; // must be an integer from the random generation.
// create the json object and initiate it
// 1 json obj :
/*
{"firstName":"John", "lastName":"Doe"}
*/
let menu =
[
{
    "category": "snacks",
    "accesses": 42,
    "details": [
         {
              "item": "olive hash",
              "description": "mashed olives in gravy",
              "price": 2.50
         },
         {
              "item": "smarties",
              "description": "small savory bites",
              "price": 1.50
         },
         {
              "item": "clumpers",
              "description": "chocolate-covered raisins",
              "price": 1.50
         }
    ]},
    {
    "category": "drinks",
    "accesses": 0,
    "details": [
         {
              "item": "smoothie ",
              "description": "peach and from flavored",
              "price": 5.54
         },
         {
              "item": "milk",
              "description": "fresh from our cow",
              "price": 2.50
         },
         {
              "item": "water",
              "description": "guaranteed mostly pure",
              "price": 0.50
         }
    ]
    },
    {
    "category": "mains",
    "accesses": 1,
    "details": [
         {
              "item": "steak",
              "description": "primal rib",
              "price": 20.50
         },
         {
              "item": "fish",
              "description": "whatever we found at the market",
              "price": 25.00
         },
         {
              "item": "mac-n-cheese",
              "description": "always a winner!",
              "price": 15.00
         }
    ]},
{
    "category": "deserts",
    "accesses": 3,
    "details": [
         {
              "item": "ice cream",
              "description": "durian or avocado",
              "price": 5.00
         },
         {
              "item": "shaved ice",
              "description": "durian or avocado",
              "price": 3.20
         },
         {
              "item": "cake",
              "description": "dark forest",
              "price": 4.00
         }
    ]},
{
    "category": "for kids",
    "accesses": 4,
    "details": [
         {
              "item": "mac-n-cheese",
              "description": "always a winner!",
              "price": 5.00
         },
         {
              "item": "small fry",
              "description": "most likely some fish",
              "price": 5.00
         },
         
    ]},
    {
    "category": "for pets",
    "accesses": 12,
    "details": [
        
         
    ]},
{
    "category": "take out",
    "accesses": 5,
    "details": [
         {
              "item": "empty box",
              "description": "recyclable",
              "price": 0.30
         },
         {
              "item": "pizza slice",
              "description": "vegan, white",
              "price": 1.00
         },
         {
              "item": "ice cream cone",
              "description": "durian or avocado",
              "price": 5.00
         }
    ]},
{
    "category": "inedible",
    "accesses": 7,
    "details": [
         {
              "item": "beer stein",
              "description": "glass",
              "price": 3.00
         },
         {
              "item": "can holder",
              "description": "rubbler",
              "price": 2.00
         },
         {
              "item": "napkins",
              "description": "50, recycled",
              "price": 1.00
         }
    ]},
{
    "category": "poisonous",
    "accesses": 10,
    "details": [
         {
              "item": "table cleaner",
              "description": "bottled",
              "price": 10.50
         }
    ]}
]
initDB("aTable"); // start the DB, the name of the DB
function initDB(relation) { // relation: name of object store
	const request = window.indexedDB.open(myDBName, serial);
		// request: IDBOpenDBRequest
	request.onerror = function(event) {
		//alert('Error loading database: ' + request.error.message);
	}; // onerror
	request.onsuccess = function(event) {
		console.log('Success loading database.');
		myDB = event.target.result; // myDB: IDBDatabase
		myDB.onerror = function(event) {
			//alert('error: ' + event.target.error.message);
		}; // generic onerror
        addAllEntries("aTable", menu); // why did i comment out? fix???
	}; // onsuccess
	request.onupgradeneeded = function(event) {
		console.log('Creating database.');
		myDB = this.result;
		myDB.onerror = function(event) {
			//alert('error: ' + event.target.error.message);
		};
		const table =
			myDB.createObjectStore(relation, {keyPath: "category"});
		// the "projects" table
		table.createIndex("accesses", "accesses", { unique: false });
		table.createIndex("details", "details", { unique: false });
	}; // onupgradeneeded
    // fix btns to displays row from indexedDB 
    // get the row that the btn is requesting the snacks. ?? or the rows ?
    // only use read only
	return('initialized');
}; // initDB
// and pop it with the json
function addEntry(relation, entry) { // entry: JSON object, with key field
	const table = myDB.transaction([relation], "readwrite").
		objectStore(relation); // table: IDBObjectStore 
	const request = table.add(entry);
	request.onsuccess = function() {
		console.log('successfully added entry');
	}; // onsuccess
}; // addEntry
function addAllEntries(relation, allEntries) { 
	// allEntries: array of JSON entries
	allEntries.forEach(function(elt) {
		addEntry(relation, elt);
	});
}; // addAllEntries
function displayTable(relation) {
	const table = myDB.transaction( [relation], "readonly").
		objectStore(relation); // table: IDBObjectStore 
	$("#result").html(''); // clear
	table.openCursor().onsuccess = function(event) {
		const cursor = event.target.result;
		if (cursor) { // not at end of table
			displayRow(cursor.value);
			cursor.continue(); // re-invokes onsuccess
		} else { // end
			console.log('end of display for table ' + relation);
		}
	}; // openCursor
}; // displayTable retrieve the the accesses from the json Obj. DB, then use put