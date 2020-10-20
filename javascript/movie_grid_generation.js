$(document).ready(function () {
        const url_params = new URLSearchParams(location.search);
        const movie_sort_type= url_params.get('sort_type');
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${movie_sort_type}?api_key=ce34cbe6a1ce756fd273d16fea7331ab&language=en-US`,
            success: function (result) {
                var movies = result['results'];
                $.each(movies, function (index, value) {
                    var card = `<div class="card" id="posters${index}">
                                    <center>
                                    <a href="/Users/sangeetagupta/WebstormProjects/project_1/movie_page.html?movie_id=${value.id}"> 
                                    <img src='https://image.tmdb.org/t/p/w500/${value.poster_path}'>
                                    </a>
                                    <div class="container" id="card_description${index}">
                                        <h5>${value.title}</h5> 
                                        <p class="light">Rating: ${value.vote_average}</p> 
                                    </div> 
                                    </center>
                                 </div>`;
                    $('#poster_container').append(card)
                });
            }
        });

        $('.menu_item').hover(function () {
            $(this).css('background-color','#ffc700');
        }, function (){
            $(this).css('background-color','#ffffff');
        });
});