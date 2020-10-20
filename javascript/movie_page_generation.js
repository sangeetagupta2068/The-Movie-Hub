$(document).ready(function () {
    const url_params = new URLSearchParams(location.search);
    const movie_id = url_params.get('movie_id');

    var firebaseConfig = {
        apiKey: "AIzaSyDONcboIDL2HEwKDQ9cTaiev8Bdq1Bqvik",
        authDomain: "web-development-913e2.firebaseapp.com",
        databaseURL: "https://web-development-913e2.firebaseio.com",
        projectId: "web-development-913e2",
        storageBucket: "web-development-913e2.appspot.com",
        messagingSenderId: "383889759321",
        appId: "1:383889759321:web:1ec843cfc90118e468a548",
        measurementId: "G-K5SV5SQRK4"
    };
    // Initialize Firebase
    var app = firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore(app);

    $.ajax({
        url: `https://api.themoviedb.org/3/movie/${movie_id}?api_key=ce34cbe6a1ce756fd273d16fea7331ab&language=en-US`,
        success: function (result) {
            $('#release_label').text('Release Date:').css('color', '#ffc700');
            $('#release_date').append(`${result.release_date}`);
            $('#description_label').text('Overview:').css('color', '#ffc700');
            $('#description').append(`${result.overview}`);
            $('#title').text(`${result.title}`);
            $('#rating_label').text('Rating').css('color', '#ffc700');
            $('#rating').text(`${result.vote_average}`);
        }
    });

    $.ajax({
        url: `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=ce34cbe6a1ce756fd273d16fea7331ab&language=en-US`,
        success: function (result) {
            var movie = result["results"];
            var trailerUrl = "https://www.youtube.com/embed/" + movie[0].key;
            var iframe = `<iframe width="100%" height="600px" src='${trailerUrl}'></iframe>`
            $('#movie').append(iframe);
        }
    });

    db.collection('reviews').where('movie', "==", movie_id).orderBy('date', 'desc').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            var card = `<div class="card" id="reviews${doc.id}">
                                    <center>
                                        <p class="review_paragraph">\"${doc.data().review}\"</p>
                                        <p class="light" >Rating: ${doc.data().review_rating}</p>
                                        <p style="font-size: 15px;">${doc.data().date}</p>
                                        <h5 class="reviewer_name">-${doc.data().review_person_name}</h5>
                                    </center>
                                 </div>`;
            $('#reviews').append(card);
            console.log('I am here');
        });
    });

    //element styling
    $('textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    $('input[type="submit"]').mouseenter(function () {
        $(this).animate({
            height: '+=30px',
            width: '+=30px'
        })
    }).mouseleave(function () {
        $(this).animate({
            height: '-=30px',
            width: '-=30px'
        })
    });

    $('#review_form').hide();
    $('#write_review').mouseenter(function () {
        $('#review_form').slideDown('slow');
    });

    //adding event listener to form for submit
    document.getElementById('review_form').addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('123');

        var reviewerName = document.getElementById('reviewer_name').value;
        var reviewText = document.getElementById('review_area').value;
        var date = new Date().toLocaleString();
        console.log(reviewText);

        document.getElementById('reviewer_name').value = "";
        document.getElementById('review_area').value = "";

        var reviewRating = $;
        for (var count = 0; count < document.getElementsByName('rate').length; count++) {
            if (document.getElementsByName('rate')[count].checked) {
                reviewRating = document.getElementsByName('rate')[count].value;
            }
        }

        for (var count = 0; count < document.getElementsByName('rate').length; count++) {
            if (document.getElementsByName('rate')[count].checked) {
                document.getElementsByName('rate')[count].checked = false;
            }
        }
        db.collection('reviews').add({
            review_person_name: reviewerName,
            review: reviewText,
            review_rating: reviewRating,
            movie: movie_id,
            date: date,
        }).then(function () {
            var card = `<div class="card" id="card_${date}">
                                    <center>
                                        <p class="review_paragraph">\"${reviewText}\"</p>
                                        <p class="light">Rating:${reviewRating} </p>
                                        <p style="font-size: 15px;">${date}</p>
                                        <h5 class="reviewer_name">-${reviewerName}</h5>
                                    </center>
                                 </div>`;

            $('#reviews').prepend(card);
            $('#card_${date}').hide().fadeOut('slow')
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    });


});
