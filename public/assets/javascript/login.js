// >>> Start Function Declarations <<<
// Updates page with profile link once user is logged in
function loggedIn(userName) {
  $('.hero-head').html(
    '<a id="logout" class="has-text-light is-pulled-right">Logout</a>' +
    '<span class="has-text-light is-pulled-right">  |  </span>' +
    '<a id="profile" class="has-text-light is-pulled-right">Your Profile</a>' +
    '<span class="has-text-light is-pulled-right">Welcome, ' + userName + '.   </span>'
  );

}

function loginValidation(userName, password) {

  if (userName === '' || password === '') {
    $('#loginError').html('<p>Please fill out all of the fields</p>');
  }
  else {
    $.ajax({
      method: 'GET',
      traditional: true,
      url: '/login',
      data: { userName: userName, password: password }
    }).done(function(response) {
      if (response.valid === true) {
        console.log('Login Successful');
        $('#loginModal').removeClass('is-active');
        loggedIn(userName); // Login user once userName and password are verified
      }
    });

    $('#loginModal').removeClass('is-active'); // For Testing.... Remove!
    loggedIn(userName);
  }
}

function joinValidation(userName, passwordOne, passwordTwo) {

  if (userName === '' || passwordOne === '' || passwordTwo === '') {
    $('#joinError').html('<p>Please fill out all of the fields</p>');
  }
  else if (passwordOne !== passwordTwo) {
    $('#joinError').html('<p>Passwords Do Not Match</p>');
  }
  else {

    $.ajax({
      method: 'POST',
      traditional: true,
      url: "/join",
      data: { userName: userName, password: passwordOne }
    }).done(function(response) {

      if (response.valid === false) {
        $("#joinError").html("<p>Username Already Existis</p>");
      }

      else {
        console.log('Join Succesful');
        $('#joinModal').removeClass('is-active');
        loggedIn(userName); // Login user once new account is verified
      }

    });
  }
}

// >>> End Function Declarataions <<<


// >>> Execution Begins Here <<<
$(function() {
  /* global $ */

  // Sends text search terms to server upon click of search button
  $('#search').click(function() {
    $.ajax({
      method: 'GET',
      traditional: true,
      url: '/search/' + $('#searchTerm').val().trim(),
    });
  });
  // >>> End Search Code <<<


  // >>> The following is for the Login Modal <<<
  // Opens modal upon click of login link
  $('#login').on("click", function() {
    $('#loginModal').addClass('is-active');
  });

  // Closes login modal and clears form fields upon click of 'X'
  $('#closeLoginModal').click(function() {
    $('#loginModal').removeClass('is-active');
    $('#loginUsername').val('');
    $('#loginPassword').val('');
  });

  // Takes user login information and sends to server for confirmation
  $('#loginButton').click(function() {
    var userName = $('#loginUsername').val().trim();
    var password = $('#loginPassword').val().trim();

    loginValidation(userName, password);
  });
  // >>> End Login Modal <<<


  // >>> The following is for the Join Modal <<<
  // Opens modal upon click of Join link
  $('#join').on("click", function() {
    $('#joinModal').addClass('is-active');
  });

  // Closes join modal and clears form fields upon click of 'X'
  $('#closeJoinModal').click(function() {
    $('#joinModal').removeClass('is-active');
    $('#joinUsername').val('');
    $('#joinPasswordOne').val('');
    $('#joinPasswordTwo').val('');
  });

  $('#joinButton').click(function() {
    var userName = $('#joinUsername').val().trim();
    var passwordOne = $('#joinPasswordOne').val().trim();
    var passwordTwo = $('#joinPasswordTwo').val().trim();

    joinValidation(userName, passwordOne, passwordTwo);
  });
  // >>> End Join Modal <<<  

  // >>> The following is for the "Your Profile | Logout" navigation links <<<
  $(document).on('click', '#profile', function() {
    console.log("profile pressed");
  });

  $(document).on('click', '#logout', function() {
    console.log("logout pressed");
    location.reload();
  });
  // >>> End "Your Profile | Logout" links <<<

});
