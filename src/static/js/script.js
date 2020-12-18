/*config = {
    locateFile: filename => 'js/sql-wasm.wasm'
  }
  // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
  // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.

  //https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.4.0/dist/sql-wasm.wasm

  initSqlJs(config).then(function(SQL){
    //Create the database
    var db = new SQL.Database();
    // Run a query without reading the results
    db.run("CREATE TABLE test (col1, col2);");
    // Insert two rows: (1,111) and (2,222)
    db.run("INSERT INTO test VALUES (?,?), (?,?)", [1,111,2,222]);

    // Prepare a statement
    var stmt = db.prepare("SELECT * FROM test WHERE col1 BETWEEN $start AND $end");
    stmt.getAsObject({$start:1, $end:1}); // {col1:1, col2:111}

    // Bind new values
    stmt.bind({$start:1, $end:2});
    while(stmt.step()) { //
      var row = stmt.getAsObject();
      console.log('Here is a row: ' + JSON.stringify(row));
    }
  });

  */


 var outputElm = document.getElementById('output');
 var errorElm = document.getElementById('error');
 var execBtn = document.getElementById("execute");
 var commandsElm = document.getElementById('commands');
 var savedbElm = document.getElementById('savedb');
 var loadCRUDElm = document.getElementById('loadcrud');
 var selectBtn = document.getElementById('select-btn');
 var updateBtn = document.getElementById('update-btn');
 var deleteBtn = document.getElementById('delete-btn');
 var createBtn = document.getElementById('create-btn');
 var triggerBtn = document.getElementById('trigger-btn');
 var indexBtn = document.getElementById('index-btn');
 var dbFileElm = document.getElementById('dbfile');


 // Start the worker in which sql.js will run
 var worker = new Worker('js/worker.sql-wasm.js');
 worker.onerror = error;
// Open a database
worker.postMessage({ action: 'open' });

// Connect to the HTML element we 'print' to
function print(text) {
	outputElm.innerHTML = text.replace(/\n/g, '<br>');
}



function error(e) {
	console.log(e);
    errorElm.style.height = '2em';
    errorElm.style.color = 'red';

    
	errorElm.textContent = e.message;
}

function noerror() {
	errorElm.style.height = '0';
}

// Run a command in the database
function execute(commands) {
	tic();
	worker.onmessage = function (event) {
		var results = event.data.results;
		toc("Ejecutando SQL");
		if (!results) {
			error({message: event.data.error});
			return;
		}

		tic();
		outputElm.innerHTML = "";
		for (var i = 0; i < results.length; i++) {
			outputElm.appendChild(tableCreate(results[i].columns, results[i].values));
		}
		toc("Mostrando resultados");
	}
	worker.postMessage({ action: 'exec', sql: commands });
	outputElm.textContent = "Resolviendo la consulta...";
}

// Create an HTML table
var tableCreate = function () {
	function valconcat(vals, tagName) {
		if (vals.length === 0) return '';
		var open = '<' + tagName + '>', close = '</' + tagName + '>';
		return open + vals.join(close + open) + close;
	}
	return function (columns, values) {
        var tbl = document.createElement('table');
        tbl.classList.add("table");
        tbl.classList.add("table-striped");
        tbl.classList.add("table-dark");
		var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
		var rows = values.map(function (v) { return valconcat(v, 'td'); });
		html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
		tbl.innerHTML = html;
		return tbl;
	}
}();

function noerror() {
	errorElm.style.height = '0';
}


// Execute the commands when the button is clicked
function execEditorContents() {
	noerror()
	execute(editor.getValue() + ';');
}
execBtn.addEventListener("click", execEditorContents, true);

// Add syntax highlighting to the textarea
var editor = CodeMirror.fromTextArea(commandsElm, {
	mode: 'text/x-mysql',
	viewportMargin: Infinity,
	indentWithTabs: true,
	smartIndent: true,
	lineNumbers: true,
	matchBrackets: true,
	autofocus: true,
	extraKeys: {
		"Ctrl-Enter": execEditorContents,
		"Ctrl-S": savedb,
	}
});

 //load CRUD template

 function loadCRUD(){
   var doc = editor.getDoc();
   //doc.replaceSelection('holaa');
   editor.setValue(`    DROP TABLE IF EXISTS employees;
    CREATE TABLE empleados( id integer,  nombre text,
                            designacion text, manager integer,
                            fecha_contratacion  date, salario  integer,
                            comision  float,  depto integer);
   
    INSERT INTO empleados VALUES (1,'JOHNSON','ADMIN',6,'1990-12-17',18000,NULL,4);
    INSERT INTO empleados VALUES (2,'HARDING','MANAGER',9,'1998-02-02',52000,300,3);
    INSERT INTO empleados VALUES (3,'TAFT','SALES I',2,'1996-01-02',25000,500,3);
    INSERT INTO empleados VALUES (4,'HOOVER','SALES I',2,'1990-04-02',27000,NULL,3);
    INSERT INTO empleados VALUES (5,'LINCOLN','TECH',6,'1994-06-23',22500,1400,4);
    INSERT INTO empleados VALUES (6,'GARFIELD','MANAGER',9,'1993-05-01',54000,NULL,4);
    INSERT INTO empleados VALUES (7,'POLK','TECH',6,'1997-09-22',25000,NULL,4);
    INSERT INTO empleados VALUES (8,'GRANT','ENGINEER',10,'1997-03-30',32000,NULL,2);
    INSERT INTO empleados VALUES (9,'JACKSON','CEO',NULL,'1990-01-01',75000,NULL,4);
    INSERT INTO empleados VALUES (10,'FILLMORE','MANAGER',9,'1994-08-09',56000,NULL,2);
    INSERT INTO empleados VALUES (11,'ADAMS','ENGINEER',10,'1996-03-15',34000,NULL,2);
    INSERT INTO empleados VALUES (12,'WASHINGTON','ADMIN',6,'1998-04-16',18000,NULL,4);
    INSERT INTO empleados VALUES (13,'MONROE','ENGINEER',10,'2000-12-03',30000,NULL,2);
    INSERT INTO empleados VALUES (14,'ROOSEVELT','CPA',9,'1995-10-12',35000,NULL,1);
   
    SELECT designacion,COUNT(*) AS nbr, (AVG(salario)) AS promedio_salario FROM empleados GROUP BY designacion ORDER BY promedio_salario DESC;
    SELECT nombre ,fecha_contratacion FROM empleados ORDER BY fecha_contratacion;`);
}

loadCRUDElm.addEventListener("click", loadCRUD, true);


//load CREATE TABLE template example

function createExampleAppend(){
    var doc = editor.getDoc();
    editor.setValue(`-- Ejemplo de sentencia CREATE de la documentación oficial de sqlite (https://www.sqlitetutorial.net/sqlite-create-table/)

    CREATE TABLE [IF NOT EXISTS] [schema_name].table_name (
    column_1 data_type PRIMARY KEY,
    column_2 data_type NOT NULL,
    column_3 data_type DEFAULT 0,
    table_constraints) [WITHOUT ROWID];`);
 }
 
 createBtn.addEventListener("click", createExampleAppend, true);

 //load CREATE TABLE template example

function selectExampleAppend(){
    var doc = editor.getDoc();
    editor.setValue(`-- Ejemplo de sentencia SELECT de la documentación oficial de sqlite (https://www.sqlitetutorial.net/sqlite-select/)

    SELECT DISTINCT column_list
    FROM table_list
    JOIN table ON join_condition
    WHERE row_filter
    ORDER BY column
    LIMIT count OFFSET offset
    GROUP BY column
    HAVING group_filter;`);
 }
 
 selectBtn.addEventListener("click", selectExampleAppend, true);

 //load UPDATE TABLE template example

function updateExampleAppend(){
    var doc = editor.getDoc();
    editor.setValue(`-- Ejemplo de sentencia UPDATE de la documentación oficial de sqlite (https://www.sqlitetutorial.net/sqlite-update/)

    UPDATE table
    SET column_1 = new_value_1,
        column_2 = new_value_2
    WHERE
        search_condition 
    ORDER column_or_expression
    LIMIT row_count OFFSET offset;`);
 }
 
 updateBtn.addEventListener("click", updateExampleAppend, true);


  //load DELETE template example

function deleteExampleAppend(){
    var doc = editor.getDoc();
    editor.setValue(`-- Ejemplo de sentencia DELETE de la documentación oficial de sqlite (https://www.sqlitetutorial.net/sqlite-delete/)

    DELETE FROM table
    WHERE search_condition
    ORDER BY criteria
    LIMIT row_count OFFSET offset;`);
 }
 
 deleteBtn.addEventListener("click", deleteExampleAppend, true);
 

  //load TRIGGER template example

  function triggerExampleAppend(){
    var doc = editor.getDoc();
    editor.setValue(`-- Ejemplo de sentencia CREATE TRIGGER de la documentación oficial de sqlite (https://www.sqlitetutorial.net/sqlite-trigger/)

    CREATE TRIGGER [IF NOT EXISTS] trigger_name 
      [BEFORE|AFTER|INSTEAD OF] [INSERT|UPDATE|DELETE] 
       ON table_name
       [WHEN condition]
    BEGIN
        statements;
    END;`);
 }
 
 triggerBtn.addEventListener("click", triggerExampleAppend, true);
 
  //load CREATE INDEX template example

  function createIndexExampleAppend(){
    var doc = editor.getDoc();
    editor.setValue(`-- Ejemplo de sentencia CREATE INDEX de la documentación oficial de sqlite (https://www.sqlitetutorial.net/sqlite-index/)

    CREATE [UNIQUE] INDEX index_name 
    ON table_name(column_list);`);
 }
 
 indexBtn.addEventListener("click", createIndexExampleAppend, true);
 

// Save the db to a file
function savedb() {
	worker.onmessage = function (event) {
		toc("Exportando la base de datos");
		var arraybuff = event.data.buffer;
		var blob = new Blob([arraybuff]);
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.href = window.URL.createObjectURL(blob);
		a.download = "sql.db";
		a.onclick = function () {
			setTimeout(function () {
				window.URL.revokeObjectURL(a.href);
			}, 1500);
		};
		a.click();
	};
	tic();
	worker.postMessage({ action: 'export' });
}

savedbElm.addEventListener("click", savedb, true);


// Performance measurement functions
var tictime;
if (!window.performance || !performance.now) { window.performance = { now: Date.now } }
function tic() { tictime = performance.now() }
function toc(msg) {
    var dt = performance.now() - tictime;
    var mensaje = (msg || 'toc') + " - La consulta tomó " + dt + "ms";
    console.log(mensaje);
    errorElm.style.height = '2em';
    errorElm.style.color = 'green';

    
	errorElm.textContent = mensaje;
}


// Load a db from a file
dbFileElm.onchange = function () {
	var f = dbFileElm.files[0];
	var r = new FileReader();
	r.onload = function () {
		worker.onmessage = function () {
			toc("Loading database from file");
			// Show the schema of the loaded database
			editor.setValue("SELECT `name`, `sql`\n  FROM `sqlite_master`\n  WHERE type='table';");
			execEditorContents();
		};
		tic();
		try {
			worker.postMessage({ action: 'open', buffer: r.result }, [r.result]);
		}
		catch (exception) {
			worker.postMessage({ action: 'open', buffer: r.result });
		}
	}
    r.readAsArrayBuffer(f);
}
