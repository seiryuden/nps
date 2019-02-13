'use strict';

// put your own value below!
const apiKey = 'ALGP0raPtnXuYgjmOc7z1xtWBBnogfVmmnKdW9YU'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  console.log(queryItems);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  
  console.log(responseJson);
  $('#results-list').empty();
  $("#js-error-message").empty();
  
  for (let i = 0; i < responseJson.data.length; i++){
  
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].line2}, ${responseJson.data[i].addresses[0].postalCode}, ${responseJson.data[i].addresses[0].stateCode} .</p>
      <p><a href='${responseJson.data[i].url}' target="_blank">${responseJson.data[i].url}</a></p>
      </li>`

      
    );
};

$('#results').removeClass('hidden');
};

function getParks(query, maxResults) {
  
  const params = {
    api_key: apiKey,
    q: query,
    limit: maxResults,
    fields: "addresses",
  };

  if (query.indexOf(",") > -1 ){
    params.stateCode = params.q.replace(/\s/g,'');
    delete params.q; 
  }
  
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const stateName = $('#js-state-name').val();
    const maxResults = $('#js-max-results').val();
    getParks(stateName, maxResults - 1);
  });
}

$(watchForm);