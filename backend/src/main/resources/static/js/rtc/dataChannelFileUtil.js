/**
 * DataChannel 로 file 다루기 위한 util js
 */
const dataChannelFileUtil = {
    isinit: false,
    init: function () {
        let self = this;
        if (!self.isinit) {
            $('#uploadFile').on('click', function () {
                $('#file').click();
            });

            $('#file').on('change', function () {
                // 파일선택으로 change 되면 실행
                self.uploadFile();
            })

            self.isinit = true;
        }

    },
    uploadFile: function () {

        // 1. 다른 사용자에게 파일 전송
        var file = $('#file')[0].files[0];
       	
        if (!file) {
            console.log('No file chosen');
        }else{
        	console.log(file);
        }
        
        var formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', roomId);
        console.log("asdasd",roomId);
		console.log(formData);
        let option = {
            method: 'POST',
            body: formData
        }
        fetch("/file/upload", option)
            .then(response => response.json()).then(response=>{
                var fileData = {
                    type: "file",
                    roomId: roomId,
                    fileMeta: response
                };
                dataChannel.sendFileMessage(fileData);
            })
            .catch(error => console.error(error));


    },
    downloadFile: function (fileName) {
        console.log("실행이 되니");
        fetch("/file/download/"+fileName)
            .catch(error => console.error(error));

    }
}