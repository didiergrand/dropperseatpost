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
    const {
      "Angle of the seat tube": seatTubeAngle,
      "Offset of the seat tube": offsetOfTheSeatTube,
      "BB center to top of seatpost": bbCenterToTopOfTheSeatTube,
      "Max seatpost insertion": MaxSeatpostInsertion,
      "Max seatpost insertion w/actuator": MaxSeatpostInsertionWActuator,
    } = item;

    DropperPost.forEach((post, i) => {
      const postLengthWActuator = post["Post lenght"]; //"Post lenght (with actuator)"
      const postActuator = post["Actuator"];
      const postLength = postLengthWActuator - postActuator; //"Post lenght (without actuator)"
      const OveralLenght = post["Overal lenght"]; // "Overal lenght (without actuator)"
      const AF6 = MaxSeatpostInsertion - postLengthWActuator;
      const AE6 = AF6 - postActuator;
      const MinPostInsertion = post["Min post insertion"]; // "Overal lenght (without actuator)"
      const DropperPostName = post["Dropper post name "]; // "Overal lenght (without actuator)"
      // AE6 and AF6 are comming from the ppt documentation initialy for the excel file

      const topOfTheSeatpostX =  -Math.cos( seatTubeAngle + Math.asin(offsetOfTheSeatTube / bbCenterToTopOfTheSeatTube) ) *  bbCenterToTopOfTheSeatTube;
      const topOfTheSeatpostY =   Math.sin( seatTubeAngle + Math.asin(offsetOfTheSeatTube / bbCenterToTopOfTheSeatTube) ) *  bbCenterToTopOfTheSeatTube;
      if (AE6 > 0 && AF6 > 0) { // ‘‘AE6’’ and ‘‘AF6’’ values are positive then
        console.log("AE6 > 0 && AF6 > 0");
        // If the limiting factor is ‘‘Seatpost is on the collar’’
        minimumSaddleHeightX =  topOfTheSeatpostX - Math.cos(seatTubeAngle) * (OveralLenght - postLength);
        minimumSaddleHeightY =  topOfTheSeatpostY + Math.sin(seatTubeAngle) * (OveralLenght - postLength) + saddleHeight;
        console.log(minimumSaddleHeightX);
        console.log(minimumSaddleHeightY);
      } else if (AE6 <= AF6) {
        // If the limiting factor is ‘‘Seatpost is on the frame stop’’
        console.log("else if (AE6 <= AF6)");
        const topOfFramestopX = topOfTheSeatpostX + (Math.cos(seatTubeAngle) * MaxSeatpostInsertion);
        const topOfFramestopY = topOfTheSeatpostY - (Math.sin(seatTubeAngle) * MaxSeatpostInsertion);
        minimumSaddleHeightX = topOfFramestopX - Math.cos(seatTubeAngle) * OveralLenght;
        minimumSaddleHeightY = topOfFramestopY + Math.sin(seatTubeAngle) * OveralLenght + saddleHeight;
      } else if (AE6 >= AF6) {
        // If the limiting factor is ‘‘Actuator may touch something’’
        console.log("else if (AE6 >= AF6)");
        const topOfFramestopXWActuator =  topOfTheSeatpostX + (Math.cos(seatTubeAngle) * MaxSeatpostInsertionWActuator);
        const topOfFramestopYWActuator =  topOfTheSeatpostY - (Math.sin(seatTubeAngle) * MaxSeatpostInsertionWActuator);
        minimumSaddleHeightX = topOfFramestopXWActuator - Math.cos(seatTubeAngle) * (OveralLenght + postActuator);
        minimumSaddleHeightY = topOfFramestopYWActuator + Math.sin(seatTubeAngle) * (OveralLenght + postActuator) + saddleHeight;
      } 

      maximumSaddleHeightX = topOfTheSeatpostX - Math.cos(seatTubeAngle) * (OveralLenght - MinPostInsertion);
      maximumSaddleHeightY = topOfTheSeatpostY + Math.sin(seatTubeAngle) * (OveralLenght - MinPostInsertion) + saddleHeight;

      const minimumSaddleHeight = Math.sqrt( Math.pow(minimumSaddleHeightX, 2) + Math.pow(minimumSaddleHeightY, 2));
      const maximumSaddleHeight = Math.sqrt( Math.pow(maximumSaddleHeightX, 2) + Math.pow(maximumSaddleHeightY, 2));

      if (minimumSaddleHeight > maximumSaddleHeight) { 
         // console.log( "WARNING: minimum saddle height is greater than maximum saddle height" );
      }
      // console.log( "minimum : " +  minimumSaddleHeight + " | maximum : " + maximumSaddleHeight );
      if (minimumSaddleHeight > maximumSaddleHeight) { 
       // console.log( "-------------" );
      }

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
