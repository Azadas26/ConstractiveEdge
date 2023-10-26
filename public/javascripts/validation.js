$(document).ready(() => {
  $("#order").validate({
    rules: {
      ph: {
        required: true,
        minlength: 10,
        maxlength: 10,
      },
      pin: {
        required: true,
        minlength: 6,
        maxlength: 6,
      },
    },
  });
  // Add a custom validation method for the name field
  $.validator.addMethod(
    "startsWithLetter",
    function (value, element) {
      return this.optional(element) || /^[A-Za-z]/.test(value);
    },
    "Name must start with a letter."
  );

  // Initialize the validation for your form
  $("#usersignupform").validate({
    rules: {
      name: {
        required: true,
        startsWithLetter: true, // Use the custom validation method
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
      ph: {
        required: true,
        minlength: 10,
        maxlength: 10,
      },
      address: {
        required: true,
      },
    },
  });
  $("#wksignupform").validate({
    rules: {
      name: {
        required: true,
        startsWithLetter: true, // Use the custom validation method
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
      ph: {
        required: true,
        minlength: 10,
        maxlength: 10,
      },
      image: {
        required: true,
      },
    },
  });
});
