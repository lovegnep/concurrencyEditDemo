const dmp = require('diff_match_patch');
const Changeset = require('changesets').Changeset;
const engine = new dmp.diff_match_patch;

let init = "";

function get(){
    return init;
}

function computeChange(text1, text2){
    let diff = engine.diff_main(text1, text2)
    return Changeset.fromDiff(diff)
}

function merge(serialized){
    let change = Changeset.unpack(serialized);
    init = change.apply(init);
    return init;
}
exports = {
    get:get,
    merge:merge
};
Object.assign(module.exports,exports);