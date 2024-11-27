document.addEventListener('DOMContentLoaded',()=>{
  const cityInput = document.getElementById('city-input')
  const getWeatherbtn = document.getElementById('get-weather-btn')
  const weatherInfo = document.getElementById('weather-info')
  const cityNameDisplay = document.getElementById('city-name')
  const temperatureDisplay = document.getElementById('temperature')
  const description = document.getElementById('description')
  const errroMessage = document.getElementById('error-message')
  
  const API_KEY ="16bff9227156e5fc895c5a9da5bee569"


  getWeatherbtn.addEventListener('click', async ()=>{
    const city =cityInput.value.trim()

    if(!city)return;

     try {
     const weatherData= await fetchWeatherData(city)
     displayWeatherData(weatherData)
     } catch (error) {
      showError()
     }


  })


 async  function fetchWeatherData(city){

 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  const response = await fetch(url);
if(!response.ok){
 throw new Error("city not found")
}
  
  const data = await response.json()
  console.log(data);
  
  return data
 }

  function displayWeatherData(data){
const {name,main,weather} = data
cityNameDisplay.textContent =name
weatherInfo.classList.remove('hidden')
temperatureDisplay.textContent =`Temperature : ${main.temp}`
description.textContent =`Weather : ${weather[0].description}`
errroMessage.classList.add('hidden')
  }

  function showError(){
    weatherInfo.classList.add('hidden')
    errroMessage.classList.remove('hidden')
  }
})