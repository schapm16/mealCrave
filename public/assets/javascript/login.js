// >>> Start Function Declarations <<<
// Updates page with profile link once user is logged in
function loggedIn() {


}

function joinInputValidation(userName, passwordOne, passwordTwo) {

  if (passwordOne !== passwordTwo) {
    $("#joinError").html("<p>Passwords Do Not Match</p>");
  }
  else {

    $.ajax({
      method: 'POST',
      traditional: true,
      url: "/join",
      data: { userName: userName, password: passwordOne }
    }).done(function(response) {
      // Login user once new account is verified
      loggedIn(userName, passwordOne);
    });
  }
}

// >>> End Function Declarataions <<<



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
  $('#login').click(function() {
    $('#loginModal').addClass('is-active');
  });

  // Closes login modal upon click of 'X'
  $('#closeLoginModal').click(function() {
    $('#loginModal').removeClass('is-active');
  });

  // Takes user login information and sends to server for confirmation
  $('#loginButton').click(function() {
    var userName = $('#loginUsername').val().trim();
    var password = $('#loginPassword').val().trim();

    $.ajax({
      method: 'GET',
      traditional: true,
      url: '/login', //This is a pending route, confirm with backend team
      data: { userName: userName, password: password }
    }).done(function(response) {
      // How is backend going to respond?
    });
  });
  // >>> End Login Modal <<<


  // >>> The following is for the Join Modal <<<
  // Opens modal upon click of Join link
  $('#join').click(function() {
    $('#joinModal').addClass('is-active');
  });

  // Closes login modal upon click of 'X'
  $('#closeJoinModal').click(function() {
    $('#joinModal').removeClass('is-active');
  });

  $('#joinButton').click(function() {
    var userName = $('#joinUsername').val().trim();
    var passwordOne = $('#joinPasswordOne').val().trim();
    var passwordTwo = $('#joinPasswordTwo').val().trim();

    joinInputValidation(userName, passwordOne, passwordTwo);
  });
  // >>> End Join Modal <<<  


});
