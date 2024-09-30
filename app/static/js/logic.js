$(document).ready(function() { 

    // Function to initialize Select2 for anime names using AJAX to fetch from JSON
    // https://select2.org/data-sources/ajax
    // https://makitweb.com/loading-data-remotely-in-select2-with-ajax/
    function initializeAnimeNameSelect() {
        $('#anime_name').select2({
            placeholder: "Type anime name",
            minimumInputLength: 1,  // Start searching after 1 character has been typed
            ajax: {
                url: 'static/data/anime_names.json',  // Path to your JSON file
                dataType: 'json',
                delay: 250,  // Delay the request to avoid too many requests
                processResults: function (data, params) {
                    const searchTerm = params.term.toLowerCase();
                    
                    // Filter and prioritize results based on the search term
                    const filtered = data.filter(function(name) {
                        return name.toLowerCase().includes(searchTerm);
                    });

                    // Prioritize names that start with the search term first
                    filtered.sort(function(a, b) {
                        const aStartsWith = a.toLowerCase().startsWith(searchTerm);
                        const bStartsWith = b.toLowerCase().startsWith(searchTerm);

                        if (aStartsWith && !bStartsWith) {
                            return -1;  // Put 'a' first
                        }
                        if (!aStartsWith && bStartsWith) {
                            return 1;   // Put 'b' first
                        }

                        // If both or neither start with the term, sort alphabetically
                        return a.toLowerCase().localeCompare(b.toLowerCase());
                    });

                    return {
                        results: filtered.map(function(name) {
                            return { id: name, text: name };
                        })
                    };
                },
                cache: true,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error loading anime names:", textStatus, errorThrown);
                }
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

    // Function to handle anime search when the search button is clicked
    function handleSearchButtonClick() {
        $('#search_anime_name_btn').click(function() {
            const animeName = $('#anime_name').val().trim();
            if (animeName) {
                alert(`Searching recommendations for: ${animeName}`);

                // Make the AJAX call to /makePredictions
                $.ajax({
                    url: '/makePredictions',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ "select2-anime_name-container": animeName }),
                    success: function(response) {
                        console.log("Prediction:", response.prediction);
                        alert(`Prediction for ${animeName}: ${response.prediction}`);
                    },
                    error: function(error) {
                        console.error("Error:", error);
                    }
                });

            } else {
                alert("Please select an anime from the list.");
            }
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

    // Initialize all components
    function initializeApp() {
        initializeMultiSelect();  // Initialize the genres and types multi-selects
        handleSearchButtonClick();  // Set up the event listener for the search button
        initializeShareButton();  // Set up the share button functionality
        initializeAnimeNameSelect();  // Initialize the anime name dropdown with Select2 and AJAX (loaded last to give time for the JSON to load)
    }

    // Call the initializeApp function
    initializeApp();

});
