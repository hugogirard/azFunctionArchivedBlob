const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const outputs = [];

    outputs.push(yield context.df.callActivity("UploadInvoices", "Tokyo"));
    outputs.push(yield context.df.callActivity("UploadInvoices", "Seattle"));
    outputs.push(yield context.df.callActivity("UploadInvoices", "London"));

    return outputs;
});