{
    baseUrl: "../js/require",
    paths: {
        lingwo_dictionary: "..",
    },
    out: "embed-reader-nojquery.js",
    optimize: "closure",
    //optimize: "none",

    include: ["jquery-stubs","lingwo_dictionary/annotation/Embed"],
    includeRequire: true,
    skipModuleInsertion: true,
    pragmas: {
        requireExcludeModify: true,
        requireExcludePlugin: true,
        requireExcludeContext: true
    }
}
