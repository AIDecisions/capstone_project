$(document).ready(function() { 

    // Function to initialize Select2 for anime names using AJAX to fetch from JSON
    // https://select2.org/data-sources/ajax
    // https://makitweb.com/loading-data-remotely-in-select2-with-ajax/

    // var DataTable = require( 'datatables.net' );

    let currentAjaxRequest = null;  // Variable to store the current AJAX request
    let animeList = [];  // Variable to store the list of anime names
    // $('#data_table_container').DataTable();

    // let animeTable = new DataTable('#data_table_container', {
    //     columns: [
    //         { title: "Anime ID" },
    //         { title: "Anime Name" },
    //         { title: "Rating" },
    //         { title: "Members" },
    //         { title: "Distance" }
    //     ]
    // });

    // let animeTable = $('#data_table_container').DataTable({
    //     columns: [
    //         { title: "Anime ID" },
    //         // { title: "Anime Name" },
    //         // { title: "Rating" },
    //         // { title: "Members" },
    //         { title: "Distance" }
    //     ]
    // });

    // Function to initialize Select2 for anime names
    function initializeAnimeNameSelect() {
        $('#anime_name').select2({
            placeholder: "Type anime name",
            minimumInputLength: 1,  // Start searching after 1 character has been typed
            data: [{ id: '', text: '' }, ...animeList],  // Prepend an empty option to the list
            processResults: function (data, params) {
                const searchTerm = params.term.toLowerCase();
    
                return {
                    results: data
                };
            },
            sorter: function (data) {
                const searchTerm = $('.select2-search__field').val().toLowerCase();  // Get search input
    
                // Separate results into those that start with the search term and those that contain it
                const startsWith = data.filter(function(anime) {
                    return anime.text.toLowerCase().startsWith(searchTerm);
                });
    
                const contains = data.filter(function(anime) {
                    return anime.text.toLowerCase().includes(searchTerm) &&
                           !anime.text.toLowerCase().startsWith(searchTerm);
                });
    
                // Combine 'starts with' and 'contains', prioritizing 'starts with'
                return [...startsWith, ...contains];
            },
            allowClear: true
        });
    } 

    // Function to initialize Select2 for genres and types
    function initializeMultiSelect() {
        $('.select2').select2({
            placeholder: "Select options",
            allowClear: true
        });
    }

   // Function to populate the HTML table
   function populateTable(predictions) {
        const tableBody = $('#data_table_container tbody');
        tableBody.empty(); // Clear the previous content

        // Loop through the predictions and create table rows
        predictions.forEach(prediction => {
            const row = `<tr>
                            <td>${prediction.anime_id}</td>
                            <td>${prediction.name}</td>
                            <td>${prediction.rating}</td>
                            <td>${prediction.members}</td>
                            <td>${prediction.distances}</td>
                        </tr>`;
            tableBody.append(row); // Add the row to the table body
        });
    }

    // Function to populate the table with the prediction results
    // function populateTable(predictions) {
    //     // Clear previous data
    //     $('#data_table_container').DataTable().clear().destroy();

    //     // Build the table
    //     let table = d3.select("#data_table_container");
    //     let tbody = table.select("tbody");
    //     tbody.html("");

    //     // Append a row for each anime
    //     for (let i = 0; i < predictions.length; i++) {
    //         let row = tbody.append("tr");
    //         row.append("td").text(predictions[i].anime_id);
    //         row.append("td").text(predictions[i].name);
    //         row.append("td").text(predictions[i].rating);
    //         row.append("td").text(predictions[i].members);
    //         row.append("td").text(predictions[i].distance.toFixed(3));
    //     }

    //     // Create the datatable
    //     $('#data_table_container').DataTable();
    // }

    function makePredictions_byname() {
        let anime_id = $('#anime_name').val().trim();
        // Collect genres

        let selectedGenres = $('#genre').val() || []; // This will already return an array for Select2
        if (typeof selectedGenres === 'string') {
            // If it's a string, split by comma
            selectedGenres = selectedGenres.split(',').map(item => item.trim());
        }
        
        console.log('Genres Array:', selectedGenres);  // This will now log the array of genres
        

        // Collect types
        let selectedTypes = $('#type').val() || []; // Select multiple types
        console.log('Types:', selectedTypes);

        // Get minimum rating and max episodes
        let minRating = parseInt($('#min-rating-container').val()) || 0;
        console.log(`Min Rating: ${minRating}`);
        let maxEpisodes = parseInt($('#min-episodes-container').val()) || 0;
        console.log(`Max Episodes: ${maxEpisodes}`);
    
        // Create the URL for the anime row
        let animeRowURL = `/api/v1.0/get_anime/${anime_id}`;
    
        // Get anime details from the database
        $.ajax({
            type: "GET",
            url: animeRowURL,
            contentType: 'application/json;charset=UTF-8',
            success: function(returnedData) {
                // Build the payload using the returned data
                let payload = {
                    episodes: returnedData[0].episodes,
                    rating: returnedData[0].rating,
                    members: returnedData[0].members,
                    Action: returnedData[0].Action,
                    Adventure: returnedData[0].Adventure,
                    Cars: returnedData[0].Cars,
                    Comedy: returnedData[0].Comedy,
                    Dementia: returnedData[0].Dementia,
                    Demons: returnedData[0].Demons,
                    Drama: returnedData[0].Drama,
                    Fantasy: returnedData[0].Fantasy,
                    Game: returnedData[0].Game,
                    Historical: returnedData[0].Historical,
                    Horror: returnedData[0].Horror,
                    Josei: returnedData[0].Josei,
                    Kids: returnedData[0].Kids,
                    Magic: returnedData[0].Magic,
                    MartialArts: returnedData[0].MartialArts,
                    Mecha: returnedData[0].Mecha,
                    Military: returnedData[0].Military,
                    Movie: returnedData[0].Movie,
                    Music: returnedData[0].Music,
                    Mystery: returnedData[0].Mystery,
                    ONA: returnedData[0].ONA,
                    OVA: returnedData[0].OVA,
                    Parody: returnedData[0].Parody,
                    Police: returnedData[0].Police,
                    Psychological: returnedData[0].Psychological,
                    Romance: returnedData[0].Romance,
                    Samurai: returnedData[0].Samurai,
                    School: returnedData[0].School,
                    SciFi: returnedData[0].SciFi,
                    Seinen: returnedData[0].Seinen,
                    Shoujo: returnedData[0].Shoujo,
                    ShoujoAi: returnedData[0].ShoujoAi,
                    Shounen: returnedData[0].Shounen,
                    ShounenAi: returnedData[0].ShounenAi,
                    SliceofLife: returnedData[0].SliceofLife,
                    Space: returnedData[0].Space,
                    Special: returnedData[0].Special,
                    Sports: returnedData[0].Sports,
                    SuperPower: returnedData[0].SuperPower,
                    Supernatural: returnedData[0].Supernatural,
                    TV: returnedData[0].TV,
                    Thriller: returnedData[0].Thriller,
                    Vampire: returnedData[0].Vampire, 
                    selectedGenres: selectedGenres,
                    selectedTypes: selectedTypes,
                    minRating: minRating,
                    maxEpisodes: maxEpisodes
                };
    
                // Send the payload to the prediction endpoint
                $.ajax({
                    type: "POST",
                    url: "/makePredictions_byname",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({ data: payload }),
                    success: function(returnedData) {
                        console.log("Prediction Response: ", returnedData);

                        const predictions = JSON.parse(returnedData.prediction);

                        // Sort by distances (ascending)
                        predictions.sort((a, b) => a.distance - b.distance);

                        console.log (recommendations)

                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.error("Status: " + textStatus);
                        console.error("Error: " + errorThrown);
                    }
                });
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.error("Status: " + textStatus);
                console.error("Error: " + errorThrown);
            }
        });
    }
    
  
    // Function to handle anime search when the search button is clicked
    function handleSearchButtonClick() {
        $('#search_anime_name_btn').click(function() {
            makePredictions_byname();
        });
    }

    // Function to initialize the share button functionality
    function initializeShareButton() {
        $('#share-btn').click(function() {
            const url = window.location.href;
            const text = "Check out this awesome anime recommender!";
            const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            window.open(twitterShareUrl, '_blank');
        });
    }

    // Function to pre-load the anime names from the server
    function loadAnimeNames() {
        $.ajax({
            type: "GET",
            url: "/api/v1.0/get_anime_names",  // Server route to fetch anime names and IDs
            dataType: "json",
            success: function(data) {
                animeList = data.map(function(anime) {
                    return { id: anime.anime_id, text: anime.name };  // Pre-load into animeList
                });


                // Initialize Select2 after the list is loaded
                initializeAnimeNameSelect();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.error("Error loading anime names:", textStatus, errorThrown);
            }
        });
    }

    // Initialize all components
    function initializeApp() {
        loadAnimeNames();  // Load the anime names from sqlite
        // populateTable([]);  // Initialize the table with empty data
        initializeMultiSelect();  // Initialize the genres and types multi-selects
        handleSearchButtonClick();  // Set up the event listener for the search button
        initializeShareButton();  // Set up the share button functionality
        initializeAnimeNameSelect();  // Initialize the anime name dropdown with Select2 and AJAX (loaded last to give time for the JSON to load)
    }

    // Call the initializeApp function
    initializeApp();

});
