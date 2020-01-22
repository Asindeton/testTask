
let cityString = `"Nashville, TN", 36.17, -86.78;
"New York, NY", 40.71, -74.00;
"Atlanta, GA", 33.75, -84.39;
"Denver, CO", 39.74, -104.98;
"Seattle, WA", 47.61, -122.33;
"Los Angeles, CA", 34.05, -118.24;
"Memphis, TN", 35.15, -90.05;`;

let isFirstTime = true;
let cityArr = [];

let obj = {
    northernmost: function(){
        let answer = [];
        for (var prop in obj) {
            answer[prop] = obj[prop].longitude;
          }
          console.log(answer.length)
          return obj[answer.indexOf(Math.max.apply(null,answer))].cities;
    },
    easternmost: function(){
        let answer = [];
        for (var prop in obj) {
            answer[prop] = obj[prop].latitude;
          }
          return obj[answer.indexOf(Math.max.apply(null,answer))].cities;
    },
    southernmost: function(){
        let answer = [];
        for (var prop in obj) {
            answer[prop] = obj[prop].longitude;
          }
          return obj[answer.indexOf(Math.min.apply(null,answer))].cities;
    },
    westernmost: function(){
        let answer = [];
        for (var prop in obj) {
            answer[prop] = obj[prop].latitude;
          }
          return obj[answer.indexOf(Math.min.apply(null,answer))].cities;
    },
    locationSearch: function(longitude, latitude){
        let allLongitude = [];
        let allLatitude = [];
        let answer = [];
        for (var prop in obj) {
            allLongitude[prop] = obj[prop].longitude;
            allLatitude[prop] = obj[prop].latitude;
        }
        for(let i = 0; i<allLongitude.length; i++){
            let distance = ((allLatitude[i] - latitude)**2 + (allLongitude[i] - longitude)**2)**(1 / 2);
            answer.push(distance)
        }

        return obj[answer.indexOf(Math.min.apply(null,answer))].cities;
    },
    getStateName: function(){
        let answer = [];
        for (var prop in obj) {
            answer[prop] = obj[prop].states;
          }
        
          function unique(arr) {
            let result = [];
          
            for (let str of arr) {
              if (!result.includes(str)) {
                result.push(str);
              }
            }
          
            return result;
          }

        return unique(answer).join(' ');
    }
};

function getCityArr(string){
    let arr = [];
    let answer = string.split(';');
    answer.forEach(element => {
        if (element){
        arr.push(element.split(','));
        }
    });
    for(let i = 0; i<arr.length; i++){
        if(i === 0){
            arr[i][0] = arr[i][0].split('').slice(1, arr[i][0].length).join(''); 
        } else {
            arr[i][0] = arr[i][0].split('').slice(2, arr[i][0].length).join('');
        }
        arr[i][1] = arr[i][1].split('').slice(1, arr[i][1].length - 1).join('');
        arr[i][2] = Number(arr[i][2]);
        arr[i][3] = Number(arr[i][3]);
    }
    return arr;
}

function addCity([cities, states, longitude , latitude]){
    this.cities = cities;
    this.states = states;
    this.longitude = longitude;
    this.latitude = latitude;
    if(isFirstTime){
        const frameHTML = drawCitiesList(cities, states, longitude , latitude);
        document.querySelector('.city-map').insertAdjacentHTML('afterend', frameHTML);
    }
}

function cityMap(arr){
    for(let i = 0; i<arr.length; i++){
        obj[i] = new addCity(arr[i]);
    }
    isFirstTime = false;
    return obj;
}

function drawCitiesList(cities, states, longitude , latitude){
    return `<div><span>States: ${states},</span> <span>City:${cities},</span> <span>longitude:${longitude},</span> <span>latitude:${latitude};</span></div>`
}

document.querySelector('#addNewCityButton').addEventListener('click', () => {
    let city = document.querySelector('#city').value;
    let state = document.querySelector('#state').value;
    let longitude = +document.querySelector('#longitude').value;
    let latitude = +document.querySelector('#latitude').value;

    if(city && state && longitude && latitude){
        const frameHTML = drawCitiesList(city, state, longitude , latitude);
        document.querySelector('.city-map').insertAdjacentHTML('afterend', frameHTML);

        cityArr.push([city, state, longitude, latitude]);
        cityMap(cityArr);
    } else {
        alert('Invalid Input Status');
    }

})

document.querySelector('#removeFromLocalStorage').addEventListener('click', () =>{
    localStorage.removeItem('cityArr');
})

window.addEventListener('beforeunload', () => {
    if(document.querySelector('#checkbox').checked){
        localStorage.setItem('cityArr', cityArr);
    }
});

window.addEventListener('load', () => {
    if(localStorage.getItem('cityArr')){
        let array = localStorage.getItem('cityArr').split(','); 
        console.log(array);
        let size = 4;
        for (let i = 0; i <Math.ceil(array.length/size); i++){
            cityArr[i] = array.slice((i*size), (i*size) + size);
        }
        cityMap(cityArr);
    } else {
        cityArr = getCityArr(cityString);
        cityMap(cityArr);
    }
});