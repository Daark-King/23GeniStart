import("node-fetch").then((nodeFetch) => {
    const fetch = nodeFetch.default;
});

async function fetchData() {
  const url = 'https://google-maps-data1.p.rapidapi.com/gmaps?keyword=restaurants&latitude=12.9300783&longitude=77.5275351&maxResults=20&zoom=15';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8704540e34msh61ac02b53026e01p1b528ejsn6b996abba677',
      'X-RapidAPI-Host': 'google-maps-data1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    const items = data.result;

    items.forEach(function(item) {
        console.log(`Title : ${item.title} , Contact : ${item.contact.phone}`+"\n");
    })
  } catch (error) {
    console.error(error);
  }
}

fetchData();
