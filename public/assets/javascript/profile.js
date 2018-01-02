/*global $*/


// Sets up Google Places autocomplete API
function placesSearch() {
  var createDishFormLocation = document.getElementById('createDishFormLocation');
  var editDishFormLocation = document.getElementById('editDishFormLocation');

  var createDishFormAutocomplete = new google.maps.places.Autocomplete(createDishFormLocation);
  var editDishFormAutocomplete = new google.maps.places.Autocomplete(editDishFormLocation);
}
//

// Populates the editDishForm and deleteDishForm based on the information included in the userDish that the User clicks on
function populateEditDishForms(dishClicked) {
  $('#editDishForm input[name="userName"]').val(sessionStorage.getItem('userName'));
  $('#editDishForm input[name="location"]').val($(dishClicked).find('.fullAddress').text());
  $('#editDishForm input[name="price"]').val($(dishClicked).find('.userDishPrice').text());
  $('#editDishForm input[name="menuName"]').val($(dishClicked).find('.userDishMenuName').text());
  $('#editDishForm input[name="foodId"]').val($(dishClicked).find('.userDishFoodId').text());
  if ($(dishClicked).find('.userDishGFree').text() === 'true') {
    $('#editDishForm input[name="gfree"]').prop('checked', 'true');
  }

  if ($(dishClicked).find('.userDishVeg').text() === 'true') {
    $('#editDishForm input[name="veg"]').prop('checked', 'true');
  }
  $('#deleteDishForm input[name="userName"]').val(sessionStorage.getItem('userName'));
  $('#deleteDishForm input[name="foodId"]').val($(dishClicked).find('.userDishFoodId').text());
}
//


// >>> Execution Begins Here <<<
$(function() {
  $("")
  // Logout
  $('#logout').click(function() {
    sessionStorage.clear();
    window.location.href = '/';
  });

  // Search, Create Dish and Edit Dish Form Controls
  $('#openCreateDishForm').click(function() {
    $('#initialButtons').css('display', 'none');
    $('#createDishForm').css('display', 'block');
  });

  $('#openSearchForm').click(function() {
    $('#initialButtons').css('display', 'none');
    $('#searchForm').css('display', 'block');
  });

  $('.userDishWrapper').click(function() {
    document.getElementById('editDishForm').reset();
    $('#initialButtons').css('display', 'none');
    $('#searchForm').css('display', 'none');
    $('#createDishForm').css('display', 'none');

    populateEditDishForms(this);

    $('#editDishForm').css('display', 'block');
  });

  $('.closeForm').click(function() { // Closes and Resets Forms

    document.getElementById('createDishForm').reset();
    document.getElementById('searchForm').reset();
    document.getElementById('editDishForm').reset();

    $('#createDishForm').css('display', 'none');
    $('#searchForm').css('display', 'none');
    $('#editDishForm').css('display', 'none');
    $('#initialButtons').css('display', 'block');
  });
  //

  // ---- This may not be needed ----
  // Get userName and Location on Page load
  $('#userName').val(sessionStorage.getItem('userName'));

  // window.navigator.geolocation.getCurrentPosition(function(position) {
  //   console.log('position attained');
  //   $('#locationCoordinates').val(position.coords.latitude + ' ' + position.coords.longitude);
  //   console.log($('#locationCoordinates').val());
  // }, null, { enableHighAccuracy: true, maximumAge: 300000, timeOut: 5000 });
  //


  // Dish Search by Keyword
  $('#search').click(function() {
    window.location.href = "/search/byKeyword/" + $('#searchTerm').val().trim();
  });

});
