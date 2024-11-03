document.getElementById("focus-modal").addEventListener("click",function(event){
	if(event.currentTarget === event.target){
		this.style.display = "none";
	}
})
document.getElementById("startBtn").addEventListener("click",function(){
	document.getElementById("focus-modal").style.display = "none";
})


document.getElementById("focus-close").addEventListener("click",function(){
	document.getElementById("focus-modal").style.display = "none";
})