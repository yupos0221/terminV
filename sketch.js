let pWindowWidth;
let orgWidth;
let orgHeight;
let capture;
// webカメラのロードフラグ
let videoDataLoaded = false;

let buttonRunning;
let buttonLoading;
let buttonView;
let buttonTrack;

let sliderVelocity;

let radioMode;

let onHandTracking = false;
let onView = false;

let handsfree;

const circleSize = 12;

const targetIndex = [4, 8, 12, 16, 20];
const palette = ["#9b5de5", "#f15bb5", "#fee440", "#00bbf9", "#00f5d4"];

// const note_colors = [{8:["C", (  0,   0, 255)], 12:["D", (  0, 255, 255)], 16:["E", (  0, 128,   0)], 20:["F", (  0, 255,   0)]},
//                      {8:["G", (255, 255,   0)], 12:["A", (128,   0, 128)], 16:["B", ( 128,  0, 255)], 20:["C", (  0,   0, 255)]}
//                     ];

const note_colors = [{8:["C", "#4040ff"], 12:["D", "#ffa040"], 16:["E", "#ff00ff"], 20:["F", "#00ff00"]},
                    {8:["G", "#0085ff"], 12:["A", "#fee440"], 16:["B", "#a000ff"], 20:["C", "#00f5d4"]}
                   ];

// const tones = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const leftTones = [["C3", "D3", "E3", "F3"], ["C4", "D4", "E4", "F4"], ["C5", "D5", "E5", "F5"]];
const rightTones = [["G3", "A3", "B3", "C4"], ["G4", "A4", "B4", "C5"], ["G5", "A5", "B5", "C6"]];
let toneShift = [1,1];
const singleTones = [["G3", "A3", "B3", "C4"], ["C4", "D4", "E4", "F4"], ["G4", "A4", "B4", "C5"]];

let oscLeft;
let oscRight;
const N = 16;
const keyWhite = [];
const keyBlack = [];
// const toneWhite = {0:"F3", 1:"G3", 2:"A3", 3:"B3", 4:"C4", 
//                 5:"D4", 6:"E4", 7:"F4", 8:"G4", 9:"A4", 10:"B4", 11:"C5",
//                 12:"D5", 13:"E5", 14:"F5", 15:"G5"};
// const toneBlack = {0:"F3", 1:"F#3", 2:"G#3", 3:"A#3", 4:"C4",
//                 5:"C#4", 6:"D#4", 7:"F4", 8:"F#4", 9:"G#4", 10:"A#4", 11:"C5",
//                 12:"C#5", 13:"D#5", 14:"F5", 15:"F#5"};

const toneWhite = {0:["F3", 174.614], 1:["G3", 195.998], 2:["A3", 220.000], 3:["B3", 246.942], 4:["C4", 261.626], 
                5:["D4", 293.665], 6:["E4", 329.628], 7:["F4", 349.228], 8:["G4", 391.995], 9:["A4", 440.000], 10:["B4", 493.883], 11:["C5", 523.251],
                12:["D5", 587.330], 13:["E5", 659.255], 14:["F5", 698.456], 15:["G5", 783.991]};
const toneBlack = {0:["F3", 174.614], 1:["F#3", 184.997], 2:["G#3", 207.652], 3:["A#3", 233.082], 4:["C4", 261.626],
                5:["C#4", 277.183], 6:["D#4", 311.127], 7:["F4",349.228], 8:["F#4", 369.994], 9:["G#4", 415.305], 10:["A#4", 466.164], 11:["C5", 523.251],
                12:["C#5", 554.365], 13:["D#5", 622.254], 14:["F5", 698.456], 15:["F#5", 739.989]};

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
    // let canvas = createCanvas(window.innerWidth, window.innerHeight*0.85);
    // let canvas = createCanvas(windowWidth, windowHeight*0.9);
    pWindowWidth = windowWidth;
    canvas.position(0, window.innerHeight/10);
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

  // handsfreeを開始
  // handsfree.enablePlugins('browser');
  // handsfree.plugin.pinchScroll.disable()
  // handsfree.start();
  
  sizeButton = [windowWidth/10, windowHeight/10];
  textSize(20);
  buttonRunning = createButton('Stop');
  buttonRunning.size(sizeButton[0], sizeButton[1]-20);
  buttonRunning.position(0, 5);
  
  buttonRunning.style("background", "#cc0000");
  buttonRunning.class('handsfree-show-when-stopped');
  buttonRunning.class('handsfree-hide-when-loading');
  buttonRunning.style("font-size: x-large");
  buttonRunning.mousePressed(() => {
    handsfree.start();
    playSound();
  });
  
  buttonLoading = createButton('...loading...');
  buttonLoading.size(sizeButton[0], sizeButton[1]-20);
  buttonLoading.position(0, 5);
  buttonLoading.style("font-size: x-large");
  buttonLoading.class('handsfree-show-when-loading');
  buttonLoading.style("background", "#cccc00");

  // Create a stop button
  buttonRunning = createButton('Running');
  buttonRunning.size(sizeButton[0], sizeButton[1]-20);
  buttonRunning.position(0, 5);
  buttonRunning.style("font-size: x-large");
  buttonRunning.class('handsfree-show-when-started');
  buttonRunning.style("background", "#00cc00");
  buttonRunning.mousePressed(() => handsfree.stop());

  buttonView = createButton("View off");
  buttonView.mousePressed(switchCameraView);
  buttonView.size(sizeButton[0], sizeButton[1]-20);
  buttonView.position(sizeButton[0], 5);
  buttonView.style("font-size: x-large");
  buttonView.style("background", "#cc0000");

  buttonTrack = createButton("Untrack");
  buttonTrack.mousePressed(switchHandTracking);
  buttonTrack.size(sizeButton[0], sizeButton[1]-20);
  buttonTrack.position(sizeButton[0]*2, 5);
  buttonTrack.style("background", "#cc0000");
  buttonTrack.style("font-size: x-large");

  sliderVelocity = createSlider(0, 1, 0.5, 0.01);
  sliderVelocity.position(sizeButton[0]*3+30, sizeButton[1]/2-15);
  
  radioMode = createRadio();
  radioMode.position(sizeButton[0]*3+30, sizeButton[1]/2+15);
  radioMode.option("Double hand");
  radioMode.option("Single hand");
  radioMode.selected("Double hand");

  // 映像を非表示化
  capture.hide();

  oscLeft = new p5.Oscillator('sine');
  oscRight = new p5.Oscillator('sine');
}

function draw() {
  if(onView){
    // 映像を左右反転させて表示
    push();
    translate(width, 0);
    scale(-1, 1);
    image(capture, 0, 0, width, height);
    pop();
  }else{
    background(128);
  }

  push();
  fill(250,250,250,128);
  
  for(let i=0; i < N; i++){
    w = i*width/N;
    rect(w+width*0.05/N,height*0.1,width*0.95/N, height*0.8);
    keyWhite[i] = [w,height*0.1,width/N, height*0.8];
  }
  
  fill(10)
  for(let i=0; i < N; i++){
    w = i*width/N;
    if(i!=0 && i!=4 && i!=7 && i!=11 && i!=14){
      
      fill(30, 30, 30, 200);
      rect(w-width*0.9/(2*N),height*0.1,width*0.9/N, height*0.4);
      keyBlack[i] = [w,height*0.1,width/N, height*0.8];
    }else{
      keyBlack[i] = [0, 0, 0, 0];
    }
    
    
  }
  pop();

  // 手の頂点を表示
  
  if(onHandTracking){
    if(radioMode.value() == "Double hand"){
      drawDoubleHands();
    }else if(radioMode.value() == "Single hand"){
    }
    
  }

  updateView();
}

function updateView(){
  if(pWindowWidth != windowWidth){
    // resizeCanvas(windowWidth, windowHeight);
    resizeCanvas(windowWidth, orgHeight * (windowWidth/orgWidth)*0.9);
    sizeButton = [windowWidth/10, windowHeight/10];
    buttonRunning.size(sizeButton[0], sizeButton[1]-20);
    buttonRunning.position(0, 5);
    buttonLoading.size(sizeButton[0], sizeButton[1]-20);
    buttonLoading.position(0, 5);
    buttonRunning.size(sizeButton[0], sizeButton[1]-20);
    buttonRunning.position(0, 5);
    buttonView.size(sizeButton[0], sizeButton[1]-20);
    buttonView.position(sizeButton[0], 5);
    buttonTrack.size(sizeButton[0], sizeButton[1]-20);
    buttonTrack.position(sizeButton[0]*2, 5);
    sliderVelocity.position(sizeButton[0]*3+30, sizeButton[1]/2-15);
    radioMode.position(sizeButton[0]*3+30, sizeButton[1]/2+15);
  }
  pWindowWidth = windowWidth;
}

function switchCameraView(){
  if(onView){
    buttonView.html("View off");
    buttonView.style("background", "#cc0000");
  }else{
    buttonView.html("View on");
    buttonView.style("background", "#00cc00");
  }
  onView = !onView;
}

function switchHandTracking(){
  if(onHandTracking){
    buttonTrack.html("Untrack");
    buttonTrack.style("background", "#cc0000");
  }else{
    buttonTrack.html("Track");
    buttonTrack.style("background", "#00cc00");
  }
  onHandTracking = !onHandTracking;
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
    label = handedness["label"] == 'Left' ? 1 : 0;
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
          break;
        case 21:
          let y = landmark.y*height;
          print(landmark.y, y, height/3);
          if(y < height/3){
            toneShift[label] = 2;
          }else if(y >= height/3 && y < height*2/3){
            toneShift[label] = 1;
          }else{
            toneShift[label] = 0;
          }
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

function playSound(){

  handsfree.on('finger-pinched-start-0-0', () => {
    if(onHandTracking){
      posX = handsfree.data.hands.curPinch[0][0].x;
      posY = handsfree.data.hands.curPinch[0][0].y;
      // console.log(posX, posY);
      oscLeft.start();
      oscLeft.amp(sliderVelocity.value());
      // oscLeft.freq(1100*(1-posX)+220);
      if(posY > 0.5){
        note = toneWhite[int((1-posX)*width/(width/N))][1];
      }else{
        note = toneBlack[int(((1-posX)*width-width*0.9/(2*N))/(width/N))+1][1];
      }

      oscLeft.freq(note);

    }

  })

  handsfree.on('finger-pinched-held-0-0', () => {
    if(onHandTracking){
      posX = handsfree.data.hands.curPinch[0][0].x;
      posY = handsfree.data.hands.curPinch[0][0].y;
      // console.log(posX, posY);

      oscLeft.amp(sliderVelocity.value());
      // oscLeft.freq(1100*(1-posX)+220);
      if(posY > 0.5){
        note = toneWhite[int((1-posX)*width/(width/N))][1];
      }else{
        note = toneBlack[int(((1-posX)*width-width*0.9/(2*N))/(width/N))+1][1];
      }
      
      console.log(note);
      oscLeft.freq(note);
    }
  })

  handsfree.on('finger-pinched-released-0-0', () => {
    oscLeft.stop();
  })

  handsfree.on('finger-pinched-start-1-0', () => {
    if(onHandTracking){
      posX = handsfree.data.hands.curPinch[1][0].x;
      posY = handsfree.data.hands.curPinch[1][0].y;
      console.log(posX, posY);
      oscRight.start();
      oscRight.amp(sliderVelocity.value());
      // oscRight.freq(1100*(1-posX)+220);
      if(posY > 0.5){
        note = toneWhite[int((1-posX)*width/(width/N))][1];
      }else{
        note = toneBlack[int(((1-posX)*width-width*0.9/(2*N))/(width/N))+1][1];
      }

      oscRight.freq(note);
    }

  })

  handsfree.on('finger-pinched-held-1-0', () => {
    if(onHandTracking){
      posX = handsfree.data.hands.curPinch[1][0].x;
      posY = handsfree.data.hands.curPinch[1][0].y;
      console.log(posX, posY);

      oscRight.amp(sliderVelocity.value());
      // oscRight.freq(1100*(1-posX)+220);
      if(posY > 0.5){
        note = toneWhite[int((1-posX)*width/(width/N))][1];
      }else{
        note = toneBlack[int(((1-posX)*width-width*0.9/(2*N))/(width/N))+1][1];
      }

      console.log(note);
      oscRight.freq(note);
    }
  })

  handsfree.on('finger-pinched-released-1-0', () => {
    oscRight.stop();
  })
}