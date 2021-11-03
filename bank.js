const clients = [
  {
    id: 1,
    name: "Max",
    surname: "Planck",
    registrationDate: "Fri Oct 29 2021",
    isActive: true,
    accounts: [
      {
        type: "debit",
        creationDate: "Fri Oct 29 2021",
        expirationDate: "Tue Oct 29 2024",
        currency: "UAH",
        isActive: true,
        balance: 1000,
      },
      {
        type: "credit",
        creationDate: "Fri Oct 29 2021",
        expirationDate: "Tue Oct 29 2024",
        currency: "EUR",
        isActive: true,
        balance: 500,
        creditLimit: 1000,
        personalFunds: 0,
        usedCreditFunds: 500,
      },
    ],
  },
  {
    id: 2,
    name: "Bob",
    surname: "Marvel",
    registrationDate: "Fri Oct 29 2021",
    isActive: false,
    accounts: [
      {
        type: "debit",
        creationDate: "Fri Oct 29 2021",
        expirationDate: "Tue Oct 29 2024",
        currency: "USD",
        isActive: true,
        balance: 2000,
      },
      {
        type: "credit",
        creationDate: "Fri Oct 29 2021",
        expirationDate: "Tue Oct 29 2024",
        currency: "USD",
        isActive: true,
        balance: 1000,
        creditLimit: 3000,
        personalFunds: 0,
        usedCreditFunds: 2000,
      },
    ],
  },
];
class Bank {
  constructor(clients) {
    this.clients = clients || [];
    this.clientId = 1;
  }

  addClient(name, surname) {
    const client = {
      id: this.clientId++,
      name,
      surname,
      registrationDate: new Date().toDateString(),
      isActive: true,
      accounts: [],
    };

    this.clients.push(client);

    return client;
  }

  findClient(id) {
    return this.clients.find((client) => client.id === id);
  }

  addAccount(id, type, currency) {
    const foundСlient = this.findClient(id);

    const creationDate = new Date();
    const expirationDate = new Date(
      creationDate.setFullYear(creationDate.getFullYear() + 3)
    );

    const account = {
      type,
      currency,
      isActive: true,
      creationDate: new Date().toDateString(),
      expirationDate: expirationDate.toDateString(),
    };

    if (type === "debit") {
      account.balance = 0;
    }

    if (type === "credit") {
      account.creditLimit = 1000;
      (account.personalFunds = 0),
        (account.usedCreditFunds = 0),
        (account.balance = account.creditLimit);
    }

    foundСlient.accounts.push(account);

    return account;
  }

  convertsСurrency(rates, initial, final, amount) {
    let initialСгrrency;
    let finalСгrrency;
    let res = 0;

    for (let rate of rates) {
      if (rate.ccy === initial) {
        initialСгrrency = rate;
      }
      if (rate.ccy === final) {
        finalСгrrency = rate;
      }
    }

    if (initial === final) {
      return amount;
    }

    if (initial === "UAH") {
      res = amount / finalСгrrency.buy;
    }

    if (final === "UAH") {
      res = amount * initialСгrrency.buy;
    }

    rates.forEach((rate) => {
      if (finalСгrrency) {
        if (initial === rate.ccy) {
          res = (amount * rate.buy) / finalСгrrency.buy;
        }
      }
    });

    return Math.round(res * 100) / 100;
  }

  async getTotalAmountFunds(finalСгrrency) {
    const currencyRates = await this.getExchangeRates();
    let res = 0;

    this.clients.forEach((client) => {
      client.accounts.forEach((account) => {
        if (account.currency === finalСгrrency) {
          res += account.balance;
        } else {
          res += this.convertsСurrency(
            currencyRates,
            account.currency,
            finalСгrrency,
            account.balance
          );
        }
      });
    });

    return Math.round(res * 100) / 100;
  }

  async getTotalAmountDebts(finalСгrrency) {
    const currencyRates = await this.getExchangeRates();
    let res = 0;

    this.clients.forEach((client) => {
      client.accounts.forEach((account) => {
        if (account.usedCreditFunds) {
          if (account.currency === finalСгrrency) {
            res += account.usedCreditFunds;
          } else {
            res += this.convertsСurrency(
              currencyRates,
              account.currency,
              finalСгrrency,
              account.usedCreditFunds
            );
          }
        }
      });
    });

    return Math.round(res * 100) / 100;
  }

  async getDebtors(isActive, finalСгrrency) {
    const currencyRates = await this.getExchangeRates();
    let res = {
      debtors: 0,
      sumDebt: 0,
    };

    for (let client of this.clients) {
      for (let account of client.accounts) {
        if (client.isActive === isActive && account.usedCreditFunds) {
            res.debtors++;
            if (account.currency === finalСгrrency) {
              res.sumDebt += account.usedCreditFunds;
            } else {
              res.sumDebt += this.convertsСurrency(
                currencyRates,
                account.currency,
                finalСгrrency,
                account.usedCreditFunds
              );
          }
        }
      }
    }
    return res;
  }

  async getExchangeRates() {
    const privatbankApiUrl =
      "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";

    const data = await fetch(privatbankApiUrl).then((response) =>
      response.json()
    );

    return data;
  }
}
const bank = new Bank(clients);

