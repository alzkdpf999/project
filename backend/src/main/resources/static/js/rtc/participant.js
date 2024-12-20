function addStudentItem(studentId, studentName, focusLevel) {
  // 새로운 학생 아이템 생성
  const studentItem = document.createElement("div");
  studentItem.classList.add("student-item");
  studentItem.id = studentId;

  // 학생 이름 및 집중도 레벨 추가
  studentItem.innerHTML = `
    <div class="name">${studentName}</div>
    <div class="focus-level">
      <span>집중도:</span>
      <div class="focus-bar">
        <div id= "focus-level-${studentName}" class="focus-bar-inner" style="width: ${focusLevel}%"></div>
      </div>
    </div>
  `;

  // students-list 컨테이너에 추가
  document.querySelector(".students-list").appendChild(studentItem);
}

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

/**
 * Creates a video element for a new participant
 *
 * @param {String} name - the name of the new participant, to be used as tag
 *                        name of the video element.
 *                        The tag of the new element will be 'video<name>'
 * @return
 */

function Participant(name) {
	//console.log("참여자명 : "+name)

	this.name = name;
	let rtcPeer = null;
	let localStream = null; // 유저의 로컬 스트림
	let container = document.createElement('div');

	let isMainParticipant = function(){
		return ($("#"+PARTICIPANT_MAIN_CLASS)).length === 0;
	}
	container.className = isMainParticipant() ?  PARTICIPANT_MAIN_CLASS : PARTICIPANT_CLASS;
	container.id = name;

	let span = document.createElement('span');
	let video = document.createElement('video');
	let audio  = document.createElement("audio");

	container.appendChild(video);
	container.appendChild(span);
	container.appendChild(audio);
	addVolumeControl(container, name);

	// container.onclick = switchContainerClass;
	// document.getElementById('participants').appendChild(container);
	$('#participants').append(container);
	updateGridLayout();

	span.appendChild(document.createTextNode(name));

	video.id = 'video-' + name;
	video.autoplay = true;
	video.controls = false;
	video.width="320";
	video.height="240";
	video.playsInline= true;
	audio.autoplay = true;

	if(name != 0)
	addStudentItem(name,name,100);
	
	/** set user LocalStream */
	this.setLocalSteam = function(stream){
		this.localStream = stream;
	}

	/** return user localStream */
	this.getLocalStream = function(){
		return this.localStream;
	}

	this.getElement = function() {
		return container;
	}

	this.getVideoElement = function() {
		return video;
	}

	this.getAudioElement = function() {
		return audio;
	}



	this.offerToReceiveVideo = function(error, offerSdp, wp){
		if (error) return console.error ("sdp offer error")
		//console.log('Invoking SDP offer callback function');
		let msg =  { id : "receiveVideoFrom",
			sender : name,
			sdpOffer : offerSdp
		};
		sendMessageToServer(msg);
	}


	this.onIceCandidate = function (candidate, wp) {
		//console.log("Local candidate" + JSON.stringify(candidate));
		let message = {
			id: 'onIceCandidate',
			candidate: candidate,
			name: name
		};
		sendMessageToServer(message);
	}

	Object.defineProperty(this, 'rtcPeer', { writable: true});

	this.dispose = function() {
		//console.log('Disposing participant ' + this.name);
		this.rtcPeer.dispose();
		container.parentNode.removeChild(container);
	};

	// Participant 클래스에 음량 조절 메서드 추가
	this.setVolume = function(volumeLevel) {
		let audioElement = this.getAudioElement();
		let videoElement = this.getVideoElement();
		if (audioElement && videoElement) {
			audioElement.volume = volumeLevel;
			videoElement.volume = volumeLevel;
		}
	};

	this.getLocalUser = function(){
		return document.getElementsByClassName(PARTICIPANT_MAIN_CLASS)[0].id;
	}
}

function addVolumeControl(container, name){
	// 복제하고자 하는 요소의 ID
	const originalElement = $('#volumeControl');

	// 요소를 복제합니다. jQuery 객체에서 DOM 엘리먼트를 가져옵니다.
	const volumeControl = originalElement[0].cloneNode(true); // 'true'를 추가하여 자식 노드도 복제합니다.

	volumeControl.type = 'range';

	// 복제된 요소의 ID를 변경 :: 고유한 ID 부여
	volumeControl.id = 'volumeControl_' + name;

	// 복제된 요소에 사용자 이름을 설정합니다.
	volumeControl.setAttribute('data-user-name', name);

	volumeControl.onchange = function(event) {

		let userName = this.getAttribute('data-user-name');

		const volumeLevel = parseFloat(this.value); // 슬라이더 값은 문자열이므로 숫자로 변환
		participants[userName].setVolume(volumeLevel); // 해당 참가자에 대해 음량을 조절
	};

	// 복제된 요소를 해당 위치에 추가합니다.
	container.appendChild(volumeControl);
}

// video on, off 기능
$(".localVideoToggle").on("click", function(){
	let videoBtn = $('.localVideoToggle');
	let isVideo = videoBtn.data("flag");
	let videoTrack = participants[name].rtcPeer.getLocalStream().getTracks().filter(track => track.kind === 'video')[0];

	if (isVideo) { // 비디오가 사용중이라면 비디오 off
		videoTrack.enabled = false;
		videoBtn.data("flag", false);
		videoBtn.attr("src", "/images/webrtc/video-off.svg")
	} else {
		videoTrack.enabled = true;
		
		videoBtn.data("flag", true);
		videoBtn.attr("src", "/images/webrtc/video-on.svg")
	}
});

// audio on, off 기능
$(".localAudioToggle").on("click", function(){
	let audioBtn = $(".localAudioToggle");
	let useAudio = audioBtn.data("flag");
	let audioTrack = participants[name].rtcPeer.getLocalStream().getTracks().filter(track => track.kind === 'audio')[0];

	if (useAudio) { // 오디오가 사용중이라면 오디오 off
		audioTrack.enabled = false;
		// audioBtn.val("Audio On");
		audioBtn.data("flag", false);
		audioBtn.attr("src", "/images/webrtc/audio-speaker-off.svg")
	} else {
		audioTrack.enabled = true;
		// audioBtn.val("Audio Off");
		audioBtn.data("flag", true);
		audioBtn.attr("src", "/images/webrtc/audio-speaker-on.svg")
	}
});

// "유저 설정" 버튼을 클릭할 때 모달을 설정합니다.
$('#userSetting').on('click', function (e) {
	let participantsList = $('#participantsList');
	
	participantsList.empty(); // 기존 목록을 비웁니다.

	// participants 객체를 반복하여 각 참가자에 대한 정보를 목록에 추가합니다.
	$.each(participants, function (name, participant) {
		console.log("asd")
		let listItem = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>');
		let localUser = participant.getLocalUser(); // 로컬 user 의 id 확인

		// 볼륨 조절 슬라이더의 ID
		let volumeSliderId = 'volumeControl_' + name;
		// 기존의 볼륨 컨트롤을 찾아서 복사합니다.
		let existingVolumeSlider = $('#' + volumeSliderId);
		// 기존의 볼륨 컨트롤이 있으면 복사하여 사용합니다.
		let volumeSlider = existingVolumeSlider.clone(true);

		// 비디오 및 오디오 컨트롤 버튼 복사 및 ID 수정
		let videoButtonId = 'videoBtn_' + name;
		let audioButtonId = 'audioBtn_' + name;

		if (localUser === name) { // 사용자 본인의 video, audio 설정
			listItem.text('You');

			let videoButton = $('#videoBtn').clone(true).attr('id', videoButtonId);
			let audioButton = $('#audioBtn').clone(true).attr('id', audioButtonId);

			videoButton.removeClass('col-md-1');
			audioButton.removeClass('col-md-1');

			listItem.append(videoButton, audioButton, volumeSlider);
		} else { // 다른 유저의 video, audio 설정
			listItem.text(name);

			// 비디오 컨트롤 버튼 clone 및 이벤트 할당
			let remoteVideoButton = $('#videoBtn').clone().attr('id', videoButtonId);
			// localVideoToggle class 삭제
			remoteVideoButton.removeClass('localVideoToggle');
			// col-md-1 삭제
			remoteVideoButton.removeClass('col-md-1')
			// 클릭 이벤트 할당
			remoteVideoButton.click(function(){
				let useRemoteVideo = remoteVideoButton.data('flag')
				// 비디오 트랙만 가져오기
				let videoTrack = participant.rtcPeer.getRemoteStream().getTracks().filter(track => track.kind === 'video')[0];

				if (useRemoteVideo) { // 비디오가 사용중이라면 비디오 off : enabled = false
					videoTrack.enabled = false;
					// remoteVideoButton.val("Video On");
					remoteVideoButton.data('flag', false);
					remoteVideoButton.attr('src', '/images/webrtc/video-off.svg')
				} else {
					videoTrack.enabled = true;
					// remoteVideoButton.val("Video Off");
					remoteVideoButton.data('flag', true);
					remoteVideoButton.attr('src', '/images/webrtc/video-on.svg')
				}
			})

			// 다른 참여자(유저)의 오디오 컨트롤 버튼 clone 및 이벤트 할당
			let remoteAudioButton = $('#audioBtn').clone().attr('id', audioButtonId);
			// localAudioToggle class 삭제
			remoteAudioButton.removeClass('localAudioToggle');
			// col-md-1 삭제
			remoteAudioButton.removeClass('col-md-1');
			// 클릭 이벤트 할당
			remoteAudioButton.click(function(){
				let useRemoteVideo = remoteAudioButton.data('flag')
				// 오디오 트랙만 가져오기
				let audioTrack = participant.rtcPeer.getRemoteStream().getTracks().filter(track => track.kind === 'audio')[0];

				if (useRemoteVideo) { // 오디오가 사용중이라면 오디오 off : enabled = false
					audioTrack.enabled = false;
					// remoteAudioButton.val("Audio On");
					remoteAudioButton.data('flag', false);
					remoteAudioButton.attr('src', '/images/webrtc/audio-speaker-off.svg')
				} else {
					audioTrack.enabled = true;
					// remoteAudioButton.val("Audio Off");
					remoteAudioButton.data('flag', true);
					remoteAudioButton.attr('src', '/images/webrtc/audio-speaker-on.svg')

				}
			})

			listItem.append(remoteVideoButton, remoteAudioButton, volumeSlider);
		}

		participantsList.append(listItem);
	});
});

function updateGridLayout() {
	let participantsDiv = document.getElementById('participants');
	let totalParticipants = participantsDiv.childElementCount;

	// Remove all layout classes
	['one', 'two', 'three'].forEach(function(cls) {
		participantsDiv.classList.remove(cls);
	});

	// Assign the appropriate layout class
	if (totalParticipants === 1) {
		participantsDiv.classList.add('one');
	} else if (totalParticipants === 2) {
		participantsDiv.classList.add('two');
	} else if (totalParticipants === 3) {
		participantsDiv.classList.add('three');
	}
}