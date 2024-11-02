const handleClick = (roomName)=> {
		let option =		{
				        method: 'POST',
				        headers: {
				          "Content-Type": "application/json"
				        },
				        body: JSON.stringify(roomName.value.trim())
				      }
			        fetch(`/room`,option)
					.then(response => {
						if(response.ok){
							console.log(roomName.value.trim());
							window.location.href = `/room/${roomName.value.trim()}`;
						}else{
							roomName.placeholder = "다시 입력해주세요."
							roomName.classList.toggle("custom-placeholder");
							roomName.value = "";
						}
					})
		 
	    }
		

document.querySelector("#new-meeting-btn").addEventListener("click",function(event){
	
			const btnTag = document.getElementById("meeting-btn");
			const inputTag = document.getElementById("meeting-input");
			const modalMeeting = document.getElementById("new-meeting");
			
			modalMeeting.style.display = "flex";
			modalMeeting.addEventListener("click",function(event){
				if (event.currentTarget === event.target){
					modalMeeting.style.display="none";
					inputTag.value="";
					btnTag.classList.remove("active");
				}
				event.preventDefault();
			})
				
				
		});
		document.getElementById("meeting-input").addEventListener("input",function(){
			const isInputNotEmpty = this.value.trim()!== "";
			document.getElementById("meeting-btn").classList.toggle("active",isInputNotEmpty);
			document.getElementById("meeting-btn").disabled = !isInputNotEmpty;
		});
		document.getElementById("meeting-btn").addEventListener("click",function(){
			if(this.classList.contains("active")){
				handleClick(document.getElementById("meeting-input"));
			}
		});
		document.getElementById("meeting-input").addEventListener("keydown",function(event){
			if(event.key ==="Enter" && document.getElementById("meeting-btn").classList.contains("active"))
			{
					//클릭이벤트	
					handleClick(this);
					//inputTag.value = "";
					event.preventDefault();
		}});
		
function joinBtnClickEvent(){
	console.log(document.getElementById("join-input").value);
	
	//window.location.href = document.getElementById("join-input").value;
}
document.getElementById("join-input").addEventListener("input",function(){
	const isInputNotEmpty = document.getElementById("join-input").value.trim()!== "";
	document.getElementById("join-btn").classList.toggle("active",isInputNotEmpty);
	document.getElementById("join-btn").disabled = !isInputNotEmpty;
});

document.getElementById("join-btn").addEventListener("click", function(){
	if(this.classList.contains("active")){
					handleClick(document.getElementById("join-input"));
				}
});
document.getElementById("join-input").addEventListener("keydown",function(event){
			if(event.key ==="Enter" && document.getElementById("join-btn").classList.contains("active")){
				//클릭이벤트	
				handleClick(this);
				event.preventDefault();
			}
		})
		
		
		
document.getElementById("close").addEventListener("click",function(){
	document.getElementById("new-meeting").style.display = "none";
	document.getElementById("meeting-input").value="";
	document.getElementById("join-btn").classList.toggle("active",false);
	
	
})