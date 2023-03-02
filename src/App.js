import React, { useState } from "react";
import SaddleHeight from "./SaddleHeight";

const App = () => {
  const BikeFamilies = require(`./data/BikeFamilies.json`);
  const BikeSpec = require(`./data/BikeSpec.json`);
  const [selectedBikeFamily, setSelectedBikeFamily] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [displayedData, setDisplayedData] = useState([]);
  const [CustSaddleHeight, setCustSaddleHeight] = useState("");

  const handleBikeFamilyChange = (event) => {
    setSelectedBikeFamily(event.target.value);
    // console.log("_______________________________________________________");
    // console.log("");
    // console.log("Bike Family :");
    // console.log(event.target.value);
    // console.log("_______________________________________________________");
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
    // console.log("_______________________________________________________");
    // console.log("");
    // console.log("Size :");
    // console.log(event.target.value);
    // console.log("_______________________________________________________");
  };

  const handleSaddleHeightChange = (event) => {
    setCustSaddleHeight(event.target.value);
    // console.log("_______________________________________________________");
    // console.log("");
    // console.log("Saddle Height :");
    // console.log(event.target.value);
    // console.log("_______________________________________________________");
  };
  React.useEffect(() => {
    const filteredData = BikeSpec.filter((item) => {
      const lastTwo = item["Bike Name - Size"].slice(-2);
      const lastOne = item["Bike Name - Size"].slice(-1);
      let selectedBike = "";
      if (lastTwo.includes(" ")) {
        selectedBike =
          item["Bike Name - Size"].includes(selectedBikeFamily) &&
          lastOne === selectedSize;
      } else {
        selectedBike =
          item["Bike Name - Size"].includes(selectedBikeFamily) &&
          lastTwo === selectedSize;
      }
      return selectedBike;
    });
    setDisplayedData(filteredData);
  }, [selectedBikeFamily, selectedSize, BikeSpec]);

  return (
    <div className="container my-24 px-6 mx-auto">
      <section className="mb-32 text-gray-800 text-center lg:text-left">
        <div className="px-6 py-12 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="mt-12 lg:mt-0">
              <h1 className="text-5xl font-bold tracking-tight leading-tight mb-12">
                <span className="text-green-600">Syncros</span>
                <br />
                Dropper post finder
              </h1>
              <p className="text-gray-600">
                This tool will help customers to choose the dropper post which
                best fit their needs. The tool makes the list of all the
                possible dropper posts which can match the requested saddle
                height on a specific frame and size.
              </p>
            </div>
            <div className="mb-12 lg:mb-0">
              <div className="block rounded-lg shadow-lg bg-white px-6 py-12 md:px-12">
                <form>
                  <select
                    className="
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0 mt-5
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    aria-label={selectedBikeFamily}
                    value={selectedBikeFamily}
                    onChange={handleBikeFamilyChange}
                  >
                    <option value="">Select Bike Family</option>
                    {BikeFamilies.map((item) => (
                      <option
                        value={item["Bike Families"]}
                        key={item["Bike Families"]}
                      >
                        {item["Bike Families"]}
                      </option>
                    ))}x
                  </select>
                  <select
                    className="
                        w-full
                        px-3
                        py-1.5
                        text-base
                        font-normal
                        text-gray-700
                        bg-white bg-clip-padding bg-no-repeat
                        border border-solid border-gray-300
                        rounded
                        transition
                        ease-in-out
                        m-0 mt-5
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    aria-label={selectedSize}
                    value={selectedSize}
                    onChange={handleSizeChange}
                  >
                    <option value="">Select Size</option>
                    {BikeFamilies.filter(
                      (item) => item["Bike Families"] === selectedBikeFamily
                    ).map((item) =>
                      item["Available sizes"].split(",").map((size) => (
                        <option value={size} key={size}>
                          {size}
                        </option>
                      ))
                    )}
                  </select>
                  <input
                    type="text"
                    className="
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0 mt-5
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                  "
                    value={CustSaddleHeight}
                    onChange={handleSaddleHeightChange}
                    placeholder="Enter Saddle Height"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        {displayedData.map((item, index) =>
          selectedSize !== "" ? (
            item["Bike Name - Size"].includes(selectedSize) ? (
              <h1
                className="font-medium leading-tight text-4xl mt-0 mb-2 text-center  text-blue-600"
                key={index}
              >
                {item["Bike Name - Size"]}
              </h1>
            ) : null
          ) : (
            <h1 key={index}>Please select a size</h1>
          )
        )}
      </div>
      {displayedData.map((item, index) =>
        selectedSize !== "" ? (
          item["Bike Name - Size"].includes(selectedSize) ? (
            <div key={index}>
              <SaddleHeight
                selectedModel={item["Bike Name - Size"]}
                CustSaddleHeight={CustSaddleHeight}
              />{" "}
            </div>
          ) : null
        ) : (
          <div key={index}>
            <div colSpan={5}>Please select a size</div>
          </div>
        )
      )}
    </div>
  );
};

export default App;
