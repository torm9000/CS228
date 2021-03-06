var controllerOptions = {}

var x = window.innerWidth/2;
var y = window.innerHeight/2;
var z;

var rawXMin = 100000;
var rawYMin = 100000;
var rawXMax = -100000;
var rawYMax = -100000;
Leap.loop(controllerOptions,function (frame) {
    clear();
    HandleFrame(frame);

});
//testing
function HandleFrame(frame) {

    //circle(x,y,50);


    if(frame.hands.length == 1){
        var hand = frame.hands[0];
        HandleHand(hand);
    }
}



function HandleHand(hand) {

    var fingers = hand.fingers;

    /*for(var i=0; i<fingers.length;++i) {
        //if (fingers[i].type == 1) {
        HandleFinger(fingers[i]);

        //}
    }*/
    var strokeWeight = 3;
    var width = 100;

    for(var j = 3; j>=0;j--){
        for(var i = 0;i<fingers.length;i++){
            handleBone(fingers[i].bones[j],width,strokeWeight);
        }
        strokeWeight+=1;
        width+=30;
    }
}

function HandleFinger(finger){


    if(finger.tipPosition[0] < rawXMin){

        rawXMin = finger.tipPosition[0];

    }
    if(finger.tipPosition[1] < rawYMin){
        rawYMin = finger.tipPosition[1];

    }
    if(finger.tipPosition[0] > rawXMax){

        rawXMax = finger.tipPosition[0];


    }
    if(finger.tipPosition[1] > rawYMax){

        rawYMax = finger.tipPosition[1];

    }

    x = convertRange(finger.tipPosition[0],[rawXMin,rawXMax],[0,window.innerWidth]);
    y = window.innerHeight - convertRange(finger.tipPosition[1],[rawYMin,rawYMax],[0,window.innerHeight]);
    z = finger.tipPosition[2];





    for(var i =0; i<finger.bones.length;++i){
        handleBone(finger.bones[i]);
    }

}

function handleBone(bone, width, startWeight){

    //base coordinates
    x = bone.prevJoint[0];
    y=bone.prevJoint[1];
    z=bone.prevJoint[2];

    //tip coordinates
    var x2 = bone.nextJoint[0];
    var y2 = bone.nextJoint[1];
    //var z2 = bone.nextJoint[2];



    //transform coordinates
    [x,y] = transformCoordinates(x,y);
    [x2,y2] = transformCoordinates(x2,y2);


    //draw lines
    //strokeWeight(20);
    strokeWeight(startWeight);
    stroke(width);
    line(x,y,x2,y2);








}




//should be between raw min,x,rawmax
//new min, new x, new max

function convertRange( value, r1, r2 ) {
    //(finger position - RawMin)*(window.innerheight - 0) / (RawMax-rawMin)+0

    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

function scaleValue(value, from, to) {
    var scale = (to[1] - to[0]) / (from[1] - from[0]);
    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return ~~(capped * scale + to[0]);
}

function transformCoordinates(x,y) {
    if(x < rawXMin){

        rawXMin = x;

    }
    if(y < rawYMin){
        rawYMin = y;

    }
    if(x > rawXMax){

        rawXMax = x;


    }
    if(y > rawYMax){

        rawYMax = y;

    }


    x = convertRange(x,[rawXMin,rawXMax],[0,window.innerWidth]);
    y = window.innerHeight - convertRange(y,[rawYMin,rawYMax],[0,window.innerHeight]);

    return[x,y]
}
