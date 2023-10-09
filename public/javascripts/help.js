// Compile the template
var source = document.getElementById("my-template").innerHTML;
var template = Handlebars.compile(source);

// Data object with the value of 'someNumber'
var data = {
    someNumber: 4// Change this value to test different cases
};

// Render the template with the data
var result = template(data);

// Insert the result into the HTML
document.body.innerHTML += result;
