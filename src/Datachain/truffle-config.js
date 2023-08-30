module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    }
  },

  compilers: {
    solc: {
      version: "0.8.0",  // Change this to whatever version is specified in your contract's pragma statement
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}