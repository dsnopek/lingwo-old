{
    baseUrl: "../js/require",
    paths: {
        lingwo_dictionary: "..",
    },
    out: "embed-reader.uncompressed.js",
    optimize: "none",

    include: ["jquery-stubs","lingwo_dictionary/annotation/Embed"],
    skipModuleInsertion: true,
    pragmas: {
        requireExcludeModify: true,
        requireExcludePlugin: true,
        requireExcludeContext: true
    }
}
