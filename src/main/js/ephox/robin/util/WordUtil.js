define(
  'ephox.robin.util.WordUtil',

  [
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.polaris.api.Pattern',
    'ephox.polaris.api.Search',
    'global!RegExp'
  ],

  function (Fun, Option, Pattern, Search, RegExp) {

    var wordstart = new RegExp(Pattern.wordbreak() + '+', 'g');

    var zero = Fun.constant(0);

    /**
     * Returns optional text after the last word break character
     */
    var lastWord = function (text) {
      return leftBreak(text).map(function (index) {
        return text.substring(index);
      });
    };

    /**
     * Returns optional text up to the first word break character
     */
    var firstWord = function (text) {
      return rightBreak(text).map(function (index) {
        return text.substring(0, index + 1);
      });
    };

    /*
     * Returns the index position of a break when going left (i.e. last word break)
     */
    var leftBreak = function (text) {
      var indices = Search.findall(text, Pattern.custom(Pattern.wordbreak(), zero, zero));
      return Option.from(indices[indices.length - 1]).map(function (match) {
        return match.start();
      });
    };

    /*
     * Returns the index position of a break when going right (i.e. first word break)
     */
    var rightBreak = function (text) {
      // ASSUMPTION: search is sufficient because we only need to find the first one.
      var index = text.search(wordstart);
      return index > -1 ? Option.some(index) : Option.none();
    };


    var around = function (text, position) {
      var first = text.substring(0, position);
      var before = leftBreak(first).map(function (index) {
        return index + 1;
      });
      var last = text.substring(position);
      var after = rightBreak(last).map(function (index) {
        return position + index;
      });

      return {
        before: Fun.constant(before),
        after: Fun.constant(after)
      };
    };

    return {
      firstWord: firstWord,
      lastWord: lastWord,
      leftBreak: leftBreak,
      rightBreak: rightBreak,
      around: around
    };

  }
);
