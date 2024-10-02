$(document).ready(function() { 

    // Function to initialize Select2 for anime names using AJAX to fetch from JSON
    // https://select2.org/data-sources/ajax
    // https://makitweb.com/loading-data-remotely-in-select2-with-ajax/
    let currentAjaxRequest = null;  // Variable to store the current AJAX request
    let animeList = [];  // Variable to store the list of anime names

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
    
    
    

    // // Function to initialize Select2 for anime names using AJAX to fetch from JSON
    // function initializeAnimeNameSelect() {
    //     $('#anime_name').select2({
    //         placeholder: "Type anime name",
    //         minimumInputLength: 1,  // Start searching after 1 character has been typed
    //         ajax: {
    //             url: 'static/data/anime_names.json',  // Path to your JSON file
    //             dataType: 'json',
    //             delay: 250,  // Delay the request to avoid too many requests
    //             transport: function (params, success, failure) {
    //                 // Abort previous request if still ongoing
    //                 if (currentAjaxRequest) {
    //                     currentAjaxRequest.abort();
    //                 }
    
    //                 // Initiate a new AJAX request
    //                 currentAjaxRequest = $.ajax(params).done(success).fail(failure);
    //             },
    //             processResults: function (data, params) {
    //                 const searchTerm = params.term.toLowerCase();

    //                 // Filter and prioritize results based on the search term
    //                 const filtered = data.filter(function(name) {
    //                     return name.toLowerCase().includes(searchTerm);
    //                 });
    
    //                 // Prioritize names that start with the search term first
    //                 filtered.sort(function(a, b) {
    //                     const aStartsWith = a.toLowerCase().startsWith(searchTerm);
    //                     const bStartsWith = b.toLowerCase().startsWith(searchTerm);
    
    //                     if (aStartsWith && !bStartsWith) {
    //                         return -1;  // Put 'a' first
    //                     }
    //                     if (!aStartsWith && bStartsWith) {
    //                         return 1;   // Put 'b' first
    //                     }
    
    //                     // If both or neither start with the term, sort alphabetically
    //                     return a.toLowerCase().localeCompare(b.toLowerCase());
    //                 });
    
    //                 return {
    //                     results: filtered.map(function(name) {
    //                         return { id: name, text: name };
    //                     })
    //                 };
    //             },
    //             cache: true,
    //             error: function (jqXHR, textStatus, errorThrown) {
    //                 if (textStatus !== 'abort') {  // Ignore "abort" errors
    //                     console.error("Error loading anime names:", textStatus, errorThrown);
    //                 }
    //             }
    //         },
    //         allowClear: true
    //     });
    // }
    

    // Function to initialize Select2 for genres and types
    function initializeMultiSelect() {
        $('.select2').select2({
            placeholder: "Select options",
            allowClear: true
        });
    }

    // // Function to handle anime search when the search button is clicked
    // function handleSearchButtonClick() {
    //     $('#search_anime_name_btn').click(function() {
    //         const animeName = $('#anime_name').val().trim();
    //         if (animeName) {
    //             // Display a message on the screen
    //             alert(`You have selected: ${animeName}`);
                
    //             // Log the selection to the console
    //             console.log(`User selected anime: ${animeName}`);
    //         } else {
    //             alert("Please select an anime from the list.");
    //         }
    //     });
    // }

    // // Function to make predictions based on the selected anime name
    // function makePredictions_byname() {
    //     let animeName = $('#anime_name').val().trim();

    //     // Create the payload
    //     let payload = {
    //         "anime_name": animeName
    //     };

    //     // Perform a POST request to /makePredictions_byname
    //     $.ajax({
    //         type: "POST",
    //         url: "/makePredictions_byname",
    //         contentType: 'application/json;charset=UTF-8',
    //         data: JSON.stringify({ "data": payload }),
    //         success: function(returnedData) {
    //             // print it
    //             console.log(returnedData);
    //             // var prob = parseFloat(returnedData["prediction"]);
    
    //             // if (prob > 0.5) {
    //             //     $("#output").text(`You Survived with probability ${prob}!`);
    //             // } else {
    //             //     $("#output").text(`You did not survive with probability ${prob}, sorry. :(`);
    //             // }
    
    //         },
    //         error: function(XMLHttpRequest, textStatus, errorThrown) {
    //             alert("Status: " + textStatus);
    //             alert("Error: " + errorThrown);
    //         }
    //     });
    // }

    function makePredictions_byname() {
        let anime_id = $('#anime_name').val().trim();
    
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
                    Vampire: returnedData[0].Vampire
                };
    
                // Send the payload to the prediction endpoint
                $.ajax({
                    type: "POST",
                    url: "/makePredictions_byname",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({ data: payload }),
                    success: function(returnedData) {
                        console.log("Prediction Response: ", returnedData);

                        $('#data_table_container').DataTable().clear().destroy();

                        // Build the table
                        let table = d3.select("#data_table_container");
                        let tbody = table.select("tbody");
                        tbody.html("");

                        // Append a row for each anime
                        for (let i = 0; i < returnedData.length; i++) {
                            let row = tbody.append("tr");
                            row.append("td").text(returnedData[i].anime_id);
                            row.append("td").text(returnedData[i].name);
                            row.append("td").text(returnedData[i].rating);
                            row.append("td").text(returnedData[i].members);
                            row.append("td").text(returnedData[i].prediction);
                            if (data[i].href == null) {
                                row.append("td").text("N/A");
                            } else
                                row.append("td").html('<a href="' + data[i].href + '">Link</a>');
                        }
                        // Create the datatable
                        $('#data_table_container').DataTable();
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
            // const animeName = $('#anime_name').val().trim();
            // if (animeName) {
            //     alert(`Searching recommendations for: ${animeName}`);

            //     // Make the AJAX call to /makePredictions
            //     $.ajax({
            //         url: '/makePredictions_byname',
            //         type: 'POST',
            //         contentType: 'application/json',
            //         data: JSON.stringify({ "select2-anime_name-container": animeName }),
            //         success: function(response) {
            //             console.log("Prediction:", response.prediction);
            //             alert(`Prediction for ${animeName}: ${response.prediction}`);
            //         },
            //         error: function(error) {
            //             console.error("Error:", error);
            //         }
            //     });

            // } else {
            //     alert("Please select an anime from the list.");
            // }
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
        initializeMultiSelect();  // Initialize the genres and types multi-selects
        handleSearchButtonClick();  // Set up the event listener for the search button
        initializeShareButton();  // Set up the share button functionality
        initializeAnimeNameSelect();  // Initialize the anime name dropdown with Select2 and AJAX (loaded last to give time for the JSON to load)
    }

    // Call the initializeApp function
    initializeApp();

});
