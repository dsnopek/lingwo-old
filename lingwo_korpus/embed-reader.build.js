{
    baseUrl: "../js/require",
    paths: {
        lingwo_dictionary: "..",
    },
    out: "embed-reader.js",
    optimize: "closure",

    include: ["jquery-1.4.2","lingwo_dictionary/annotation/Embed"],
    includeRequire: true,
    skipModuleInsertion: true,
    pragmas: {
        jquery: true,
        requireExcludeModify: true,
        requireExcludePlugin: true,
        requireExcludeContext: true
    }
}
