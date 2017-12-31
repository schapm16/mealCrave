/*global $*/
$(function() {
  $('#logout').click(function() {
    sessionStorage.clear();
    window.location.href='/';
  });
  
  // Form Controls
  $('#openCreateDishForm').click(function() {
    $('#initialButtons').css('display', 'none');
    $('#createDishForm').css('display', 'block');
  });
  
  $('#openSearchForm').click(function(){
    $('#initialButtons').css('display', 'none');
    $('#searchForm').css('display', 'block');
  });
  
  $('.userDishWrapper').click(function() {
    $('#initialButtons').css('display', 'none');
    $('#editDishForm').css('display', 'block');
  });

  $('.closeForm').click(function(){
    
    $('#createDishForm').css('display', 'none');
    $('#searchForm').css('display', 'none');
    $('#editDishForm').css('display', 'none');
    $('#initialButtons').css('display', 'block');
  });
  // End Form Controls
  
  
  // Get userName and Location on Page load
  $('#userName').val(sessionStorage.getItem('userName'));
  
  window.navigator.geolocation.getCurrentPosition(function(position){
    console.log('position attained');
    $('#locationCoordinates').val(position.coords.latitude + ' ' + position.coords.longitude);
    console.log($('#locationCoordinates').val());
  }, null, {enableHighAccuracy: true, maximumAge: 300000, timeOut: 5000});
  // End Get userName and Location on Page Load
  
  // Search by Keyword
  $('#search').click(function(){
    window.location.href="/search/byKeyword/" + $('#searchTerm').val().trim();
  });
  // End Search by Keyword
  
  
  

});
