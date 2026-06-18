const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.tr7ewh1.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS Error:", err);
      return;
    }

    console.log("SRV Records:");
    console.log(addresses);
  }
);