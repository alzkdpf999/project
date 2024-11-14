/**
 * DataChannel 을 다루기 위한 js
 */
// HTML 요소 참조
let webcamElement = null;
let cnt = 0;
// 모델 로드
async function loadModel() {
    const model = await tf.loadGraphModel('../../model/model.json');
    //console.log("Model loaded successfully.");
    return model;
}
// 실시간 예측 함수
async function predict(model) {
	
	//console.log(webcamElement);
    const webcamImage = tf.browser.fromPixels(webcamElement);
    const resizedImage = tf.image.resizeBilinear(webcamImage, [224, 224]);
    const normalizedImage = resizedImage.div(255.0).expandDims(0);
    
    const prediction = await model.predict(normalizedImage);
    //console.log(prediction.dataSync());
	const result = prediction.dataSync();
	//console.log("result : "+result)
	const predictedClass = result[0] > 0.5 ? 1 : 0;
	//console.log("클래스:::"+predictedClass);
	
	
	//saveImage(resizedImage);  // webcamImage를 저장
	webcamImage.dispose();
	prediction.dispose();
	
	return predictedClass;
	 
}

// 웹캠과 모델을 바로 사용
const alarmAudio = document.getElementById("alarmAudio");
function openModal() {
	cnt++;
  document.getElementById("딴짓알림모달").style.display = "flex";
  alarmAudio.play();
  
}

function closeModal() {
  document.getElementById("딴짓알림모달").style.display = "none";
  alarmAudio.pause();
  
  alarmAudio.currentTime = 0;
}




async function run(models, callback) {
    if (!webcamElement) {
        console.error('Webcam element is not defined');
        return;
    }

    const predictionInterval = 1000; // 예측을 매 500ms마다 수행 (2 FPS)
   	let a = 0;
	let isPaused = false;
	let windowSize = 10; // 10초 동안의 값을 기록하기 위한 크기
	let values = Array(windowSize).fill(0); // 처음에는 1로 초기화 (0이 아닌 값으로)
    // 예측을 반복적으로 수행
	const interval = setInterval(async () => {
	        if (!isPaused) {
	            const result = await predict(models);
	            checkZero(parseInt(result, 10));
	        }
	    }, predictionInterval);

	

	function checkZero(value) {
	  // 배열에서 가장 오래된 값을 제거하고, 새 값을 추가
      //console.log("결과:"+value);
	  values.shift();
	  values.push(value);
//console.log("valuse : "+values);
	  // 모든 값이 0이면 콘솔 출력
	  if (values.every(v => v === 1)) {
		cnt++;
		openModal();
		callback("0");
		values = Array(10).fill(0); // 배열을 다시 1로 초기화
		pauseModel();
	  }
	  
	pauseModel = function(){
	          isPaused = true;
			  console.log("중")
	      }

	      // 모델 재시작 함수
		  resumeModel = function() { // 전역 변수에 할당
		          isPaused = false;
		          console.log("모델이 재시작되었습니다.");
		
		      };

	}
}


function top3Students(students){
	let topStudents = Object.entries(students)
	    .map(([name, score]) => [name, parseInt(score)]) // 점수를 숫자로 변환
	    .sort((a, b) => b[1] - a[1]) // 내림차순 정렬
	    .slice(0, 3); // 상위 3개 추출

	// 상위 3개 출력
	return topStudents;
}

function rankStudents(students){
	students.forEach(([name,score]) =>{
		//console.log(name,score);
		/*
		const studentItem = document.createElement("div");
			  studentItem.classList.add("student-item");
			  studentItem.id = name;

			  // 학생 이름 및 집중도 레벨 추가
			  studentItem.innerHTML = `
			    <div class="name">${name}</div>
			    <div class="focus-level">
			      <span>집중도:</span>
			      <div class="focus-bar">
			        <div id= "focus-level-${name}" class="focus-bar-inner" style="width: ${score}%"></div>
			      </div>
			    </div>
			  `;

			  // students-list 컨테이너에 추가
			  document.querySelector(".students-list").appendChild(studentItem);
			  */
	});
	
}
const dataChannel = {
    user : null,
	teach :null,
	userPeers: {},
	userFocus:{},
	intervalId: null,
	startTime:null,
    init: function() {
        // 핸들러들을 바인딩하여 'this'가 항상 dataChannel 객체를 참조하도록 보장하기 위함
        this.handleDataChannelOpen = this.handleDataChannelOpen.bind(this);
        this.handleDataChannelClose = this.handleDataChannelClose.bind(this);
        this.handleDataChannelMessageReceived = this.handleDataChannelMessageReceived.bind(this);
        this.handleDataChannelError = this.handleDataChannelError.bind(this);
    },
    initDataChannelUser : function(user) {
        this.user = user;
		this.userPeers[user.name] = user.rtcPeer; // 유저 이름으로 rtcPeer 저장
		//console.log("울리는횟체크 ");
    },
    isNullOrUndefined : function(value) {
        return value === null || value === undefined;
    },
    handleDataChannelOpen: function(event)  {
        console.log(this.isNullOrUndefined(event));
        if (this.isNullOrUndefined(event)) return;
        // console.log("dataChannel.OnOpen", event);
        //
    },
    handleDataChannelMessageReceived: function(event) { // datachannel 메시지 받는 부분
        if (this.isNullOrUndefined(event)) return;
        // console.log("dataChannel.OnMessage:", event);
        let recvMessage = JSON.parse(event.data);

        if (recvMessage.type === "file") {
            let file = recvMessage.fileMeta;

            // 파일 메시지 처리
            console.log("Received file:", file.fileName);

            let sendUser = recvMessage.userName;
            let message = sendUser + " 님이 파일을 업로드하였습니다";

            this.showNewMessage(message, 'other');
            this.showNewFileMessage(file, 'other');

        } else if(recvMessage.type == "message"){
            // 일반 메시지 처리
			//console.log("asd")
            let message = recvMessage.userName + " : " + recvMessage.message;
            this.showNewMessage(message, "other");
        }else if(recvMessage.type == "ai-stop"){
			this.showNewMessage("","ai-other-stop");
			}else if (recvMessage.type == "ai-message"){
	
			this.teach = recvMessage.teachName;
			//console.log(this.teach);
			let message = recvMessage.userName + " : " + recvMessage.message;
			this.showNewMessage(message, "ai-other");
		}else if(recvMessage.type == "ai-result"){
			if(recvMessage.teachName === this.user.name){
				const videoTag = document.querySelector(`#video-${recvMessage.userName}`);
				            videoTag.style.border="2px solid red";
				            setTimeout(function(){
				                videoTag.style.border = "none";
				            },2000);
			}
			//this.showNewMessage(`예측결과(${recvMessage.userName}) :`+ recvMessage.result, "ai-outcome",recvMessage.teachName);
		}else if(recvMessage.type=="focus-percent"){
		//여기 체크
			if(recvMessage.userName !=0){
			document.getElementById(`focus-level-${recvMessage.userName}`).style.width = `${recvMessage.message}%`;
			//console.log(this.userFocus);
			this.userFocus[recvMessage.userName] = recvMessage.message;
 			}
			console.log("focus-percent "+ recvMessage.userName+ ":::" + JSON.stringify(this.userFocus));
		}
    },
    handleDataChannelError: function(error) {
        if (this.isNullOrUndefined(error)) return;
        //console.error("dataChannel.OnError:", error);
    },
    handleDataChannelClose: function(leaveEvent, event) {
        if (this.isNullOrUndefined(event)) return;
        // console.log("dataChannel.OnClose", event);
    },
	startFocusInterval: function(time){
		if(!this.intervalId){
		
			this.intervalId = setInterval(() =>{
				//console.log("test");
				const endTime = new Date();
				const diffTime = endTime - time;
				const percent = (cnt * 10)/(diffTime / 1000);
				const roundedResult =100 - Math.round(percent * 10) / 10;
				this.showNewMessage(roundedResult,"focus-interval");
				rankStudents(top3Students(this.userFocus));
			},2000);
			
		}
	},
	stopFocusInterval: function(){
	clearInterval(this.intervalId);
	this.intervalId= null;	
	},
    sendMessage: function(message) {
        if (this.isNullOrUndefined(message)) return;
        let messageData = {
            type : "message",
            userName : this.user.name,
            message : message
        }
		//console.log(message);
        this.user.rtcPeer.send(JSON.stringify(messageData));
        
    },
	sendAiResult : function(outcome){
		//if (this.isNullOrUndefined(message)) return;
		let messageData = {
			            type : "ai-result",
						userName : this.user.name,
						teachName : this.teach,
						result : "알람이울렸"
			        }
		this.user.rtcPeer.send(JSON.stringify(messageData));
	},
	sendAiStopMsg:function(message){
		let messageData = {
			type : "ai-stop",
			userName: this.user.name,
			teachName : this.user.name,
			message:message
				}
				this.user.rtcPeer.send(JSON.stringify(messageData));
	},
	sendFocusMessage:function(message){
		let messageData = {
			            type : "focus-percent",
			            userName : this.user.name,
			            message : message
			        }
					this.user.rtcPeer.send(JSON.stringify(messageData));
	},
	sendAiMessage: function(message) {
	        if (this.isNullOrUndefined(message)) return;
			//console.log(this.user.name);
	        let messageData = {
	            type : "ai-message",
	            userName : this.user.name,
				teachName : this.user.name,
	            message : message
	        }

	        this.user.rtcPeer.send(JSON.stringify(messageData));
	        
	    },
    sendFileMessage : function(fileMeta){
        fileMeta.userName = this.user.name;
        this.user.rtcPeer.send(JSON.stringify(fileMeta));
        this.showNewFileMessage(fileMeta.fileMeta, 'self');
    },
    showNewMessage:async function(recvMessage, type,targetUserName = undefined) {
        // TODO 이거는 datachannelChatting 으로 넘어가야하는거...? 고민할것! => 넘어가는게 맞는듯ㅠ
        // 기본은 '나'가 보낸것
        type = type === undefined ? 'self' : type;
        if (type === 'self') {
            if (!recvMessage) return;

            dataChannelChatting.$messagesContainer.append([
                '<li class="self">',
                recvMessage,
                '</li>'
            ].join(''));
			//console.log("self");
			this.sendMessage(recvMessage);
            

            // clean out old message
            dataChannelChatting.$userTextInput.html('');

            // focus on input
            dataChannelChatting.$userTextInput.focus();

            dataChannelChatting.$messagesContainer.finish().animate({
                scrollTop: dataChannelChatting.$messagesContainer.prop("scrollHeight")
            }, 250);

        } else if(type === "focus-interval"){
			console.log("focus-interval");
			if(this.user.name != 0){
				this.userFocus[this.user.name] = recvMessage;
				document.getElementById(`focus-level-${this.user.name}`).style.width = `${recvMessage}%`
			}
			this.sendFocusMessage(recvMessage,this.user.name);
			console.log("focus-interval :::" + JSON.stringify(this.userFocus));
			
		// 여기 일단체크
		}else if(type === "ai"){
			if (!recvMessage) return;

			            dataChannelChatting.$messagesContainer.append([
			                '<li class="self" style="color: red;">',
			                recvMessage,
			                '</li>'
			            ].join(''));
						this.sendAiMessage(recvMessage,this.user.name);   
						dataChannelChatting.$messagesContainer.finish().animate({
						                scrollTop: dataChannelChatting.$messagesContainer.prop("scrollHeight")
						            }, 250);
						this.startTime = new Date();
						this.startFocusInterval(this.startTime);	
			}else if(type==="ai-other-stop"){
				if(this.teach === null) { console.log("nono"); return;}
				else{
					pauseModel();
					this.stopFocusInterval();
				}
			}
			else if(type ==="ai-other"){
		            dataChannelChatting.$messagesContainer.append([
                '<li class="other" style="color: red;">',
                recvMessage,
                '</li>'
            ].join(''));
			//console.log(this.user.name);
			webcamElement = document.querySelector(`#video-${this.user.name}`);
			
			
			     // `webcamElement`가 올바르게 설정되었는지 확인합니다.
			     if (!webcamElement) {
			         console.error('Video element not found');
			        return;
			     }
				 this.startTime = new Date();
				 this.startFocusInterval(this.startTime);
			     // 모델을 로드하고 예측을 시작합니다.
			     try {
			         const Model = await loadModel(); // 모델을 로드합니다.
					 run(Model, (result) => {
						this.sendAiResult(result)
					       
					         });
			     } catch (error) {
			         console.error('Error:', error);
			     }
        }else if(type ==="ai-outcome"){
			if (targetUserName === this.user.name)
			dataChannelChatting.$messagesContainer.append([
			               '<li class="other" style="color: green;">',
			               recvMessage,
			               '</li>'
			           ].join(''));
		}else if(type ==="ai-stop"){
			this.sendAiStopMsg(recvMessage,this.user.name);
		}
		else {
			
					dataChannelChatting.$messagesContainer.append([
							            '<li class="other">',
							            recvMessage,
							            '</li>'
							        ].join(''));
				
		    }
    },
    showNewFileMessage : function(file, type){

        // 이미지 요소 생성 및 설정
        //console.log(locationHost+"/file/"+file.fileName);
        
        var imgElement = $('<img>', {
            // src: file.type.includes("image") ? "https://"+locationHost+"/file/"+file.fileName : "https://"+locationHost+"/file/test.png",
            src: file.type.includes("image") ? "/file/"+file.fileName : "/file/test.png",
            width: 300,
            height: 300
        });
        imgElement.addClass(type);

        // 다운로드 버튼 요소 생성 및 설정
        var downBtnElement = $('<a>', {
            class: 'btn fa fa-download',
            id: 'downBtn',
            name: file.fileName,
            href: "/file/download/"+file.fileName
        });

        // contentElement 생성
        var contentElement = $('<li>').append(imgElement, downBtnElement);
        contentElement.addClass(type);

        // $messagesContainer에 contentElement 추가
        dataChannelChatting.$messagesContainer.append(contentElement);

    }
	
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("집중").addEventListener("click", function() {
        closeModal();
		resumeModel();
    });
});