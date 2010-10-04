{
    baseUrl: "../js/require",
    paths: {
        lingwo_dictionary: "..",
    },
    out: "embed-reader-jquery1.4.2.uncompressed.js",
    optimize: "none",

    include: ["jquery-1.4.2","lingwo_dictionary/annotation/Embed"],
    skipModuleInsertion: true,
    pragmas: {
        jquery: true,
        requireExcludeModify: true,
        requireExcludePlugin: true,
        requireExcludeContext: true
    }
}
