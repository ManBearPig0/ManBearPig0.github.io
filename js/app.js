// Tried to use App.js as general module import script. Doesn't work without libraries or proper nodejs server setup.
// require('./components/test');
// import './components/test';

// class Test {
//   constructor() {
//     window.onload += this.load();
//   }


// Can be used for general JS anyways.

if (document.getElementById("test")) {
  Array.from(document.querySelectorAll("#test")).forEach((domContainer) => {
    domContainer.innerHTML = "<p> Changed all elements with id 'test' to this! </p>";
  });
}
