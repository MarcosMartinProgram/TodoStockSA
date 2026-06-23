const dns = require('dns');

dns.resolveSrv(
  '_mongodb._tcp.todostockdb.tbaut5k.mongodb.net',
  (err, addresses) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(addresses);
  }
);