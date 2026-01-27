const { setWorldConstructor } = require('@wdio/cucumber-framework')

class CustomWorld {
  constructor() {
    this.selectedUser = null
  }
}

setWorldConstructor(CustomWorld)
