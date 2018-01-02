//The "no results available" message will default to hidden
$("#noResults").hide();

//When the user clicks the submit button
$("#searchSubmit").on("click", function() {
    //Save the search input as "keyword"
    var keyword = $("#searchInput").val().trim();
    //Request the database items associated with the keyword(s)
    $.ajax({
        url: "/search/byKeyword/" + keyword,
        method: "GET"
    }).done(function(err, res) {
        //Once the request is complete, reload the page
        location.assign(keyword);
    });
});

//When a user clicks on a meal picture
$(".mealImages").on("click", function() {
    //Assign the modal features with the correct data from the image
    $("#modalImage").attr("src", $(this).attr("src"));
    $("#modalMealName").html($(this).data("name"));
    $("#modalRestName").html($(this).data("rest"));
    $("#modalRestName").attr("data-info", $(this).data("restid"));
    $("#modalPrice").html($(this).data("price"));
    //Launch the modal
    $(".modal").addClass("is-clipped is-active");
});

//If the user clicks on the modal background, the modal will disappear
$(".modal-background").on("click", function() {
    $(".modal").removeClass("is-clipped is-active");
});

//If the user clicks on the modal close button, the modal will disappear
$(".modal-close").on("click", function() {
    $(".modal").removeClass("is-clipped is-active");
});

//When the user clicks on the name of the restaurant in the modal
$("#modalRestName").on("click", function() { //this will need to be changed to the restaurant name once we have included the location table
    //assign the restaurant address to the "restaurant" variable
    var restaurant = $(this).attr("data-info"); //this will be the name of the restaurant gotten from the span we click on 
    //Request the map page with the route highlighted from the user's current loation to the restaurand location
    console.log(restaurant);
    $.ajax({
        url: "/map/" + restaurant, //change this to the address we get from the data id in the span (or we could get the address from the id?? writing the address directly in may be easier but i don't know if it will make the app too slow??)
        method: "GET",
    }).done(function(err, res) {
        //once the call is complete, load the map page
        location.assign("/map/" + restaurant);
    });
});

$("#homeLink").on("click", function() {
    $.ajax({
        url: "/",
        method: "GET",
    }).done(function(err, res) {
        location.assign("/");
    });
});

//If there are no search results, show the "noResults" message
if ($('.mealPics').children().length == 0) {
    $("#noResults").show();
}
