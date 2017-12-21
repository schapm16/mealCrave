$(function() {
  /* global $ */

  // Sends text search terms to server upon click of search button
  $('#search').click(function() {
    $.ajax({
      method: 'GET',
      traditional: true,
      url: '', //Add route
      data: { searchTerm: $('#searchTerm').val().trim() }
    });
  });
  
  // >>> The following is for the Login Modal <<<
  // Opens modal upon click of login link
  $('#login').click(function() {
    $('#loginModal').addClass('is-active');
  });

  // Closes login modal upon click of 'X'
  $('#closeLoginModal').click(function() {
    $('#loginModal').removeClass('is-active');
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
  
});
