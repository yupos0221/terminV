// ページ読み込み時シンセ生成
var synth;
window.onload = function(){
  synth = new Tone.Synth().toMaster();
}

// マウスを押した時のイベント処理
window.addEventListener('mousedown', playSound);
window.addEventListener('touchstart', playSound);


function playSound(e) {
  
  // マウスのdata属性を取得
  var key = e.target.dataset.key;
  
  // keyがundefinedなら処理を実行しない
  if (typeof key === "undefined") return;  
  
  // 音名を代入する
  synth.triggerAttackRelease(key, '8n');
    
}

function play(){
    synth.triggerAttackRelease("C4", "4n");
}

const note_colors = [{8:["C", "#4040ff"], 12:["D", "#ffa040"], 16:["E", "#ff00ff"], 20:["F", "#00ff00"]},
                    {8:["G", "#0085ff"], 12:["A", "#fee440"], 16:["B", "#a000ff"], 20:["C", "#00f5d4"]}
                   ];
const circleSize = 12;

function setup() {
  // createCanvas(640, 480);
  capture = createCapture(VIDEO);
  // createCanvas(capture.width, capture.height);
  // 映像をロードできたらキャンバスの大きさを設定
  capture.elt.onloadeddata = function () {
    videoDataLoaded = true;
    orgWidth = capture.width;
    orgHeight = capture.height;
    let canvas = createCanvas(capture.width, capture.height);
    // let canvas = createCanvas(windowWidth, orgHeight * (windowWidth/orgWidth)*0.9);
    // let canvas = createCanvas(window.innerWidth*(window.innerHeight/orgHeight), window.innerHeight*0.85);
    // let canvas = createCanvas(windowWidth, windowHeight*0.9);
    pWindowWidth = windowWidth;
    canvas.position(0, window.innerHeight/10);
    console.log(capture.width, capture.height);
  };

  

  // handsfreeのhandモデルを準備
  handsfree = new Handsfree({
    // showDebug: true,
    hands: true,
    // The maximum number of hands to detect [0 - 4]
    maxNumHands: 2,

    // Minimum confidence [0 - 1] for a hand to be considered detected
    minDetectionConfidence: 1.0,

    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 1.0
  });
  // 映像を非表示化
  capture.hide();
  handsfree.start()
}

function draw() {

  // 映像を左右反転させて表示
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  pop();

  var ul = document.getElementById("keyboard");
  ul.style.display = "";

  var ul_element = document.createElement('ul');

  for(var i=1; i<=5; i++) {
    var li_element = document.createElement('li');
    li_element.textContent = 'テキスト' + i;
    ul_element.appendChild(li_element);
}

  
  // 手の頂点を表示
  drawDoubleHands();
  playDoubleHandsSound();

    
    

}

function drawDoubleHands() {
  
  const hands = handsfree.data?.hands;

  // 手が検出されなければreturn
  if (!hands?.multiHandLandmarks) return;

  const zip = (array1, array2) => array1.map((_, i) => [array1[i], array2[i]]);
  zip(hands.multiHandLandmarks, hands.multiHandedness).forEach(([hand, handedness]) => {
    
  // });

  // // 手の数だけlandmarkの地点にcircleを描写
  // hands.multiHandLandmarks.forEach((hand, handIndex) => {
    let label = handedness["label"] == 'Left' ? 1 : 0;
    hand.forEach((landmark, landmarkIndex) => {
      // 指先だけ色を変更
      push();
      switch (landmarkIndex) {
        case 4:
          fill("#9b5de5");
          circle(width - landmark.x * width, landmark.y * height, circleSize*2);
          break;
        case 8:
        // case 12:
        // case 16:
        // case 20:
          fill(note_colors[label][landmarkIndex][1]);
          circle(width - landmark.x * width, landmark.y * height, circleSize*2);
          fill("#000000");
          break;
        case 21:
          let y = landmark.y*height;
          print(landmark.y, y, height/3);
          fill(color(255, 255, 255));
          circle(width - landmark.x * width, landmark.y * height, circleSize);
          break;
        default:
          fill(color(255, 255, 255));
          circle(width - landmark.x * width, landmark.y * height, circleSize);
      }
      pop();
    });
  });

  
}

function playDoubleHandsSound(){
  const hands = handsfree.data?.hands;
  if (!hands?.multiHandLandmarks) return;

  // index, middle, ring, pinky
  const leftHandPinch  = hands.pinchState[0]
  const rightHandPinch = hands.pinchState[1]

  let tone_array = [];
  leftHandPinch.forEach((handPinch, index) => {
    if (handPinch == "start"){
      console.log("left", handPinch, index);
    }else if(handPinch == "held"){
      console.log("left", handPinch, index);
    }else if(handPinch == "released"){
      console.log("left", handPinch, index);
    }
    
  });

  rightHandPinch.forEach((handPinch, index) => {
    if (handPinch == "start"){
      console.log("right", handPinch, index);      
    }else if(handPinch == "held"){
      console.log("right", handPinch, index);      
    }else if(handPinch == "released"){
      console.log("right", handPinch, index);      
    }
  });


} 

