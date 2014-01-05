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

var som     = require('../lib/som')
  , expect  = require('chai').expect
  , _       = require('underscore');

describe('Iterating asynchronously over collection', function() {
    it('doesn\'t do anything if collection is undefined', function(done) {
        som.iterate();
        done();
    });

    it('doesn\'t do anything if iterator is undefined', function(done) {
        som.iterate([]);
        done();
    });

    it('invokes the iterator function once for empty collections', function(done) {
        var numberOfIterations = 0;

        som.iterate([], function(iteration) {
            expect(iteration).to.not.be.undefined;
            expect(iteration.next).to.not.be.undefined;
            expect(iteration.item).to.be.null;
            expect(iteration.index).to.be.equal(0);
            expect(iteration.hasFinished).to.be.true;

            ++numberOfIterations;
            iteration.next();

            if(iteration.hasFinished) {
                expect(numberOfIterations).to.be.equal(1);
                done();
            }
        });
    });

    it('invokes the iterator function length + 1 times for collections', function(done) {
        var numberOfIterations = 0;

        som.iterate([1, 2, 3], function(iteration) {
            expect(iteration).to.not.be.undefined;
            expect(iteration.next).to.not.be.undefined;

            ++numberOfIterations;
            iteration.next();

            if(iteration.hasFinished) {
                expect(numberOfIterations).to.be.equal(4);
                done();
            }
        });
    });

    it('really works asynchronously', function(done) {
        var numberOfIterations = 0;

        som.iterate([1, 2, 3], function(iteration) {
            expect(iteration).to.not.be.undefined;
            expect(iteration.next).to.not.be.undefined;

            ++numberOfIterations;
            iteration.next();
        });

        //  By designe the above code must not execute at all until we reach this point.
        //  It should only execute when the we reach the bottom of the stack.
        expect(numberOfIterations).to.be.equal(0);
        done();
    });
});

describe('Iterating synchronously over collection', function() {
    it('doesn\'t do anything if collection is undefined', function(done) {
        som.iterateSync();
        done();
    });

    it('doesn\'t do anything if iterator is undefined', function(done) {
        som.iterateSync([]);
        done();
    });

    it('invokes the iterator function once synchronously for empty collections', function(done) {
        var numberOfIterations = 0;

        som.iterateSync([], function(iteration) {
            expect(iteration).to.not.be.undefined;
            expect(iteration.next).to.not.be.undefined;
            expect(iteration.item).to.be.null;
            expect(iteration.index).to.be.equal(0);
            expect(iteration.hasFinished).to.be.true;

            ++numberOfIterations;
            iteration.next();
        });

        //  By designe the above code must be executed completely until we reach this point.
        expect(numberOfIterations).to.be.equal(1);
        done();
    });

    it('invokes the iterator function length + 1 times synchronously for collections', function(done) {
        var numberOfIterations = 0;

        som.iterateSync([1, 2, 3], function(iteration) {
            expect(iteration).to.not.be.undefined;
            expect(iteration.next).to.not.be.undefined;

            ++numberOfIterations;
            iteration.next();
        });

        //  By designe the above code must be executed completely until we reach this point.
        expect(numberOfIterations).to.be.equal(4);
        done();
    });
});
