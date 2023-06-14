/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ Diff)
});

;// CONCATENATED MODULE: ./src/Action.js
﻿const Action = {
    equal: 0,
    delete: 1,
    insert: 2,
    none: 3,
    replace: 4
};

/* harmony default export */ const src_Action = (Action);
;// CONCATENATED MODULE: ./src/Match.js
﻿class Match {
    constructor(startInOld, startInNew, size) {
        this.startInOld = startInOld;
        this.startInNew = startInNew;
        this.size = size;
    }

    get endInOld() {
        return this.startInOld + this.size;
    }

    get endInNew() {
        return this.startInNew + this.size;
    }
};
;// CONCATENATED MODULE: ./src/Utils.js
﻿const tagRegex = /^\s*<\/?[^>]+>\s*$/;
const tagWordRegex = /<[^\s>]+/;
const whitespaceRegex = /^(\s|&nbsp;)+$/;
const wordRegex = /[\w#@]+/;

const specialCaseWordTags = ["<img", "<iframe", "</iframe"];

function isTag(item) {
    if (specialCaseWordTags.some(tag => item !== null && item.indexOf(tag) === 0)) {
        return false;
    }

    return tagRegex.test(item);
}

function stripTagAttributes(word) {
    let tag = tagWordRegex.exec(word)[0];
    
    word = tag + (word.indexOf("/>", word.length - 2) !== -1 ? "/>" : ">");
    return word;
}

function wrapText(text, tagName, cssClass) {
    return `<${tagName} class="${cssClass}">${text}</${tagName}>`;
}

function isStartOfTag(val) {
    return val === "<";
}

function isEndOfTag(val) {
    return val === ">";
}

function isStartOfEntity(val) {
    return val === "&";
}

function isEndOfEntity(val) {
    return val === ";";
}

function isWhiteSpace(value) {
    return whitespaceRegex.test(value);
}

function stripAnyAttributes(word) {
    if (isTag(word)) {
        return stripTagAttributes(word);
    }

    return word;
}

function isWord(text) {
    return wordRegex.test(text);
}



;// CONCATENATED MODULE: ./src/MatchFinder.js
﻿


function putNewWord(block, word, blockSize) {
    block.push(word);

    if (block.length > blockSize) {
        block.shift();
    }

    if (block.length !== blockSize) {
        return null;
    }

    return block.join("");
}

// Finds the longest match in given texts. 
//It uses indexing with fixed granularity that is used to compare blocks of text.
class MatchFinder {
    constructor(
        oldWords,
        newWords,
        startInOld,
        endInOld,
        startInNew,
        endInNew,
        options
    ) {
        this.oldWords = oldWords;
        this.newWords = newWords;
        this.startInOld = startInOld;
        this.endInOld = endInOld;
        this.startInNew = startInNew;
        this.endInNew = endInNew;
        this.options = options;
    }

    indexNewWords() {
        this.wordIndices = new Map();
        let block = [];
        for (let i = this.startInNew; i < this.endInNew; i++) {
            // if word is a tag, we should ignore attributes as attribute changes are not supported (yet)
            let word = this.normalizeForIndex(this.newWords[i]);
            let key = putNewWord(block, word, this.options.blockSize);

            if (key === null) {
                continue;
            }

            if (this.wordIndices.has(key)) {
                this.wordIndices.get(key).push(i);
            } else {
                this.wordIndices.set(key, [i]);
            }
        }
    }

    // Converts the word to index-friendly value so it can be compared with other similar words
    normalizeForIndex(word) {
        word = stripAnyAttributes(word);
        if (
            this.options.IgnoreWhiteSpaceDifferences &&
            isWhiteSpace(word)
        ) {
            return " ";
        }

        return word;
    }

    findMatch() {
        this.indexNewWords();
        this.removeRepeatingWords();

        if (this.wordIndices.length === 0) {
            return null;
        }

        let bestMatchInOld = this.startInOld;
        let bestMatchInNew = this.startInNew;
        let bestMatchSize = 0;

        let matchLengthAt = new Map();
        const blockSize = this.options.blockSize;
        let block = [];

        for (
            let indexInOld = this.startInOld;
            indexInOld < this.endInOld;
            indexInOld++
        ) {
            let word = this.normalizeForIndex(this.oldWords[indexInOld]);
            let index = putNewWord(block, word, blockSize);

            if (index === null) {
                continue;
            }

            let newMatchLengthAt = new Map();

            if (!this.wordIndices.has(index)) {
                matchLengthAt = newMatchLengthAt;
                continue;
            }

            const wordIndex = this.wordIndices.get(index);

            wordIndex.forEach((indexInNew) => {
                let newMatchLength =
                    (matchLengthAt.has(indexInNew - 1)
                        ? matchLengthAt.get(indexInNew - 1)
                        : 0) + 1;
                newMatchLengthAt.set(indexInNew, newMatchLength);

                if (newMatchLength > bestMatchSize) {
                    bestMatchInOld =
                        indexInOld - newMatchLength - blockSize + 2;
                    bestMatchInNew =
                        indexInNew - newMatchLength - blockSize + 2;
                    bestMatchSize = newMatchLength;
                }
            });

            matchLengthAt = newMatchLengthAt;
        }

        return bestMatchSize !== 0
            ? new Match(
                bestMatchInOld,
                bestMatchInNew,
                bestMatchSize + blockSize - 1
            )
            : null;
    }

    // This method removes words that occur too many times. This way it reduces total count of comparison operations
    // and as result the diff algoritm takes less time. But the side effect is that it may detect false differences of
    // the repeating words.
    removeRepeatingWords() {
        let threshold =
            this.newWords.length + this.options.repeatingWordsAccuracy;
        let repeatingWords = [];

        this.wordIndices.forEach((value, key) => {
            if (value.length > threshold) {
                repeatingWords.push(key);
            }
        });

        repeatingWords.forEach((w) => {
            this.wordIndices.delete(w);
        });
    }
}
;// CONCATENATED MODULE: ./src/Operation.js
﻿class Operation {
    constructor(action, startInOld, endInOld, startInNew, endInNew) {
        this.action = action;
        this.startInOld = startInOld;
        this.endInOld = endInOld;
        this.startInNew = startInNew;
        this.endInNew = endInNew;
    }
}
;// CONCATENATED MODULE: ./src/MatchOptions.js
﻿class MatchOptions {
    constructor() {
        this.blockSize = 0;
        this.repeatingWordsAccuracy = 0.0;
        this.ignoreWhitespaceDifferences = false;
    }
}
;// CONCATENATED MODULE: ./src/Mode.js
﻿const Mode = {
    character: 0,
    tag: 1,
    whitespace: 2,
    entity: 3
};

/* harmony default export */ const src_Mode = (Mode);
;// CONCATENATED MODULE: ./src/WordSplitter.js
﻿


function convertHtmlToListOfWords(text, blockExpressions) {
    let state = {
        mode: src_Mode.character,
        currentWord: [],
        words: []
    };

    let blockLocations = findBlocks(text, blockExpressions);

    let isBlockCheckRequired = !!blockLocations.size;
    let isGrouping = false;
    let groupingUntil = -1;

    for (let i = 0; i < text.length; i++) {
        var character = text[i];

        // Don't bother executing block checks if we don't have any blocks to check for!
        if (isBlockCheckRequired) {
            // Check if we have completed grouping a text sequence/block
            if (groupingUntil === i) {
                groupingUntil = -1;
                isGrouping = false;
            }

            // Check if we need to group the next text sequence/block
            let until = 0;
            if (blockLocations.has(i)) {
                until = blockLocations.get(i);
                isGrouping = true;
                groupingUntil = until;
            }

            // if we are grouping, then we don't care about what type of character
            // we have, it's going to be treated as a word
            if (isGrouping) {
                state.currentWord.push(character);
                state.mode = src_Mode.character;
                continue;
            }
        }

        switch (state.mode) {
            case src_Mode.character:
                if (isStartOfTag(character)) {
                    addClearWordSwitchMode(state, "<", src_Mode.tag);
                } else if (isStartOfEntity(character)) {
                    addClearWordSwitchMode(state, character, src_Mode.entity);
                } else if (isWhiteSpace(character)) {
                    addClearWordSwitchMode(state, character, src_Mode.whitespace);
                } else if (
                    isWord(character) &&
                    (state.currentWord.length === 0 ||
                        isWord(
                            state.currentWord[state.currentWord.length - 1]
                        ))
                ) {
                    state.currentWord.push(character);
                } else {
                    addClearWordSwitchMode(state, character, src_Mode.character);
                }

                break;

            case src_Mode.tag:
                if (isEndOfTag(character)) {
                    state.currentWord.push(character);
                    state.words.push(state.currentWord.join(""));

                    state.currentWord = [];
                    state.mode = isWhiteSpace(character)
                        ? src_Mode.whitespace
                        : src_Mode.character;
                } else {
                    state.currentWord.push(character);
                }

                break;

            case src_Mode.whitespace:
                if (isStartOfTag(character)) {
                    addClearWordSwitchMode(state, character, src_Mode.tag);
                } else if (isStartOfEntity(character)) {
                    addClearWordSwitchMode(state, character, src_Mode.entity);
                } else if (isWhiteSpace(character)) {
                    state.currentWord.push(character);
                } else {
                    addClearWordSwitchMode(state, character, src_Mode.character);
                }

                break;

            case src_Mode.entity:
                if (isStartOfTag(character)) {
                    addClearWordSwitchMode(state, character, src_Mode.tag);
                } else if (isWhiteSpace(character)) {
                    addClearWordSwitchMode(state, character, src_Mode.whitespace);
                } else if (isEndOfEntity(character)) {
                    let switchToNextMode = true;
                    if (state.currentWord.length !== 0) {
                        state.currentWord.push(character);
                        state.words.push(state.currentWord.join(""));

                        //join &nbsp; entity with last whitespace
                        if (
                            state.words.length > 2 &&
                            isWhiteSpace(
                                state.words[state.words.length - 2]
                            ) &&
                            isWhiteSpace(
                                state.words[state.words.length - 1]
                            )
                        ) {
                            let w1 = state.words[state.words.length - 2];
                            let w2 = state.words[state.words.length - 1];
                            state.words.splice(state.words.length - 2, 2);
                            state.currentWord = [(w1 + w2).split()];
                            state.mode = src_Mode.whitespace;
                            switchToNextMode = false;
                        }
                    }

                    if (switchToNextMode) {
                        state.currentWord = [];
                        state.mode = src_Mode.character;
                    }
                } else if (isWord(character)) {
                    state.currentWord.push(character);
                } else {
                    addClearWordSwitchMode(state, character, src_Mode.character);
                }

                break;
        }
    }

    if (state.currentWord.length !== 0) {
        state.words.push(state.currentWord.join(""));
    }

    return state.words;
}

function addClearWordSwitchMode(state, character, mode) {
    if (state.currentWord.length !== 0) {
        state.words.push(state.currentWord.join(""));
    }

    state.currentWord = [character];
    state.mode = mode;
}

function findBlocks(text, blockExpressions) {
    let blockLocations = new Map();

    if (blockExpressions === null) {
        return blockLocations;
    }

    blockExpressions.forEach((exp) => {
        let m;
        while ((m = exp.exec(text)) !== null) {
            if (blockLocations.has(m.index)) {
                throw new Error(
                    "One or more block expressions result in a text sequence that overlaps. Current expression: " +
                        exp.toString()
                );
            }
            blockLocations.set(m.index, m.index + m[0].length);
        }
    });

    return blockLocations;
}



;// CONCATENATED MODULE: ./src/Diff.js
﻿







// This value defines balance between speed and memory utilization. 
//The higher it is the faster it works and more memory consumes.
const MatchGranuarityMaximum = 4;

const specialCaseClosingTags = new Map([
    ["</strong>", 0],
    ["</em>", 0],
    ["</b>", 0],
    ["</i>", 0],
    ["</big>", 0],
    ["</small>", 0],
    ["</u>", 0],
    ["</sub>", 0],
    ["</strike>", 0],
    ["</s>", 0],
    ["</dfn>", 0]
]);

const specialCaseOpeningTagRegex = /<((strong)|(b)|(i)|(dfn)|(em)|(big)|(small)|(u)|(sub)|(sup)|(strike)|(s))[>\s]+/gi;

class HtmlDiff {
    constructor(oldText, newText) {
        this.content = [];
        this.newText = newText;
        this.oldText = oldText;

        this.specialTagDiffStack = [];
        this.newWords = [];
        this.oldWords = [];
        this.matchGranularity = 0;
        this.blockExpressions = [];

        this.repeatingWordsAccuracy = 1.0;
        this.ignoreWhiteSpaceDifferences = false;
        this.orphanMatchThreshold = 0.0;
    }

    build() {
        if (this.oldText === this.newText) {
            return this.newText;
        }

        if (typeof this.oldText === "undefined" || this.oldText === null) {
            return this.newText;
        }

        if (typeof this.newText === "undefined" || this.newText === null) {
            return this.oldText;
        }

        this.splitInputsIntoWords();

        this.matchGranularity = Math.min(
            MatchGranuarityMaximum,
            this.oldWords.length,
            this.newWords.length
        );
        let operations = this.operations();

        operations.forEach(item => {
            this.performOperation(item);
        });

        return this.content.join("");
    }

    addBlockExpression(exp) {
        this.blockExpressions.push(exp);
    }

    splitInputsIntoWords() {
        this.oldWords = convertHtmlToListOfWords(
            this.oldText,
            this.blockExpressions
        );

        //free memory, allow it for GC
        this.oldText = null;

        this.newWords = convertHtmlToListOfWords(
            this.newText,
            this.blockExpressions
        );

        //free memory, allow it for GC
        this.newText = null;
    }

    performOperation(opp) {
        switch (opp.action) {
            case src_Action.equal:
                this.processEqualOperation(opp);
                break;
            case src_Action.delete:
                this.processDeleteOperation(opp, "diffdel");
                break;
            case src_Action.insert:
                this.processInsertOperation(opp, "diffins");
                break;
            case src_Action.none:
                break;
            case src_Action.replace:
                this.processReplaceOperation(opp);
                break;
        }
    }

    processReplaceOperation(opp) {
        this.processDeleteOperation(opp, "diffmod");
        this.processInsertOperation(opp, "diffmod");
    }

    processInsertOperation(opp, cssClass) {
        let text = this.newWords.filter(
            (s, pos) => pos >= opp.startInNew && pos < opp.endInNew
        );
        this.insertTag("ins", cssClass, text);
    }

    processDeleteOperation(opp, cssClass) {
        let text = this.oldWords.filter(
            (s, pos) => pos >= opp.startInOld && pos < opp.endInOld
        );
        this.insertTag("del", cssClass, text);
    }

    processEqualOperation(opp) {
        let result = this.newWords.filter(
            (s, pos) => pos >= opp.startInNew && pos < opp.endInNew
        );
        this.content.push(result.join(""));
    }

    insertTag(tag, cssClass, words) {
        while (words.length) {
            let nonTags = this.extractConsecutiveWords(
                words,
                x => !isTag(x)
            );

            let specialCaseTagInjection = "";
            let specialCaseTagInjectionIsbefore = false;

            if (nonTags.length !== 0) {
                let text = wrapText(nonTags.join(""), tag, cssClass);
                this.content.push(text);
            } else {
                if (specialCaseOpeningTagRegex.test(words[0])) {
                    let matchedTag = words[0].match(specialCaseOpeningTagRegex);
                    matchedTag =
                        "<" + matchedTag[0].replace(/(<|>| )/g, "") + ">";
                    this.specialTagDiffStack.push(matchedTag);
                    specialCaseTagInjection = "<ins class=\"mod\">";
                    if (tag === "del") {
                        words.shift();

                        while (
                            words.length > 0 &&
                            specialCaseOpeningTagRegex.test(words[0])
                        ) {
                            words.shift();
                        }
                    }
                } else if (specialCaseClosingTags.has(words[0])) {
                    let openingTag =
                        this.specialTagDiffStack.length === 0
                            ? null
                            : this.specialTagDiffStack.pop();

                    // If we didn't have an opening tag, and we don't have a match with the previous tag used 
                    if (openingTag === null || openingTag !== words[words.length-1].replace(/\//g, "")) {
                        //do nothing
                    } else {    
                        specialCaseTagInjection = "</ins>";
                        specialCaseTagInjectionIsbefore = true;
                    }

                    if (tag === "del") {
                        words.shift();

                        while (
                            words.length > 0 &&
                            specialCaseClosingTags.has(words[0])
                        ) {
                            words.shift();
                        }
                    }
                }

                if (
                    words.length === 0 &&
                    specialCaseTagInjection.length === 0
                ) {
                    break;
                }

                if (specialCaseTagInjectionIsbefore) {
                    this.content.push(
                        specialCaseTagInjection +
                            this.extractConsecutiveWords(
                                words,
                                isTag
                            ).join("")
                    );
                } else {
                    this.content.push(
                        this.extractConsecutiveWords(words, isTag).join(
                            ""
                        ) + specialCaseTagInjection
                    );
                }
            }
        }
    }

    extractConsecutiveWords(words, condition) {
        let indexOfFirstTag = null;

        for (let i = 0; i < words.length; i++) {
            let word = words[i];

            if (i === 0 && word === " ") {
                words[i] = "&nbsp;";
            }

            if (!condition(word)) {
                indexOfFirstTag = i;
                break;
            }
        }

        if (indexOfFirstTag !== null) {
            let items = words.filter(
                (s, pos) => pos >= 0 && pos < indexOfFirstTag
            );
            if (indexOfFirstTag > 0) {
                words.splice(0, indexOfFirstTag);
            }

            return items;
        } else {
            let items = words.filter(
                (s, pos) => pos >= 0 && pos < words.length
            );
            words.splice(0, words.length);
            return items;
        }
    }

    operations() {
        let positionInOld = 0;
        let positionInNew = 0;
        let operations = [];

        let matches = this.matchingBlocks();
        matches.push(new Match(this.oldWords.length, this.newWords.length, 0));

        let matchesWithoutOrphans = this.removeOrphans(matches);
        let matchResult;
        let match;

        while (!(matchResult = matchesWithoutOrphans.next()).done) {
            match = matchResult.value;
            let matchStartsAtCurrentPositionInOld =
                positionInOld === match.startInOld;
            let matchStartsAtCurrentPositionInNew =
                positionInNew === match.startInNew;

            let action;

            if (
                !matchStartsAtCurrentPositionInOld &&
                !matchStartsAtCurrentPositionInNew
            ) {
                action = src_Action.replace;
            } else if (
                matchStartsAtCurrentPositionInOld &&
                !matchStartsAtCurrentPositionInNew
            ) {
                action = src_Action.insert;
            } else if (!matchStartsAtCurrentPositionInOld) {
                action = src_Action.delete;
            } else {
                action = src_Action.none;
            }

            if (action !== src_Action.none) {
                operations.push(
                    new Operation(
                        action,
                        positionInOld,
                        match.startInOld,
                        positionInNew,
                        match.startInNew
                    )
                );
            }

            if (match.length !== 0) {
                operations.push(
                    new Operation(
                        src_Action.equal,
                        match.startInOld,
                        match.endInOld,
                        match.startInNew,
                        match.endInNew
                    )
                );
            }

            positionInOld = match.endInOld;
            positionInNew = match.endInNew;
        }

        return operations;
    }

    *removeOrphans(matches) {
        let prev = null;
        let curr = null;

        for (let ix = 0; ix < matches.length; ix++) {
            const next = matches[ix];

            if (curr === null) {
                prev = new Match(0, 0, 0);
                curr = next;
                continue;
            }

            if (
                prev.endInOld === curr.startInOld &&
                    prev.endInNew === curr.startInNew ||
                curr.endInOld === next.startInOld &&
                    curr.endInNew === next.startInNew
            ) {
                yield curr;

                // eslint-disable-next-line no-unused-vars,no-extra-parens
                let tmp = (prev = curr); // "let tmp" avoids babel traspiling error
                curr = next;
                continue;
            }

            let sumLength = (t, n) => t + n.length;

            let oldDistanceInChars = this.oldWords
                .slice(prev.endInOld, next.startInOld)
                .reduce(sumLength, 0);
            let newDistanceInChars = this.newWords
                .slice(prev.endInNew, next.startInNew)
                .reduce(sumLength, 0);
            let currMatchLengthInChars = this.newWords
                .slice(curr.startInNew, curr.endInNew)
                .reduce(sumLength, 0);
            if (
                currMatchLengthInChars >
                Math.max(oldDistanceInChars, newDistanceInChars) *
                    this.orphanMatchThreshold
            ) {
                yield curr;
            }

            prev = curr;
            curr = next;
        }

        yield curr;
    }

    matchingBlocks() {
        let matchingBlocks = [];
        this.findMatchingBlocks(
            0,
            this.oldWords.length,
            0,
            this.newWords.length,
            matchingBlocks
        );
        return matchingBlocks;
    }

    findMatchingBlocks(
        startInOld,
        endInOld,
        startInNew,
        endInNew,
        matchingBlocks
    ) {
        let match = this.findMatch(startInOld, endInOld, startInNew, endInNew);

        if (match !== null) {
            if (
                startInOld < match.startInOld &&
                startInNew < match.startInNew
            ) {
                this.findMatchingBlocks(
                    startInOld,
                    match.startInOld,
                    startInNew,
                    match.startInNew,
                    matchingBlocks
                );
            }

            matchingBlocks.push(match);

            if (match.endInOld < endInOld && match.endInNew < endInNew) {
                this.findMatchingBlocks(
                    match.endInOld,
                    endInOld,
                    match.endInNew,
                    endInNew,
                    matchingBlocks
                );
            }
        }
    }

    findMatch(startInOld, endInOld, startInNew, endInNew) {
        for (let i = this.matchGranularity; i > 0; i--) {
            let options = new MatchOptions();
            options.blockSize = i;
            options.repeatingWordsAccuracy = this.repeatingWordsAccuracy;
            options.ignoreWhitespaceDifferences = this.ignoreWhiteSpaceDifferences;

            let finder = new MatchFinder(
                this.oldWords,
                this.newWords,
                startInOld,
                endInOld,
                startInNew,
                endInNew,
                options
            );
            let match = finder.findMatch();
            if (match !== null) {
                return match;
            }
        }

        return null;
    }
}

HtmlDiff.execute = function (oldText, newText) {
    return new HtmlDiff(oldText, newText).build();
};

/* harmony default export */ const Diff = (HtmlDiff);

var __webpack_exports__default = __webpack_exports__.Z;
export { __webpack_exports__default as default };
