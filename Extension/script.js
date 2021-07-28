document.getElementById("myButton").addEventListener("click", redirect);
function redirect(){
    window.open("http://localhost:3000/");
}

document.getElementById("acc").innerHTML=localStorage.getItem('ethacc');