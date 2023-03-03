import React, { useState } from "react";
const BikeSpec = require(`./data/BikeSpec.json`);
const DropperPost = require(`./data/DropperPost.json`);

function SaddleHeight({ selectedModel, CustSaddleHeight }) {
  const [result, setResult] = useState([]);
  React.useEffect(() => {
    const saddleHeight = 45;
    let minimumSaddleHeightX = 0;
    let minimumSaddleHeightY = 0;
    let maximumSaddleHeightX = 0;
    let maximumSaddleHeightY = 0;

    let resultArr = [];
    const item = BikeSpec.find(
      (item) => item["Bike Name - Size"] === selectedModel
    );

    if (!item) return;
    let {
      "Angle of the seat tube": seatTubeAngle,
      "Offset of the seat tube": offsetOfTheSeatTube,
      "BB center to top of seatpost": bbCenterToTopOfTheSeatTube,
      "Max seatpost insertion": MaxSeatpostInsertion,
      "Max seatpost insertion w/actuator": MaxSeatpostInsertionWActuator,
    } = item;
    
    seatTubeAngle = parseInt(seatTubeAngle);
    offsetOfTheSeatTube = parseInt(offsetOfTheSeatTube);
    bbCenterToTopOfTheSeatTube = parseInt(bbCenterToTopOfTheSeatTube);
    MaxSeatpostInsertion = parseInt(MaxSeatpostInsertion);
    MaxSeatpostInsertionWActuator = parseInt(MaxSeatpostInsertionWActuator);


    function degrees_to_radians(degrees)
    {
      const pi = Math.PI;
      return degrees * (pi/180);
    }
    let seatTubeAngleRad=0;
    seatTubeAngleRad = degrees_to_radians(seatTubeAngle);
    DropperPost.forEach((post, i) => {
      const postLengthWActuator = parseInt(post["Post lenght"]); //"Post lenght (with actuator)"
      const postActuator = parseInt(post["Actuator"]);
      const postLength = postLengthWActuator - postActuator; //"Post lenght (without actuator)"
      const OveralLenght = parseInt(post["Overal lenght"]); // "Overal lenght (without actuator)"
      const AE6 = MaxSeatpostInsertion - postLength; //MODIFICATION
      let AF6 = 0;

      if(MaxSeatpostInsertionWActuator === 0) { //MODIFICATION
        AF6 = 0; //MODIFICATION
      } else { //MODIFICATION
        AF6 = MaxSeatpostInsertionWActuator - postLengthWActuator; //MODIFICATION
      } //MODIFICATION
 
      const MinPostInsertion = post["Min post insertion"]; // "Min post insertion"
      const DropperPostName = post["Dropper post name "]; // "Dropper post"
      // AE6 and AF6 are comming from the ppt documentation initialy for the excel file

     
      const topOfTheSeatpostX =  -Math.cos( seatTubeAngleRad + Math.asin(offsetOfTheSeatTube / bbCenterToTopOfTheSeatTube) ) *  bbCenterToTopOfTheSeatTube; //Might have some issues with RAD/Deg
      const topOfTheSeatpostY =   Math.sin( seatTubeAngleRad + Math.asin(offsetOfTheSeatTube / bbCenterToTopOfTheSeatTube) ) *  bbCenterToTopOfTheSeatTube; //Might have some issues with RAD/Deg


      if (AE6 > 0 && AF6 > 0) { // ‘‘AE6’’ and ‘‘AF6’’ values are positive then
        console.log("1 AE6 > 0 && AF6 > 0");
        // If the limiting factor is ‘‘Seatpost is on the collar’’
        minimumSaddleHeightX =  topOfTheSeatpostX - Math.cos(seatTubeAngleRad) * (OveralLenght - postLength); //Might have some issues with RAD/Deg
        minimumSaddleHeightY =  topOfTheSeatpostY + Math.sin(seatTubeAngleRad) * (OveralLenght - postLength) + saddleHeight; //Might have some issues with RAD/Deg

      } else if (AE6 <= AF6) {
        // If the limiting factor is ‘‘Seatpost is on the frame stop’’
        console.log("2 else if (AE6 <= AF6)");
        const topOfFramestopX = topOfTheSeatpostX + (Math.cos(seatTubeAngleRad) * MaxSeatpostInsertion); //Might have some issues with RAD/Deg
        const topOfFramestopY = topOfTheSeatpostY - (Math.sin(seatTubeAngleRad) * MaxSeatpostInsertion); //Might have some issues with RAD/Deg
        minimumSaddleHeightX = topOfFramestopX - Math.cos(seatTubeAngleRad) * OveralLenght;
        minimumSaddleHeightY = topOfFramestopY + Math.sin(seatTubeAngleRad) * OveralLenght + saddleHeight;
      } else if (AE6 >= AF6) {
        // If the limiting factor is ‘‘Actuator may touch something’’
        console.log("3 else if (AE6 >= AF6)");
        const topOfFramestopXWActuator =  topOfTheSeatpostX + (Math.cos(seatTubeAngleRad) * MaxSeatpostInsertionWActuator); //Might have some issues with RAD/Deg
        const topOfFramestopYWActuator =  topOfTheSeatpostY - (Math.sin(seatTubeAngleRad) * MaxSeatpostInsertionWActuator); //Might have some issues with RAD/Deg
        minimumSaddleHeightX = topOfFramestopXWActuator - Math.cos(seatTubeAngleRad) * (OveralLenght + postActuator); //Might have some issues with RAD/Deg
        // console.log("topOfFramestopXWActuator : "+topOfFramestopXWActuator);
        // console.log("Math.cos(seatTubeAngleRad) : "+Math.cos(seatTubeAngleRad));
        // console.log("OveralLenght : "+OveralLenght);
        // console.log("postActuator : "+postActuator);
        minimumSaddleHeightY = topOfFramestopYWActuator + Math.sin(seatTubeAngleRad) * (OveralLenght + postActuator) + saddleHeight; //Might have some issues with RAD/Deg
        //console.log(parseInt(OveralLenght) + parseInt(postActuator));
        // console.log("topOfFramestopYWActuator : "+topOfFramestopYWActuator);
        // console.log("Math.sin(seatTubeAngleRad) : "+Math.sin(seatTubeAngleRad));
        // console.log("OveralLenght : "+OveralLenght);
        // console.log("postActuator : "+postActuator);
        // console.log("saddleHeight : "+saddleHeight);

      }
 
      // console.log("minimumSaddleHeightX : "+minimumSaddleHeightX);
      // console.log("minimumSaddleHeightY : "+minimumSaddleHeightY);

      maximumSaddleHeightX = topOfTheSeatpostX - Math.cos(seatTubeAngleRad) * (OveralLenght - MinPostInsertion);
      maximumSaddleHeightY = topOfTheSeatpostY + Math.sin(seatTubeAngleRad) * (OveralLenght - MinPostInsertion) + saddleHeight;
 
      const minimumSaddleHeight = Math.sqrt( Math.pow(minimumSaddleHeightX, 2) + Math.pow(minimumSaddleHeightY, 2));
      const maximumSaddleHeight = Math.sqrt( Math.pow(maximumSaddleHeightX, 2) + Math.pow(maximumSaddleHeightY, 2));
      if( minimumSaddleHeight < maximumSaddleHeight ) {
      console.log("minimumSaddleHeight : "+minimumSaddleHeight);
      console.log("maximumSaddleHeight : "+maximumSaddleHeight);
      }
      console.log("minimumSaddleHeight : "+minimumSaddleHeight);
      console.log("maximumSaddleHeight : "+maximumSaddleHeight);
      if ( CustSaddleHeight > minimumSaddleHeight && CustSaddleHeight < maximumSaddleHeight ) {
        resultArr.push({
          "Dropper post": DropperPostName,
          "Minimum saddle height": minimumSaddleHeight,
          "Maximum saddle height": maximumSaddleHeight,
        });
      }
    });
 

    setResult(resultArr);
  }, [selectedModel, CustSaddleHeight]);

  return (
    <section className="overflow-hidden text-gray-700 ">
      <div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
        <div className="grid grid-cols-4 gap-4">
          {result.map((item, i) => (
            <div key={i} className="rounded bg-slate-100 p-2">
              <h5>{item["Dropper post"]}</h5>
              <small>
                {item["Minimum saddle height"]}
                <br />
                {item["Maximum saddle height"]}
              </small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SaddleHeight;
