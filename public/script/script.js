//const api_url = "<heroku_app_url>"
const mongoose = require("mongoose");
const api_url = "mongodb://localhost:27017/test"

function loadData(records = []) {
	var table_data = "";
	for(let i=0; i<records.length; i++) {
		table_data += `<tr>`;
		table_data += `<td>${records[i].industry}</td>`;
		table_data += `<td>${records[i].jobtype}</td>`;
		table_data += `<td>${records[i].jobfield}</td>`;
        table_data += `<td>${records[i].jobdescrip}</td>`;
		table_data += `<td>${records[i].highqualification}</td>`;
		table_data += `<td>${records[i].salary}</td>`;
        table_data += `<td>${records[i].jobcontact}</td>`;
		table_data += `<td>`;
	}
	//console.log(table_data);
	document.getElementById("tbody").innerHTML = table_data;
}

function getData() {
	fetch(api_url)
	.then((response) => response.json())
	.then((data) => { 
		console.table(data); 
		loadData(data);
	});
}


function getDataById(id) {
	fetch(`${api_url}/${id}`)
	.then((response) => response.json())
	.then((data) => { 
	
		console.log(data);
		document.getElementById("id").value = data._id;
		document.getElementById("name").value = data.name;
		document.getElementById("age").value = data.age;
		document.getElementById("city").value = data.city;
	})
}


function postData() {
	var name = document.getElementById("name").value;
	var age = document.getElementById("age").value;
	var city = document.getElementById("city").value;
	
	data = {name: name, age: age, city: city};
	
	fetch(api_url, {
		method: "POST",
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then((response) => response.json())
	.then((data) => { 
		console.log(data); 
		window.location.href = "index.html";
	})
}	


function putData() {
	
	var _id = document.getElementById("id").value;
	var name = document.getElementById("name").value;
	var age = document.getElementById("age").value;
	var city = document.getElementById("city").value;
	
	data = {_id: _id, name: name, age: age, city: city};
	
	fetch(api_url, {
		method: "PUT",
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then((response) => response.json())
	.then((data) => { 
		console.table(data);
		window.location.href = "index.html";
	})
}


function deleteData(id) {
	user_input = confirm("Are you sure you want to delete this record?");
	if(user_input) {
		fetch(api_url, {
			method: "DELETE",
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({"_id": id})
		})
		.then((response) => response.json())
		.then((data) => { 
			console.log(data); 
			window.location.reload();
		})
	}
}