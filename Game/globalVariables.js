
var player;
var ground;
var diamond;
var wall;

var groundZPos = [0.0];

// Every row is drawn independantly because some diamonds will be deleted
var dmdZPos = [0.0];
var dmdZ0Pos = [];
var dmdZ90Pos = [];
var dmdZ180Pos = [];
var dmdZ270Pos = [];

var wallZPos = [0.0];

var colNotSpace = true;

var last = Date.now(); // Last time updatePlayerPos() function was called

var xDistancePlayerDiamondCenters;
var yDistancePlayerDiamondCenters;
var zDistancePlayerDiamondCenters;

var xDistancePlayerWallCenters;
var zDistancePlayerWallCenters;
var playerThetaToTouchTheWall; // Is an object

////////////////////////////////////////////////////////////////
// Game Control Panel.

var playerSpeedZ = 50; // Units in second
var playerSpeedXY = 0.5; // Units in one key press

var cameraZPos = 40.0;

var distanceBetweenPlayerAndLastGround = 100;
var distanceBetweenPlayerAndFirstGround = 50;

var distanceBetweenTwoCol = 10;
var collectablesBetweenPlayerAndLastCollectable = 7;
var distanceBetweenPlayerAndLastCollectable = collectablesBetweenPlayerAndLastCollectable * distanceBetweenTwoCol;

// Number of collectables and spaces to initialize in one row
var minColNum = 5, maxColNum = 12;
var minSpaceNum = 3, maxSpaceNum = 6;

var collectablesNumBehindThePlayer = 4;
var allCollectablesAndSpacesInitialized = 1; // The player exist at the zero position, so that i begin from 1.

