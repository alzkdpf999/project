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
    console.log(prediction.dataSync());
}

// 웹캠과 모델을 바로 사용
async function run(model) {
    if (!webcamElement) {
        console.error('Webcam element is not defined');
        return;
    }

    const predictionInterval = 500; // 예측을 매 500ms마다 수행 (2 FPS)
    
    // 예측을 반복적으로 수행
    function predictLoop() {
        predict(model);
        setTimeout(predictLoop, predictionInterval);
    }

    // 예측 시작
    predictLoop();
}

// 버튼 클릭 시 run() 실행
startButton.addEventListener('click', async () => {
    // webcamElement = document.querySelector('#video-0');
    
    // // `webcamElement`가 올바르게 설정되었는지 확인합니다.
    // if (!webcamElement) {
    //     console.error('Video element not found');
    //     return;
    // }

    // // 모델을 로드하고 예측을 시작합니다.
    // try {
    //     const model = await loadModel(); // 모델을 로드합니다.
    //     run(model); // 모델을 사용하여 예측을 실행합니다.
    // } catch (error) {
    //     console.error('Error:', error);
    // }
    console.log("테스트");
});
