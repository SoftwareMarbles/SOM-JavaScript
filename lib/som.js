//
//  Copyright 2014 Software Marbles SpA
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//

var _ = require('underscore');

//  The iterate implementation function receives three params:
//      1.  nextIteration param is a function which should be called to advance the iteration.
//      2.  object param is either the current iteration object or undefined when the iteration has ended.
//      3.  function to be used to execute the next or final iteration.
var iterateImplementation = function(collection, iterator, execute) {
    if(_.isUndefined(collection)
        || _.isUndefined(iterator)) {
        return;
    }

    //  Start all iterations from the 0-th index.
    var currentIndex = 0;

    //  Define the nextIteration function. When invoked this function will "iterate" over to the next
    //  index in the collection.
    var nextIteration = function() {
        if(currentIndex == collection.length) {
            //  Move the index beyond the collection length so that
            //  the next() invocation never again passes through this branch.
            ++currentIndex;
            //  Inform the callback function that the iteration has finished.
            execute(function() { iterator(nextIteration, undefined, true); });
        } if(currentIndex > collection.length) {
            //  Nothing to do - the iteration has ended.
        } else {
            //  Invoke the callback function for the object at the current index
            //  and bump the index (so that next iteration takes the next object)
            execute(function() { iterator(nextIteration, collection[currentIndex++], false); });
        }
    }

    //  Immediately start iteration.
    nextIteration();
}

//  Initializes asynchronous iteration over the collection using the given iterator function.
exports.iterate = function(collection, iterator) {
    //  Iterate but defer the execution of each iteration until the current stack is empty.
    return iterateImplementation(collection, iterator, _.defer);
}

//  Initializes synchronous iteration over the collection using the given iterator function.
exports.iterateSync = function(collection, iterator) {
    //  Iterate and immediately execute each iteration.
    //  NOTE: This could blow off the stack for very large collections.
    return iterateImplementation(collection, iterator, function(f) { f(); });
}
