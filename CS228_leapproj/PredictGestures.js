const knnClassifier = ml5.KNNClassifier();
nj.config.printThreshold = 1000;
var trainingCompleted = false;
var predictedClassLabels = nj.zeros([1,test.shape[3]]);
var controllerOptions = {};
var testingSampleIndex = 0;
var currentNumHands = 0;


Leap.loop(controllerOptions,function (frame) {

    currentNumHands = frame.hands.length;
    clear();


    if (trainingCompleted == false){
        Train();

    }
    HandleFrame(frame);
    Test();



});

function Train(){
    for(var i =0; i<train4.shape[3];++i){

        //train4
        var features = train4.pick(null,null,null,i);
        features = features.reshape(1,120);
        knnClassifier.addExample(features.tolist(),4);

        //train 5
        var featuresOne = train5.pick(null,null,null,i);
        featuresOne = featuresOne.reshape(1,120);
        knnClassifier.addExample(featuresOne.tolist(),5);

    }
    trainingCompleted = true;


}

function Test() {
    var firstFeatures = test.pick(null,null,null,testingSampleIndex);
    var currentFeatures = firstFeatures.reshape(1,120);
    knnClassifier.classify(currentFeatures.tolist(),GotResults);
}


function GotResults(err, result){
    predictedClassLabels.set(testingSampleIndex,parseInt(result.label));
    //console.log(predictedClassLabels.get(testingSampleIndex).toString());
    console.log(result.label);
    if(testingSampleIndex>test.shape[3]-2){
        testingSampleIndex=0;
    }
    else{
        testingSampleIndex++;
    }
}


function HandleFrame(frame) {
    var iBox = frame.interactionBox;
    if(frame.hands.length == 1 || frame.hands.length == 2){
        var hand = frame.hands[0];
        HandleHand(hand,iBox);
    }
}

function HandleHand(hand, interactionBox) {
    //array of fingers
    var fingers = hand.fingers;
    var strokeWeight = 3;
    var color = 50;

    for(var j = 3; j>=0;j--){
        for(var i = 0;i<fingers.length;i++){
            handleBone(fingers[i].bones[j],color,strokeWeight,i,j,interactionBox);
        }
        strokeWeight+=1;
        color+=50;
    }
}

function handleBone(bone, color, startWeight,fingerIndex,boneIndex, interactionBox){


    //base coordinates
    var x = bone.prevJoint[0];
    var y = bone.prevJoint[1];
    var z = bone.prevJoint[2];

    //tip coordinates
    var x2 = bone.nextJoint[0];
    var y2 = bone.nextJoint[1];
    var z2 = bone.nextJoint[2];


    //normalize coordinates for prevJoint and nextJoint
    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint,true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint,true);


    //first coordinates final element is the value you want to set
    /*framesOfData.set(fingerIndex,boneIndex,0,currentSample,normalizedPrevJoint[0]);
    framesOfData.set(fingerIndex,boneIndex,1,currentSample,normalizedPrevJoint[1]);
    framesOfData.set(fingerIndex,boneIndex,2,currentSample,normalizedPrevJoint[2]);
    framesOfData.set(fingerIndex,boneIndex,3,currentSample,normalizedNextJoint[0]);
    framesOfData.set(fingerIndex,boneIndex,4,currentSample,normalizedNextJoint[1]);
    framesOfData.set(fingerIndex,boneIndex,5,currentSample,normalizedNextJoint[2]);*/



    //convert normalized coordinates to span the canvas
    //prevJoint
    var canvasXPrev = window.innerWidth * normalizedPrevJoint[0];
    var canvasYPrev = window.innerHeight *(1-normalizedPrevJoint[1]);

    //nextJoint
    var canvasXNext = window.innerWidth * normalizedNextJoint[0];
    var canvasYNext = window.innerHeight *(1-normalizedNextJoint[1]);


    //draw lines
    strokeWeight(startWeight*5);
    if(currentNumHands==1){

        stroke(color);

    }
    else if(currentNumHands==2){
        stroke(startWeight*5);
    }
    //line(x,y,x2,y2);
    line(canvasXPrev,canvasYPrev,canvasXNext,canvasYNext);
}











