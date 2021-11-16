import clients from "./clients.js";
class Bank {
  constructor(clients) {
    this.clients = clients || [];
    this.bank = document.querySelector(".bank");
    this.clientId = 4;
    this.accountId = 4;
    this.oldClient;
    this.render();
  }

  render() {
    this.showForm();

    if (document.querySelector("ul")) {
      document.querySelector("ul").remove();
    }
    if (document.querySelector(".accountsList")) {
      document.querySelector(".accountsList").remove();
    }

    let clientsList = this.bank.appendChild(document.createElement("ul"));

    let form = document.querySelector(".form");
    form.addEventListener("submit", this.handleSubmitForm.bind(this, form));

    clientsList.addEventListener("click", this.handleClick);

    this.showClientsList(clientsList);
  }

  handleSubmitForm(form, event) {
    event.preventDefault();
    if (document.querySelector(".form")) {
      document.querySelector(".form").remove();
    }
    let formData = new FormData(form);
    this.addClient(formData);
    this.addAccount(formData);
    form.remove();
  }

  handleClick(event) {
    event.preventDefault();

    if (event.target.nodeName !== "BUTTON") {
      return;
    }

    let selectedClientId = Number(event.target.closest("li").dataset.id);

    if (event.target.dataset.action === "delete") {
      if (document.querySelector(".accountsList")) {
        document.querySelector(".accountsList").remove();
      }
      clients.forEach((client, indexClient, arr) => {
        if (client.id === selectedClientId) {
          arr.splice(indexClient, 1);
        }
      });
      event.target.closest("li").remove();
    }

    if (event.target.dataset.action === "edit") {
      if (document.querySelector(".form")) {
        document.querySelector(".form").remove();
      }
      if (document.querySelector(".editForm")) {
        document.querySelector(".editForm").remove();
      }

      clients.forEach((client) => {
        if (client.id === selectedClientId) {
          newBank.editsClient(client);
        }
      });
    }

    if (event.target.dataset.action === "accounts") {
      if (document.querySelector(".accountsList")) {
        document.querySelector(".accountsList").remove();
      }

      newBank.showClientAccounts(selectedClientId);
    }
  }

  handleSubmitEditForm(editForm, event) {
    event.preventDefault();

    let formData = new FormData(editForm);

    this.addClient(formData);
    this.addAccount(formData);

    if (document.querySelector(".form")) {
      document.querySelector(".form").remove();
    }
    if (document.querySelector("ul")) {
      document.querySelector("ul").remove();
    }

    editForm.remove();

    clients.forEach((client, indexClient, arr) => {
      if (client.id === this.oldClient) {
        arr.splice(indexClient, 1);
      }
    });

    this.render();
  }

  showForm(templateClient) {
    let template = ``;
    if (templateClient) {
      template = templateClient;
    } else {
      template = `<form class="form">
      <fieldset>
        <legend>Add client</legend>
        <label>
          Name
          <input type="text" name="name" />
        </label>
        <label>
          Surname
          <input type="text" name="surname" />
        </label>
        <label>
         Is active
          <select name="isActive">
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </label>
          <label>
            Type account
            <select name="type">
              <option value="debit">debit</option>
              <option value="credit">credit</option>
            </select>
          </label>
          <label>
            Currency
            <select name="currency">
              <option value="UAH">UAH</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUR">RUR</option>
            </select>
          </label>
          <label>
            Balance
            <input type="number" name="balance" />
          </label>
          <label>
            Credit limit
            <input type="number" name="creditLimit" />
          </label>
        <button type="submit">Add</button>
      </fieldset>
    </form>`;
    }

    this.bank.insertAdjacentHTML("afterbegin", template);
  }

  showClientsList(clientsList) {
    this.clients.forEach(
      ({ id, name, surname, registrationDate, isActive }) => {
        const template = `<li class="client-item" data-id="${id}">
          <span>Name: <span>${name}</span> |</span>
          <span>Surname: <span>${surname}</span> |</span>
          <span>Registration date: <span>${registrationDate}</span> |</span>
          <span>isActive: <span>${isActive}</span> </span>
          <button type="button" data-action="accounts">accounts</button>
          <button type="button" data-action="edit">edit</button>
          <button type="button" data-action="delete">delete</button>
        </li>`;

        clientsList.insertAdjacentHTML("beforeend", template);
      }
    );
  }

  showClientAccounts(selectedClientId) {
    const accountsList = this.bank.appendChild(document.createElement("ul"));
    accountsList.classList.add("accountsList");

    let template = ``;
    this.clients.forEach((client) => {
      if (selectedClientId === client.id) {
        client.accounts.forEach((account) => {
          template = ` <li class="account-item data-id="${account.id}">
          <p>Account: <span>${account.type}</span></p>
          <p>Creation date: <span>${account.creationDate}</span></p>
          <p>Expiration date: <span>${account.expirationDate}</span></p>
          <p>Currency: <span>${account.currency}</span></p>
          <p>Is active account: <span>${account.isActive}</span></p>
          <p>Balance: <span>${account.balance}</span></p>
          <p>Credit limit: <span>${account.creditLimit}</span></p>
          <p>Personal funds: <span>${account.personalFunds}</span></p>
          <p>Used credit funds: <span>${account.usedCreditFunds}</span></p>
          </li>`;

          accountsList.insertAdjacentHTML("beforeend", template);
        });
      }
    });
  }

  editsClient(client) {
    this.oldClient = client.id;

    let templateClient = `<form class="editForm">
    <fieldset>
      <legend>Edit client</legend>
      <label>
        Name
        <input type="text" name="name" value="${client.name}" />
      </label>
      <label>
        Surname
        <input type="text" name="surname" value="${client.surname}" />
      </label>
      <label>
       Is active
        <select name="isActive">
          <option value="${client.isActive}">${client.isActive}</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </label>
        <label>
          Type account
          <select name="type">
            <option value="debit">debit</option>
            <option value="credit">credit</option>
          </select>
        </label>
        <label>
          Currency
          <select name="currency">
            <option value="UAH">UAH</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RUR">RUR</option>
          </select>
        </label>
        <label>
          Balance
          <input type="number" name="balance" />
        </label>
        <label>
          Credit limit
          <input type="number" name="creditLimit" />
        </label>
      <button type="submit">Edit</button>
    </fieldset>
  </form>`;

    newBank.showForm(templateClient);

    let editForm = document.querySelector(".editForm");
    editForm.addEventListener(
      "submit",
      this.handleSubmitEditForm.bind(this, editForm)
    );
  }

  addClient(formData) {
    const client = {
      id: this.clientId++,
      name: formData.get("name"),
      surname: formData.get("surname"),
      registrationDate: new Date().toDateString(),
      isActive: formData.get("isActive"),
      accounts: [],
    };

    this.clients.push(client);

    this.render();

    return client;
  }

  findClient(id) {
    return this.clients.find((client) => client.id === id);
  }

  addAccount(formData) {
    const foundСlient = this.findClient(this.accountId);

    const creationDate = new Date();
    const expirationDate = new Date(
      creationDate.setFullYear(creationDate.getFullYear() + 3)
    );

    const account = {
      id: this.accountId++,
      type: formData.get("type"),
      currency: formData.get("currency"),
      isActive: true,
      creationDate: new Date().toDateString(),
      expirationDate: expirationDate.toDateString(),
      balance: 0,
      creditLimit: 0,
      usedCreditFunds: 0,
      personalFunds: 0,
    };

    if (account.type === "debit") {
      account.balance = Number(formData.get("balance"));
      account.personalFunds = account.balance;
    }

    if (account.type === "credit") {
      account.creditLimit = Number(formData.get("creditLimit"));
      account.balance = Number(formData.get("balance")) + account.creditLimit;
      account.personalFunds = account.balance - account.creditLimit;
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
const newBank = new Bank(clients);

console.log(newBank.clients);
