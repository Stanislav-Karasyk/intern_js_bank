class Bank {
    constructor() {
      this.clients = [];
      this.clientId = 1;
    }
  
    addClient(name, surname, isActive) {
      const client = {
        id: this.clientId++,
        name,
        surname,
        registrationDate: new Date().toLocaleString(),
        isActive,
        accounts: [],
      };
  
      this.clients.push(client);
  
      return client;
    }
  
    addAccount (id, type){
        const account = {
            
        }
  
    }
  }
  const bank = new Bank();
  
  bank.addClient("Max", "Planck", true);
  bank.addClient("Katherine", "Blodgett", true);
  bank.addClient("Ada", "Lovelace", true);
  bank.addClient("Johannes", "Kepler", true);
  bank.addClient("Bob", "Marvel", true);
  
  
  console.log(bank);
  