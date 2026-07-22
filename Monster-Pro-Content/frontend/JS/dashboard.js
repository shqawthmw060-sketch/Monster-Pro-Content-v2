async function loadDashboard(){

const res = await fetch("/api/dashboard");

const data = await res.json();

document.getElementById("channelsCount").innerHTML = data.channels;

document.getElementById("moviesCount").innerHTML = data.movies;

document.getElementById("seriesCount").innerHTML = data.series;

document.getElementById("usersCount").innerHTML = data.users;

}

loadDashboard();