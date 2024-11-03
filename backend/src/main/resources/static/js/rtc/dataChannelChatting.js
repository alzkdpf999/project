/*
* dataChannel 채팅을 위한 js
* */
const dataChannelChatting = {
    $element: $('.floating-chat'),
    $sendMessageBtn : $('#sendMessage'),
    $userTextInput :  $('.text-box'),
    $messagesContainer : $('.messages'),
	$aiModalBtn : $('#aiMessage'),
	$aiInput : $('.ai-box'),
	//$uuid : $('#uuid'),
    isCheckMinioPage : false,
    init: function() {
        const self = this; // 'self' 변수에 'this' 값을 할당
        setTimeout(function() {
            self.$element.addClass('enter');
        }, 1000);

        self.$element.click(self.openElement);
		//self.$aiInput.text("test");
        self.$userTextInput.on('keydown', function(event) {
            if (event.shiftKey && event.which === 13) {
                // shift + enter 사용 시 한줄 띄우기
            } else if (event.which === 13) {
                event.preventDefault(); // 기본 동작(한줄 띄우기)을 방지
                dataChannel.showNewMessage(self.parseMessage(self.$userTextInput), 'self');
            }
        });

        this.$sendMessageBtn.on("click", function(){
            dataChannel.showNewMessage(self.parseMessage(self.$userTextInput), 'self');
        });
		document.getElementById("startBtn").addEventListener("click", function(){
			console.log(self.$aiInput);
			console.log("click");
		    dataChannel.showNewMessage("ai시작합니다", 'ai');
			
		        });
		document.getElementById("stopBtn").addEventListener("click",function(){
			console.log("stop");
			dataChannel.showNewMessage("","ai-stop");
		});
	this.$aiModalBtn.on("click",function(){
		document.getElementById("focus-modal").style.display = "flex";
		//$('.overlay-containter').style.display="flex";
	})

    },
    openElement: function() {
        const self = dataChannelChatting;
        var messages = self.$element.find('.messages');
        self.$element.find('>i').hide();
        self.$element.addClass('expand');
        self.$element.find('.chat').addClass('enter');
        self.$element.off('click', self.openElement);
        self.$element.find('.header button').click(self.closeElement);
        messages.scrollTop(messages.prop("scrollHeight"));
    },
    closeElement: function() {
        const self = dataChannelChatting;
        self.$element.find('.chat').removeClass('enter').hide();
        self.$element.find('>i').show();
        self.$element.removeClass('expand');
        self.$element.find('.header button').off('click', self.closeElement);
        setTimeout(function() {
            self.$element.find('.chat').removeClass('enter').show();
            self.$element.click(self.openElement);
        }, 500);
    },
    parseMessage: function($userTextInput){
        return $userTextInput.html()
            .replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '')
            .trim()
            .replace(/\n/g, '<br>');
    }
}