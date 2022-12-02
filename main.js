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