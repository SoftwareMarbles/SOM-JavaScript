SOM-JavaScript
==============
Utilities for JavaScript, part of [SOM](https://github.com/SoftwareMarbles/SOM) utilities.

iterate
-------
Iterates asynchronously over a collection, performing each iteration only once the previous one finished.

Example of printing out 1, 2 and 3 to console asynchronously and in the series:

    var som = require('som.js');
  
    som.iterate([1, undefined, 3], function(nextIteration, item, isFinished) {
      //  isFinished will be true only once all the items in the collection have
      //  been iterated over.
      if(!isFinished) {
        console.log(item);
      }
    
      //  To continue with iteration invoke the provided nextIteration() function.
      //  To stop the iteration don't do anything.
      //  Invoking nextIteration() on finished iterations is neither required nor
      //  prohibited as it doesn't do anything.
      nextIteration();
    });

The above should output:

    1
    undefined
    3

iterateSync
-------
Same as iterate but performs the iteration synchronously before continuing.
