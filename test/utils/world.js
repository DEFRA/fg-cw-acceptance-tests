const { setWorldConstructor } = require('@wdio/cucumber-framework')

class CustomWorld {
  constructor() {
    this.selectedUser = null
    this.selectedAppRoles = []
  }
}

setWorldConstructor(CustomWorld)
