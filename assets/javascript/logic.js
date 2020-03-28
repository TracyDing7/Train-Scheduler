$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyB2xkkUZB8s8xjIztOQY3AbQB6iW1Qea1s",
        authDomain: "my-cool-project-bca40.firebaseapp.com",
        databaseURL: "https://my-cool-project-bca40.firebaseio.com",
        projectId: "my-cool-project-bca40",
        storageBucket: "my-cool-project-bca40.appspot.com",
        messagingSenderId: "888063672732",
        appId: "1:888063672732:web:a875cafd4ddf314a6f0859"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
  
    var database = firebase.database();
  
    // Capture Button Click
    $("#addTrain").on("click", function (event) {
      event.preventDefault();
  
      // Grabbed values from text boxes
      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var freq = $("#interval").val().trim();
  
      // Code for handling the push
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq
      });
    });
  
  
    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function (childSnapshot) {
  
      var newTrain = childSnapshot.val().trainName;
     
      var newLocation = childSnapshot.val().destination;
      var newFirstTrain = childSnapshot.val().firstTrain;
      var newFreq = childSnapshot.val().frequency;
      console.log("NEW TRAIN:"+ newTrain + " "+ newLocation + " "+ newFirstTrain+" "+ newFreq);

      console.log("first train:"+ newFirstTrain);
      // First Time (pushed back 1 year to make sure it comes before current time)
      var startTimeConverted = moment(newFirstTrain, "HH:mm")//.subtract(1, "years");
      console.log("start time: "+startTimeConverted);
  
      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
      // Difference between the times
      var diffTime = currentTime.diff(moment(startTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
      var catchTrain;
      var tMinutesTillTrain ;
      if (diffTime < 0 ) {
        catchTrain = moment(startTimeConverted).format("HH:mm");
        tMinutesTillTrain =startTimeConverted.diff(moment(currentTime), "minutes");
        console.log("minutes away:"+ tMinutesTillTrain);
      } else {
      // Time apart (remainder)
      var tRemainder = diffTime % newFreq;
      console.log("remainder:" + tRemainder);
      // Minute(s) Until Train
       tMinutesTillTrain = newFreq - tRemainder;
     console.log("minutes away:"+ tMinutesTillTrain);
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
       catchTrain = moment(nextTrain).format("HH:mm");
      console.log(catchTrain);
      }
      // Display On Page
      $("#all-display").append(
        ' <tr><td>' + newTrain +
        ' </td><td>' + newLocation +
        ' </td><td>' + newFreq +
        ' </td><td>' + catchTrain +
        ' </td><td>' + tMinutesTillTrain + ' </td></tr>');
  
      // Clear input fields
      $("#trainName, #destination, #firstTrain, #interval").val("");
      return false;
    },
      //Handle the errors
      function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
  
  }); //end document ready