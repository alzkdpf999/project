
let locationHost = location.host
let participants = {};

let name = null;
let roomId = null;
let roomName = null;

// turn Config
// let turnUrl = null;
// let turnUser = null;
// let turnPwd = null;

//let origGetUserMedia;

// websocket 연결 확인 후 register() 실행
var ws = new WebSocket('wss://' + locationHost + '/signal');
ws.onopen = () => {
    //initTurnServer();
    register();
    initDataChannel();
}

console.log(locationHost);

var initDataChannel = function () {
    dataChannel.init();
    dataChannelChatting.init();
    dataChannelFileUtil.init();
}

let constraints = {
    audio: {
        autoGainControl: true,
        channelCount: 2,
        echoCancellation: true,
        latency: 0,
        noiseSuppression: true,
        sampleRate: 48000,
        sampleSize: 16,
        volume: 0.5
    },
    video: {
        width: 1280,
        height: 720,
        maxFrameRate: 50,
        minFrameRate: 40
    }
};



ws.onmessage = function (message) {
    var parsedMessage = JSON.parse(message.data);
    // console.info('Received message: ' + message.data);

    switch (parsedMessage.id) {
        case 'existingParticipants':
            onExistingParticipants(parsedMessage);
            console.log("existingParticipants");
            break;
        case 'newParticipantArrived':
            onNewParticipant(parsedMessage);
            console.log("newParticipantArrived");
            break;
        case 'participantLeft':
            onParticipantLeft(parsedMessage);
            console.log("participantLeft");
            break;
        case 'receiveVideoAnswer':
            receiveVideoResponse(parsedMessage);
            console.log("receiveVideoAnswer");
            break;
        case 'iceCandidate':
            console.log("iceCandidate");
            participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
                if (error) {
                    console.error("Error adding candidate: " + error);
                    return;
                }
            });
            break;
        case 'ConnectionFail': // 연결 실패 메시지 처리

            // 모달을 표시
            $('#connectionFailModal').modal('show');

            // 모달의 확인 버튼에 클릭 이벤트 핸들러를 연결
            $('#reconnectButton').click(function () {
                leaveRoom('error');
            });
            break;
        case "sharing":
            // if ($("#uuid").val != parsedMessage.name){
            $("#screenShareBtn").removeAttr("onclick");
            //console.log(parsedMessage.name + "으로부터 공유중입니다");
            // }else{
            //     $("#screenShareBtn").attr("disabled",false)
            // }

            break;
        case "stopShare":
            $("#screenShareBtn").attr("onclick", "screenShare()")
            break;
        case "recording":
            alert("녹화중");
            break;
        case "stopRec":
            console.log(name);
            console.log(parsedMessage);
            stopRecDownload(parsedMessage);
        case "stopped":
            break;
        case "paused":
            break;
        default:
            console.error('Unrecognized message', parsedMessage);
    }
}



function register() {

    name = $("#uuid").val();
    roomId = $("#roomId").val();
    roomName = $("#roomName").val();

    document.getElementById('room-header').innerText = 'ROOM ' + roomName;
    document.getElementById('room').style.display = 'block';


    var message = {
        id: 'joinRoom',
        name: $("#uuid").val(),
        room: roomId,
    }
    sendMessageToServer(message);
}

function onNewParticipant(request) {
    receiveVideo(request.name);
}

function receiveVideoResponse(result) {
    participants[result.name].rtcPeer.processAnswer(result.sdpAnswer, function (error) {
        if (error) return console.error(error);
    });
}

function callResponse(message) {
    if (message.response != 'accepted') {
        console.info('Call not accepted by peer. Closing call');
        stop();
    } else {
        webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
            if (error) return console.error(error);
        });
    }
}




function onExistingParticipants(msg) {

    var participant = new Participant(name);
    participants[name] = participant;
    dataChannel.initDataChannelUser(participant);
    var video = participant.getVideoElement();
    var audio = participant.getAudioElement();

    function handleSuccess(stream) {

        var options = {
            localVideo: video,
            localAudio: audio,
            mediaStream: stream,
            mediaConstraints: constraints,
            onicecandidate: participant.onIceCandidate.bind(participant),
            dataChannels: true, // dataChannel 사용 여부
            dataChannelConfig: { // dataChannel event 설정
                id: dataChannel.getChannelName,
                onmessage: dataChannel.handleDataChannelMessageReceived,
                onerror: dataChannel.handleDataChannelError
            },
            //configuration: {
                //iceServers: [
                  //  {urls: 'turn:54.180.102.69:3478?transport=udp', username: 'test', credential: 'test'}
                //]
            //}
        };

        participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
            function (error) {
                if (error) {
                    return console.error(error);
                }

                this.generateOffer(participant.offerToReceiveVideo.bind(participant));
                mediaDevice.init(); // video 와 audio 장비를 모두 가져온 후 mediaDvice 장비 영역 세팅
            });

        msg.data.forEach(receiveVideo);
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(handleSuccess)

}

function receiveVideo(sender) {
    var participant = new Participant(sender);
    participants[sender] = participant;
    var video = participant.getVideoElement();
    var audio = participant.getAudioElement();

    var options = {
        remoteVideo: video,
        remoteAudio: audio,
        onicecandidate: participant.onIceCandidate.bind(participant),
        dataChannels: true, // dataChannel 사용 여부
        dataChannelConfig: { // dataChannel event 설정
            id: dataChannel.getChannelName,
            onopen: dataChannel.handleDataChannelOpen,
            onclose: dataChannel.handleDataChannelClose,
            onmessage: dataChannel.handleDataChannelMessageReceived,
            onerror: dataChannel.handleDataChannelError
        },
        //configuration: {
//iceServers: [
                   // {urls: 'turn:54.180.102.69:3478?transport=udp', username: 'test', credential: 'test'}
               // ]
           // }
        
    }

    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
        function (error) {
            if (error) {
                return console.error(error);
            }
            this.generateOffer(participant.offerToReceiveVideo.bind(participant));
        });

    participant.rtcPeer.peerConnection.onaddstream = function (event) {
        audio.srcObject = event.stream;
        video.srcObject = event.stream;
    };
}

var leftUserfunc = function () {
    // 서버로 연결 종료 메시지 전달
    sendMessageToServer({
        id: 'leaveRoom'
    });

    // 진행 중인 모든 연결을 종료
    for (let key in participants) {
        if (participants.hasOwnProperty(key)) {
            participants[key].dispose();
        }
    }

    // WebSocket 연결을 종료합니다.
    ws.close();
}

// 웹 종료 or 새로고침 시 이벤트
window.onbeforeunload = function () {
    if (self.screenTop > 9000 || document.readyState == "loading") {
        leaveRoom();
    }
    else if (document.readyState == "complete") {
        console.log("새로고침")
    }
};

// 나가기 버튼 눌렀을 때 이벤트
// 결국 replace  되기 때문에 얘도 onbeforeunload 를 탄다
$('#button-leave').on('click', function () {
    sendDataChannelMessage(" 님이 떠나셨습니다ㅠㅠ");
    leftUserfunc();
    location.replace('/');
});

function leaveRoom(type) {
    if (type !== 'error') { // type 이 error 이 아닐 경우에만 퇴장 메시지 전송
        sendDataChannelMessage(" 님이 떠나셨습니다ㅠㅠ");
    }
    setTimeout(leftUserfunc, 10);
}

function stopRecDownload(msg) {
    var downBtnElement = $('<a>', {
        class: 'btn fa fa-download',
        id: 'downBtn',
        name: file.fileName,
        href: "/file/download/" + msg.fileName,
        style: "display: none"
    });

    downBtnElement.appendTo("body");

    downBtnElement.get(0).click();
    downBtnElement.remove();

}

function onParticipantLeft(request) {

    var participant = participants[request.name];
    //console.log('Participant ' + request.name + ' left');
    participant.dispose();
    delete participants[request.name];
}

function sendMessageToServer(message) {
    var jsonMessage = JSON.stringify(message);
    //console.log('Sending message: ' + jsonMessage);
    ws.send(jsonMessage);
}

// 메시지를 데이터 채널을 통해 전송하는 함수
function sendDataChannelMessage(message) {
    if (participants[name].rtcPeer.dataChannel.readyState === 'open') {
        dataChannel.sendMessage(message);
    } else {
        console.warn("Data channel is not open. Cannot send message.");
    }
}

/** 화면 공유 실행 과정
 * 나와 연결된 다른 peer 에 나의 화면을 공유하기 위해서는 다른 peer 에 보내는 Track 에서 stream 을 교체할 필요가 있다.
 * Track 이란 현재 MediaStream 을 구성하는 각 요소를 의미한다.
 *    - Track 는 오디오, 비디오, 자막 총 3개의 stream 으로 구성된다.
 *    - 때문에 Track 객체는 track[0] = 오디오, track[1] = 비디오 의 배열 구조로 되어있다
 * MediaStream 이란 video stream 과 audio steam 등의 미디어 스트림을 다루는 객체를 이야기한다
 * - stream(스트림)이란 쉽게 생각하자면 비디오와 오디오 데이터라고 이해하면 될 듯 하다 -
 *
 * 즉 상대방에게 보내는 track 에서 나의 웹캠 videoStream 대신 공유 화면에 해당하는 videoStream 으로 변경하는 것이다.
 *
 * 더 구체적으로는 아래 순서를 따른다.
 *
 * 1. startScreenShare() 함수를 호출합니다.
 * 2. ScreenHandler.start() 함수를 호출하여 shareView 변수에 화면 공유에 사용될 MediaStream 객체를 할당합니다.
 * 3. 화면 공유 화면을 로컬 화면에 표시합니다.
 * 4. 연결된 다른 peer에게 화면 공유 화면을 전송하기 위해 RTCRtpSender.replaceTrack() 함수를 사용하여 연결된 다른 peer에게 전송되는 비디오 Track을 shareView.getVideoTracks()[0]으로 교체합니다.
 * 5. shareView 객체의 비디오 Track이 종료되는 경우, stopScreenShare() 함수를 호출하여 화면 공유를 중지합니다.
 * 5. stopScreenShare() 함수에서는 ScreenHandler.end() 함수를 호출하여 shareView 객체에서 발생하는 모든 Track에 대해 stop() 함수를 호출하여 스트림 전송을 중지합니다.
 * 6. 원래 화면으로 되돌리기 위해 연결된 다른 peer에게 전송하는 Track을 로컬 비디오 Track으로 교체합니다.
 * 즉, 해당 코드는 WebRTC 기술을 사용하여 MediaStream 객체를 사용해 로컬에서 받은 Track을 다른 peer로 전송하고, replaceTrack() 함수를 사용하여 비디오 Track을 교체하여 화면 공유를 구현하는 코드입니다.
 * **/

// 화면 공유를 위한 변수 선언
const screenHandler = new ScreenHandler();
let shareView = null;
let sharing = false;
/**
 * ScreenHandler 클래스 정의
 */
function ScreenHandler() {
    /**
     * Cross Browser Screen Capture API를 호출합니다.
     * Chrome 72 이상에서는 navigator.mediaDevices.getDisplayMedia API 호출
     * Chrome 70~71에서는 navigator.getDisplayMedia API 호출 (experimental feature 활성화 필요)
     * 다른 브라우저에서는 screen sharing not supported in this browser 에러 반환
     * @returns {Promise<MediaStream>} 미디어 스트림을 반환합니다.
     */
    function getCrossBrowserScreenCapture() {
        if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia({ video: true });
        } else if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia({ video: true });
        } else {
            throw new Error('Screen sharing not supported in this browser');
        }
    }

    /**
     * 화면 공유를 시작합니다.
     * @returns {Promise<MediaStream>} 화면 공유에 사용되는 미디어 스트림을 반환합니다.
     */
    async function start() {
        try {
            shareView = await getCrossBrowserScreenCapture();
        } catch (err) {
            console.log("여기서 잡히나");
            let participant = participants[name];
            let video = participant.getVideoElement();
            participant.setLocalSteam(video.srcObject);
        }
        return shareView;
    }

    /**
     * 화면 공유를 종료합니다.
     */
    function end() {
        if (shareView) {
            // shareView에서 발생하는 모든 트랙들에 대해 stop() 함수를 호출하여 스트림 전송 중지
            shareView.getTracks().forEach(track => track.stop());
            shareView = null;
        }
    }

    // 생성자로 반환할 public 변수 선언
    this.start = start;
    this.end = end;
}

/**
 * 스크린 API를 호출하여 원격 화면을 화면 공유 화면으로 교체합니다.
 * @returns {Promise<void>}
 */
async function startScreenShare() {
    await screenHandler.start(); // 화면 공유를 위해 ScreenHandler.start() 함수 호출
    let participant = participants[name];
    console.log(name + "화면 공유 시작한 사람");
    let video = participant.getVideoElement();
    console.log(video.srcObject);
    participant.setLocalSteam(video.srcObject);
    //video.srcObject = shareView; // 본인의 화면에 화면 공유 화면 표시

    // 서버에 공유중이라고 보내기
    var message = {
        id: 'startShare',
        name: $("#uuid").val(),
        room: roomId,
    }
    sendMessageToServer(message);

    if (shareView.getVideoTracks()[0] == null) {
        video.srcObject = participant.getLocalSteam();
    } else {
        video.srcObject = shareView;
    }
    await participant.rtcPeer.peerConnection.getSenders().forEach(sender => {
        // 원격 참가자에게도 화면 공유 화면을 전송하도록 RTCRtpSender.replaceTrack() 함수 호출
        if (sender.track.kind === 'video') {
            if (shareView.getVideoTracks()[0] == null) {
                sender.replaceTrack(participant.getLocalSteam().getVideoTracks()[0]);
            } else {
                sender.replaceTrack(shareView.getVideoTracks()[0]);
            }

        }
    });

    // 원격 화면의 화면 공유가 종료되는 경우
    shareView.getVideoTracks()[0].addEventListener("ended", () => {
        stopScreenShare();
    })
}

/**
 * 화면 공유를 중지하고 기존 화상채팅으로 복원합니다.
 * @returns {Promise<void>}
 */
async function stopScreenShare() {
    await screenHandler.end(); // 화면 공유를 중지하기 위해 ScreenHandler.end() 함수 호출
    console.log(name + "화면 공유 종료한 사람");
    let participant = participants[name];
    let video = participant.getVideoElement();
    //여기서 
    console.log(participant.getLocalStream() + " participant.getLocalStream()");

    video.srcObject = participant.getLocalStream(); // 본인의 화면을 원래의 원격 화면으로 복원
    await participant.rtcPeer.peerConnection.getSenders().forEach(sender => {
        // 원격 참가자에게도 화면 공유를 중지하도록 RTCRtpSender.replaceTrack() 함수 호출
        if (sender.track.kind === 'video') {
            sender.replaceTrack(participant.getLocalStream().getVideoTracks()[0]);
        }
    });
    var message = {
        id: "stopShare",
        name: $("#uuid").val(),
        room: roomId
    }

    sendMessageToServer(message);

    // 화면 공유 버튼을 초기화
    let screenShareBtn = $("#screenShareBtn");
    screenShareBtn.val("Share Screen");
    screenShareBtn.data("flag", false);
}

/**

 화면 공유 버튼을 누르면 화면 공유를 시작하거나 중지합니다.
 @returns {Promise<void>}
 */
async function screenShare() {
    let screenShareBtn = $("#screenShareBtn");
    let isScreenShare = screenShareBtn.data("flag");

    if (isScreenShare) { // 이미 화면 공유 중인 경우
        await stopScreenShare(); // 화면 공유 중지
        // screenShareBtn.val("Share Screen"); // 버튼 텍스트 초기화
        screenShareBtn.data("flag", false);
        screenShareBtn.attr("src", "/images/webrtc/screen-share-on.svg")
    } else { // 화면 공유 중이 아닌 경우
        await startScreenShare(); // 화면 공유 시작
        // screenShareBtn.val("Stop Sharing"); // 버튼 텍스트 변경
        screenShareBtn.data("flag", true);
        screenShareBtn.attr("src", "/images/webrtc/screen-share-off.svg")
    }
}

function startChroma() {
    console.log("버튼 눌럿어");
    //let chromaBtn = $("#chroma");
    //var message = {
    //      id: "startChroma",
    //    name: $("#uuid").val(),
    //  room: roomId
    //}

    var message = {
        id: "recording",
        name: $("#uuid").val(),
        room: roomId,
        mode: $('input[name="mode"]:checked').val()
    }
    sendMessageToServer(message);
}
function stop() {
    // var message = {
    //   id: "stopChroma",
    // name: $("#uuid").val(),
    //room: roomId
    //}

    var message = {
        id: "stopRec",
        name: $("#uuid").val(),
        room: roomId
    }
    sendMessageToServer(message);
}