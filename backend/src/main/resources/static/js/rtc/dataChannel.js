/**
 * DataChannel 을 다루기 위한 js
 */

// HTML 요소 참조
let webcamElement = null;
const startButton = document.getElementById('startButton');

// 모델 로드
async function loadModel() {
    const model = await tf.loadGraphModel('../../model/model.json');
    console.log("Model loaded successfully.");
    return model;
}
// 실시간 예측 함수
async function predict(model) {
    const webcamImage = tf.browser.fromPixels(webcamElement);
    const resizedImage = tf.image.resizeBilinear(webcamImage, [224, 224]);
    const normalizedImage = resizedImage.div(255.0).expandDims(0);
    
    const prediction = await model.predict(normalizedImage);
    //console.log(prediction.dataSync());
	let result = prediction.dataSync();
	let predictedClass = result[0] > result[1] ? 0 : 1;
	

	
	//saveImage(resizedImage);  // webcamImage를 저장
	
	return predictedClass;
	 
}
let a= 0;
// 웹캠과 모델을 바로 사용
const alarmAudio = document.getElementById("alarmAudio");
function openModal() {
  document.getElementById("딴짓알림모달").style.display = "flex";
  alarmAudio.play();
  
}

function closeModal() {
  document.getElementById("딴짓알림모달").style.display = "none";
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("집중").addEventListener("click", function() {
        closeModal();
    });
});
async function run(model, callback) {
    if (!webcamElement) {
        console.error('Webcam element is not defined');
        return;
    }

    const predictionInterval = 100; // 예측을 매 500ms마다 수행 (2 FPS)
    
    // 예측을 반복적으로 수행
    async function predictLoop() {
       const result = await predict(model);
	   if (result == "0"){
		console.log("test");
		a+=1;
		if (a===10){
			openModal();
		}
	   }
	   callback(result)
       setTimeout(predictLoop, predictionInterval);
		
    }

    // 예측 시작
    predictLoop();
}


const dataChannel = {
    user : null,
	teach :null,
	userPeers: {},
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
		console.log(this.userPeers); // 확인용

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
			console.log("asd")
            let message = recvMessage.userName + " : " + recvMessage.message;
            this.showNewMessage(message, "other");
        }else if (recvMessage.type == "ai-message"){
	
			this.teach = recvMessage.teachName;
			console.log(this.teach);
			let message = recvMessage.userName + " : " + recvMessage.message;
			this.showNewMessage(message, "ai-other");
		}else if(recvMessage.type == "ai-result"){
			
			this.showNewMessage(`예측결과(${recvMessage.userName}) :`+ recvMessage.result, "ai-outcome",recvMessage.teachName);
		}
    },
    handleDataChannelError: function(error) {
        if (this.isNullOrUndefined(error)) return;
        console.error("dataChannel.OnError:", error);
    },
    handleDataChannelClose: function(leaveEvent, event) {
        if (this.isNullOrUndefined(event)) return;
        // console.log("dataChannel.OnClose", event);
    },
    sendMessage: function(message) {
        if (this.isNullOrUndefined(message)) return;
        let messageData = {
            type : "message",
            userName : this.user.name,
            message : message
        }
		console.log(this.user.rtcPeer);
        this.user.rtcPeer.send(JSON.stringify(messageData));
        
    },
	sendAiResult : function(outcome){
		//if (this.isNullOrUndefined(message)) return;
		let messageData = {
			            type : "ai-result",
						userName : this.user.name,
						teachName : this.teach,
						result : outcome
			        }
		this.user.rtcPeer.send(JSON.stringify(messageData));
	},
	sendAiMessage: function(message) {
	        if (this.isNullOrUndefined(message)) return;
			console.log(this.user.name);
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
			console.log("self");
			this.sendMessage(recvMessage);
            

            // clean out old message
            dataChannelChatting.$userTextInput.html('');

            // focus on input
            dataChannelChatting.$userTextInput.focus();

            dataChannelChatting.$messagesContainer.finish().animate({
                scrollTop: dataChannelChatting.$messagesContainer.prop("scrollHeight")
            }, 250);

        } else if(type === "ai"){
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
			}
			else if(type ==="ai-other"){
		            dataChannelChatting.$messagesContainer.append([
                '<li class="other" style="color: red;">',
                recvMessage,
                '</li>'
            ].join(''));
			console.log(this.user.name);
			 webcamElement = document.querySelector(`#video-${this.user.name}`);
	
			     // `webcamElement`가 올바르게 설정되었는지 확인합니다.
			     if (!webcamElement) {
			         console.error('Video element not found');
			        return;
			     }

			     // 모델을 로드하고 예측을 시작합니다.
			     try {
			         const model = await loadModel(); // 모델을 로드합니다.
					 run(model, (result) => {
						this.sendAiResult(result)
					             console.log("예측 결과:", result);
					             // 여기서 result를 이용해 추가적인 로직을 작성할 수 있습니다.
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
        console.log(locationHost+"/file/"+file.fileName);
        
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