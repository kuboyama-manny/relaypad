import ReactDOM from "react-dom";

// Placeholder test to comfirm jest/enzyme are working
it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.unmountComponentAtNode(div);
});
