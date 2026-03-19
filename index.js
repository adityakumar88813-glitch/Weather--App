const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");



let currentTab= userTab;

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionstroge();


//function for switching tab
 function switchTab(clickedTab){
         if(currentTab != clickedTab){
            currentTab.classList.remove("current-tab");
            currentTab = clickedTab;
            currentTab.classList.add("current-tab");


            if(!searchForm.classList.contains("active")){
                //agar search vale pe jane ke liye pahle grant and user vale container to hataya   
                userInfoContainer.classList.remove("active");
                grantAccessContainer.classList.remove("active");
                //ab add kiya do search vale me
                searchForm.classList.add("active");
            }
            //agar search tab pe tha and ab weather tab pe jana hai 
            else{  

                searchForm.classList.remove("active");
                userInfoContainer.classList.remove("active");
                //now we come in weather tab so for show the weather
                getfromSessionstroge();
            }

         }
 }


//Add event lisner to both tab
userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})


// for weather details
function getfromSessionstroge(){
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if(!localCoordinates){
            //agar local coordinate nhi hai to 
            grantAccessContainer.classList.add("active");

        }
        else{
            const coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
}

//for API Call use asyn function
 async function  fetchUserWeatherInfo(coordinates){
     const{lat , lon} = coordinates;

     //make grantcontainer invisible
     grantAccessContainer.classList.remove("active");

     //loading screen dikhaya
     loadingScreen.classList.add("active");

     //API CALL
     try{
          const res = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
);
const data = await res.json();

// ab loading to hata diya
   loadingScreen.classList.remove("active");

   //user valacontainer dikhana paega
   userInfoContainer.classList.add("active");

   //data ko UI pe dikhane ke liye
   renderweatherInfo(data);

     }
     catch(err){
       loadingScreen.classList.remove("active");
     }

}

function  renderweatherInfo(weatherInfo){
    //needs country , temp , dicription,windspeed ,humidity,clouds
    // so fetch these element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
   
    //fetch data to shoow on UI
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText =  `${weatherInfo?.wind?.speed} m/s`;
     humidity.innerText =  `${weatherInfo?.main?.humidity}%`;
     cloudiness.innerText = `${ weatherInfo?.clouds?.all}%`;


} 

window.addEventListener("load", ()=>{
    getLocation();
});



//for get location 
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            showPosition,
            ()=>{
                alert("Location access denied ❌");
            }
        );
    }
    else{
        alert("Geolocation is not supported by your browser");
    }
}

//showlocation ka function
function showPosition(position){
  
    const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));

    //UI pe dikhane ke liye
    fetchUserWeatherInfo(user-coordinates);
}

//for grant btn 
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName =searchInput.value ;

    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

//city ke liye API call after search
 async function  fetchSearchWeatherInfo(city){
    //loading screen ko on karna pdega
    loadingScreen.classList.add("active"); 

    //oldWeather ko remove kar diya
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
         
         const data = await response.json();
         loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        
        //for show data 
        renderweatherInfo(data);

    }
    catch(err){
       loadingScreen.classList.remove("active");
    alert("Something went wrong");
    }
}





function renderForecast(data){
    const container = document.querySelector(".forecast-container");
    container.innerHTML = "";

    // har 8 interval = 1 day (3hr data)
    for(let i = 0; i < data.list.length; i += 8){
        const item = data.list[i];

        const date = new Date(item.dt_txt).toDateString();
        const temp = item.main.temp;
        const icon = item.weather[0].icon;

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <p>${date}</p>
            <img src="https://openweathermap.org/img/w/${icon}.png"/>
            <p>${temp} °C</p>
        `;

        container.appendChild(card);
    }
}
