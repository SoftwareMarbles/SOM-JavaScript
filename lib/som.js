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
        if(currentIndex > collection.length) {
            //  Nothing to do - the iteration has ended.
        } else {
            //  Before executing the iterator function with the next iteration
            //  bump the index - this way it doesn't matter if the execute call
            //  is asynchronous or synchronos.
            var hasFinished = currentIndex == collection.length;
            var previousCurrentIndex = currentIndex++;

            execute(function() { iterator({
                    next:           nextIteration,
                    item:           hasFinished ? null : collection[previousCurrentIndex],
                    index:          previousCurrentIndex,
                    hasFinished:    hasFinished
                });
            });
        }
    }

    //  Immediately start iteration.
    nextIteration();
}

//  Initializes asynchronous iteration over the collection using the given iterator function.
//  The iterator function will receive an object with the following properties:
//      1.  next is a function which should be called to advance the iteration.
//      2.  item is either the current iteration item or null when the iteration has finished.
//      3.  index is the index of the current iteration or the length of the iterated collection if the iteration has finished.
//      4.  hasFinished is a flag indicating if the iteration has finished or not.
exports.iterate = function(collection, iterator) {
    //  Iterate but defer the execution of each iteration until the current stack is empty.
    return iterateImplementation(collection, iterator, _.defer);
}

//  Initializes synchronous iteration over the collection using the given iterator function.
//  The iterator function will receive an object with the following properties:
//      1.  next is a function which should be called to advance the iteration.
//      2.  item is either the current iteration item or null when the iteration has finished.
//      3.  index is the index of the current iteration or the length of the iterated collection if the iteration has finished.
//      4.  hasFinished is a flag indicating if the iteration has finished or not.
exports.iterateSync = function(collection, iterator) {
    //  Iterate and immediately execute each iteration.
    //  NOTE: This could blow off the stack for very large collections.
    return iterateImplementation(collection, iterator, function(f) { f(); });
}
