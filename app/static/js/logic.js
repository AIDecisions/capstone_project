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
//    function populateTable(recommendations) {


//     var dataSet = [
//         ['Tiger Nixon', 'System Architect', 'Edinburgh', '5421', '2011/04/25', '$320,800'],
//         ['Garrett Winters', 'Accountant', 'Tokyo', '8422', '2011/07/25', '$170,750'],
//         ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '1562', '2009/01/12', '$86,000'],
//         ['Cedric Kelly', 'Senior Javascript Developer', 'Edinburgh', '6224', '2012/03/29', '$433,060'],
//         ['Airi Satou', 'Accountant', 'Tokyo', '5407', '2008/11/28', '$162,700'],
//         ['Brielle Williamson', 'Integration Specialist', 'New York', '4804', '2012/12/02', '$372,000'],
//         ['Herrod Chandler', 'Sales Assistant', 'San Francisco', '9608', '2012/08/06', '$137,500'],
//         ['Rhona Davidson', 'Integration Specialist', 'Tokyo', '6200', '2010/10/14', '$327,900'],
//         ['Colleen Hurst', 'Javascript Developer', 'San Francisco', '2360', '2009/09/15', '$205,500'],
//         ['Sonya Frost', 'Software Engineer', 'Edinburgh', '1667', '2008/12/13', '$103,600'],
//         ['Jena Gaines', 'Office Manager', 'London', '3814', '2008/12/19', '$90,560'],
//         ['Quinn Flynn', 'Support Lead', 'Edinburgh', '9497', '2013/03/03', '$342,000'],
//         ['Charde Marshall', 'Regional Director', 'San Francisco', '6741', '2008/10/16', '$470,600'],
//         ['Haley Kennedy', 'Senior Marketing Designer', 'London', '3597', '2012/12/18', '$313,500'],
//         ['Tatyana Fitzpatrick', 'Regional Director', 'London', '1965', '2010/03/17', '$385,750'],
//         ['Michael Silva', 'Marketing Designer', 'London', '1581', '2012/11/27', '$198,500'],
//         ['Paul Byrd', 'Chief Financial Officer (CFO)', 'New York', '3059', '2010/06/09', '$725,000'],
//         ['Gloria Little', 'Systems Administrator', 'New York', '1721', '2009/04/10', '$237,500'],
//         ['Bradley Greer', 'Software Engineer', 'London', '2558', '2012/10/13', '$132,000'],
//         ['Dai Rios', 'Personnel Lead', 'Edinburgh', '2290', '2012/09/26', '$217,500'],
//         ['Jenette Caldwell', 'Development Lead', 'New York', '1937', '2011/09/03', '$345,000'],
//         ['Yuri Berry', 'Chief Marketing Officer (CMO)', 'New York', '6154', '2009/06/25', '$675,000'],
//         ['Caesar Vance', 'Pre-Sales Support', 'New York', '8330', '2011/12/12', '$106,450'],
//         ['Doris Wilder', 'Sales Assistant', 'Sydney', '3023', '2010/09/20', '$85,600'],
//         ['Angelica Ramos', 'Chief Executive Officer (CEO)', 'London', '5797', '2009/10/09', '$1,200,000'],
//         ['Gavin Joyce', 'Developer', 'Edinburgh', '8822', '2010/12/22', '$92,575'],
//         ['Jennifer Chang', 'Regional Director', 'Singapore', '9239', '2010/11/14', '$357,650'],
//         ['Brenden Wagner', 'Software Engineer', 'San Francisco', '1314', '2011/06/07', '$206,850'],
//         ['Fiona Green', 'Chief Operating Officer (COO)', 'San Francisco', '2947', '2010/03/11', '$850,000'],
//         ['Shou Itou', 'Regional Marketing', 'Tokyo', '8899', '2011/08/14', '$163,000'],
//         ['Michelle House', 'Integration Specialist', 'Sydney', '2769', '2011/06/02', '$95,400'],
//         ['Suki Burks', 'Developer', 'London', '6832', '2009/10/22', '$114,500'],
//         ['Prescott Bartlett', 'Technical Author', 'London', '3606', '2011/05/07', '$145,000'],
//         ['Gavin Cortez', 'Team Leader', 'San Francisco', '2860', '2008/10/26', '$235,500'],
//         ['Martena Mccray', 'Post-Sales support', 'Edinburgh', '8240', '2011/03/09', '$324,050'],
//         ['Unity Butler', 'Marketing Designer', 'San Francisco', '5384', '2009/12/09', '$85,675'],
//         ] 

//         $('#data_table_container').DataTable({
//             data: dataSet,
//             columns: [
//                 { title: 'Name' },
//                 { title: 'Position' },
//                 { title: 'Office' },
//                 { title: 'Extn.' },
//                 { title: 'Start date' },
//                 { title: 'Salary' }
//             ]
//         });
    //     let tableBody = $('#data_table_container tbody');
    //     tableBody.empty(); // Clear the previous content

    //     console.log(recommendations);

    //     // Loop through the predictions and create table rows
    //     recommendations.forEach(function(pred) {
    //         let row = `<tr>
    //                         <td>${recommendations.anime_id}</td>
    //                         <td>${recommendations.name}</td>
    //                         <td>${recommendations.rating}</td>
    //                         <td>${recommendations.members}</td>
    //                         <td>${recommendations.distances}</td>
    //                     </tr>`;
    //         tableBody.append(row); // Add the row to the table body
    //     });

    // // Initialize DataTable or reinitialize if already present
    // if (!$.fn.DataTable.isDataTable('#recommendationTable')) {
    //     $('#recommendationTable').DataTable({
    //         destroy: true, // Allow reinitialization of the DataTable
    //         paging: true,
    //         searching: false
    //     });
    // } else {
    //     $('#recommendationTable').DataTable().clear().draw();
    // }
// }

    // // Function to populate the table with the prediction results
    // function populateTable(recommendations) {
    //     // Clear previous data
    //     $('#data_table_container').DataTable().clear().destroy();

    //     // Build the table
    //     let table = d3.select("#data_table_container");
    //     let tbody = table.select("tbody");
    //     tbody.html("");

    //     // Append a row for each anime
    //     for (let i = 0; i < recommendations.length; i++) {
    //         let row = tbody.append("tr");
    //         row.append("td").text(recommendations[i].anime_id);
    //         row.append("td").text(recommendations[i].name);
    //         row.append("td").text(recommendations[i].rating);
    //         row.append("td").text(recommendations[i].members);
    //         row.append("td").text(recommendations[i].distance.toFixed(3));
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
        
        // Collect types
        let selectedTypes = $('#type').val() || []; // Select multiple types

        // Get minimum rating and max episodes
        let minRating = parseInt($('#min-rating-container').val()) || 0;
        let maxEpisodes = parseInt($('#min-episodes-container').val()) || 0;
    
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
                        const predictions = JSON.parse(returnedData.prediction);

                        // Sort by distances (ascending)
                        predictions.sort((a, b) => a.distance - b.distance);

                        console.log (predictions);
                        // Populate the table with the predictions
                        populateTable(predictions);

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
